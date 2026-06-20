import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────
// sapStore: mô phỏng SAP HANA in-memory database (sapDB)
// Mọi transaction (ME21N, MIGO, MIRO, VA01...) đọc/ghi vào đây
// giống cách các module SAP thực chia sẻ chung 1 database.
// ─────────────────────────────────────────────────────────────

let nextPoNumber = 4500017001;
let nextInvoiceNumber = 5105601234;
let nextSoNumber = 30001234;

const initialVendors = [
  { id: 'V1001', name: 'Công ty TNHH Thép Hòa Phát', country: 'VN', currency: 'VND' },
  { id: 'V1002', name: 'Nippon Steel Corporation', country: 'JP', currency: 'JPY' },
  { id: 'V1003', name: 'Maersk Logistics Vietnam', country: 'VN', currency: 'USD' },
];

const initialMaterials = [
  { id: 'M-2001', name: 'Thép tấm cán nóng', unit: 'TON', price: 18500000 },
  { id: 'M-2002', name: 'Container 40ft chuẩn', unit: 'EA', price: 95000000 },
  { id: 'M-2003', name: 'Pallet gỗ tiêu chuẩn', unit: 'EA', price: 450000 },
];

const initialCustomers = [
  { id: 'C3001', name: 'Công ty CP Xây dựng Coteccons', country: 'VN' },
  { id: 'C3002', name: 'Vinamilk Logistics', country: 'VN' },
  { id: 'C3003', name: 'Samsung Electronics Vietnam', country: 'VN' },
];

export const useSapStore = create(
  persist(
    (set, get) => ({
      // ── master data ──
      vendors: initialVendors,
      customers: initialCustomers,
      materials: initialMaterials,

  // ── transactional data (cross-module) ──
  purchaseOrders: [],
  goodsReceipts: [],
  supplierInvoices: [],
  stock: [
    { materialId: 'M-2001', plant: '1010', qty: 240, unit: 'TON' },
    { materialId: 'M-2002', plant: '1010', qty: 58, unit: 'EA' },
    { materialId: 'M-2003', plant: '1010', qty: 1200, unit: 'EA' },
  ],
  salesOrders: [],
  financeDocuments: [],

  // KPI cache hiển thị trên tile (giống ảnh My Home / Finance)
  kpis: {
    overduePayables: {
      value: 40.64,
      unit: 'M EUR',
      trend: [38.2, 39.0, 41.5, 40.1, 42.3, 39.8, 40.64].map((v, i) => ({ i, v })),
    },
    cashDiscountUtilization: {
      value: 50.9,
      unit: '%',
      trend: [44.0, 47.2, 49.5, 46.8, 52.1, 48.9, 50.9].map((v, i) => ({ i, v })),
    },
    totalReceivables: {
      value: 270,
      unit: 'M',
      trend: [255, 260, 268, 262, 271, 265, 270].map((v, i) => ({ i, v })),
    },
    overdueReceivables: {
      value: 68.6,
      unit: '%',
      trend: [60.1, 62.5, 65.0, 63.8, 67.2, 64.9, 68.6].map((v, i) => ({ i, v })),
    },
  },

  // ── ME21N: Create Purchase Order ──
  createPurchaseOrder: ({ vendorId, materialId, quantity, plant = '1010' }) => {
    const vendor = get().vendors.find((v) => v.id === vendorId);
    const material = get().materials.find((m) => m.id === materialId);
    if (!vendor || !material) return null;

    const po = {
      id: String(nextPoNumber++),
      vendorId,
      vendorName: vendor.name,
      materialId,
      materialName: material.name,
      quantity: Number(quantity),
      unit: material.unit,
      netPrice: material.price,
      netValue: material.price * Number(quantity),
      plant,
      status: 'Open',
      createdAt: new Date().toISOString(),
      goodsReceived: 0,
      invoiced: 0,
    };
    set((state) => ({ purchaseOrders: [po, ...state.purchaseOrders] }));
    return po;
  },

  // ── MIGO: Post Goods Receipt against a PO ──
  postGoodsReceipt: ({ poId, quantity }) => {
    const po = get().purchaseOrders.find((p) => p.id === poId);
    if (!po) return null;
    const qty = Number(quantity);

    const gr = {
      id: 'GR-' + Date.now(),
      poId,
      materialId: po.materialId,
      materialName: po.materialName,
      quantity: qty,
      plant: po.plant,
      postedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedPOs = state.purchaseOrders.map((p) =>
        p.id === poId
          ? {
              ...p,
              goodsReceived: p.goodsReceived + qty,
              status: p.goodsReceived + qty >= p.quantity ? 'Delivered' : 'Partially Delivered',
            }
          : p
      );
      const stockIdx = state.stock.findIndex(
        (s) => s.materialId === po.materialId && s.plant === po.plant
      );
      const updatedStock = [...state.stock];
      if (stockIdx >= 0) {
        updatedStock[stockIdx] = { ...updatedStock[stockIdx], qty: updatedStock[stockIdx].qty + qty };
      } else {
        updatedStock.push({ materialId: po.materialId, plant: po.plant, qty, unit: po.unit });
      }
      return {
        purchaseOrders: updatedPOs,
        goodsReceipts: [gr, ...state.goodsReceipts],
        stock: updatedStock,
      };
    });
    return gr;
  },

  // ── MIRO: Post Supplier Invoice (Invoice Verification) ──
  postSupplierInvoice: ({ poId, amount }) => {
    const po = get().purchaseOrders.find((p) => p.id === poId);
    if (!po) return null;
    const value = Number(amount);

    const invoice = {
      id: String(nextInvoiceNumber++),
      poId,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      amount: value,
      currency: 'VND',
      status: 'Posted',
      postedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedPOs = state.purchaseOrders.map((p) =>
        p.id === poId ? { ...p, invoiced: p.invoiced + value } : p
      );
      const fiDoc = {
        id: 'FI-' + Date.now(),
        type: 'Vendor Invoice',
        reference: invoice.id,
        vendorName: po.vendorName,
        amount: value,
        postedAt: new Date().toISOString(),
      };
      return {
        purchaseOrders: updatedPOs,
        supplierInvoices: [invoice, ...state.supplierInvoices],
        financeDocuments: [fiDoc, ...state.financeDocuments],
      };
    });
    return invoice;
  },

  // ── VA01: Create Sales Order ──
  createSalesOrder: ({ customerId, materialId, quantity, plant = '1010' }) => {
    const customer = get().customers.find((c) => c.id === customerId);
    const material = get().materials.find((m) => m.id === materialId);
    if (!customer || !material) return null;
    const qty = Number(quantity);

    const stockEntry = get().stock.find((s) => s.materialId === materialId && s.plant === plant);
    const available = stockEntry ? stockEntry.qty : 0;

    const so = {
      id: String(nextSoNumber++),
      customerId,
      customerName: customer.name,
      materialId,
      materialName: material.name,
      quantity: qty,
      unit: material.unit,
      netValue: material.price * qty,
      plant,
      status: qty <= available ? 'Confirmed' : 'Backorder',
      availableAtCreation: available,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedStock =
        qty <= available
          ? state.stock.map((s) =>
              s.materialId === materialId && s.plant === plant ? { ...s, qty: s.qty - qty } : s
            )
          : state.stock;
      return {
        salesOrders: [so, ...state.salesOrders],
        stock: updatedStock,
      };
    });
    return so;
  },

  // ── Reset toàn bộ dữ liệu demo về trạng thái ban đầu ──
  resetStore: () => {
    nextPoNumber = 4500017001;
    nextInvoiceNumber = 5105601234;
    nextSoNumber = 30001234;
    set({
      vendors: initialVendors,
      customers: initialCustomers,
      materials: initialMaterials,
      purchaseOrders: [],
      goodsReceipts: [],
      supplierInvoices: [],
      stock: [
        { materialId: 'M-2001', plant: '1010', qty: 240, unit: 'TON' },
        { materialId: 'M-2002', plant: '1010', qty: 58, unit: 'EA' },
        { materialId: 'M-2003', plant: '1010', qty: 1200, unit: 'EA' },
      ],
      salesOrders: [],
      financeDocuments: [],
    });
  },
    }),
    {
      name: 'sap-sim-storage', // localStorage key
      version: 1,
    }
  )
);
