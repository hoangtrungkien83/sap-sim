import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VENDORS, CUSTOMERS, MATERIALS, getMaterialName } from '../data/masterData';
import {
  SEED_PURCHASE_ORDERS,
  SEED_GOODS_RECEIPTS,
  SEED_SUPPLIER_INVOICES,
  SEED_SALES_ORDERS,
  SEED_BILLING_DOCUMENTS,
  SEED_FINANCE_DOCUMENTS,
  SEED_STOCK,
} from '../data/seedData';

// ─────────────────────────────────────────────────────────────
// sapStore: mô phỏng SAP HANA in-memory database (sapDB)
// Mọi transaction (ME21N, MIGO, MIRO, VA01...) đọc/ghi vào đây
// giống cách các module SAP thực chia sẻ chung 1 database.
// Master data (vendor/customer/material) nằm trong data/masterData.js,
// dữ liệu giao dịch khởi tạo (seed) nằm trong data/seedData.js —
// store chỉ chứa logic nghiệp vụ, không hardcode dữ liệu.
// ─────────────────────────────────────────────────────────────

let nextPoNumber = 4500017001;
let nextInvoiceNumber = 5105602001;
let nextSoNumber = 30002001;
let nextBillingNumber = 90035001;

export const useSapStore = create(
  persist(
    (set, get) => ({
      // ── master data ──
      vendors: VENDORS,
      customers: CUSTOMERS,
      materials: MATERIALS,

      // ── transactional data (cross-module), khởi tạo từ seed ──
      purchaseOrders: SEED_PURCHASE_ORDERS,
      goodsReceipts: SEED_GOODS_RECEIPTS,
      supplierInvoices: SEED_SUPPLIER_INVOICES,
      stock: SEED_STOCK,
      salesOrders: SEED_SALES_ORDERS,
      billingDocuments: SEED_BILLING_DOCUMENTS,
      financeDocuments: SEED_FINANCE_DOCUMENTS,

      // KPI giờ được TÍNH TOÁN ĐỘNG từ dữ liệu thật qua getKpis() bên dưới,
      // không còn là số liệu tĩnh tách rời khỏi store (xem getKpis).

      // Ngưỡng release strategy: PO trên 500 triệu VND cần phê duyệt trước
      // khi có thể nhận hàng (MIGO) hoặc xuất hóa đơn (MIRO) — mô phỏng
      // release strategy theo giá trị, một cơ chế chuẩn trong SAP MM thật.
      PO_APPROVAL_THRESHOLD: 500000000,

      // ── ME21N: Create Purchase Order ──
      createPurchaseOrder: ({ vendorId, materialId, quantity, plant = '1010' }) => {
        const vendor = get().vendors.find((v) => v.id === vendorId);
        const material = get().materials.find((m) => m.id === materialId);
        if (!vendor || !material) return null;

        const netValue = material.price * Number(quantity);
        const needsApproval = netValue > get().PO_APPROVAL_THRESHOLD;

        const po = {
          id: String(nextPoNumber++),
          vendorId,
          vendorName: vendor.name,
          materialId,
          materialName: getMaterialName(material, 'vi'),
          quantity: Number(quantity),
          unit: material.unit,
          netPrice: material.price,
          netValue,
          plant,
          status: needsApproval ? 'Pending Approval' : 'Open',
          createdAt: new Date().toISOString(),
          goodsReceived: 0,
          invoiced: 0,
        };
        set((state) => ({ purchaseOrders: [po, ...state.purchaseOrders] }));
        return po;
      },

      // ── Phê duyệt PO đang Pending Approval (release strategy) ──
      approvePurchaseOrder: (poId) => {
        const po = get().purchaseOrders.find((p) => p.id === poId);
        if (!po || po.status !== 'Pending Approval') return null;
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((p) =>
            p.id === poId ? { ...p, status: 'Open', approvedAt: new Date().toISOString() } : p
          ),
        }));
        return { ...po, status: 'Open' };
      },

      // ── MIGO: Post Goods Receipt against a PO ──
      // Sau khi cộng kho, tự động quét các Sales Order đang Backorder cùng
      // material/plant theo thứ tự FIFO (tạo trước được ưu tiên trước, đúng
      // nguyên tắc phân bổ ATP công bằng của SAP) và xác nhận nếu đủ hàng.
      postGoodsReceipt: ({ poId, quantity }) => {
        const po = get().purchaseOrders.find((p) => p.id === poId);
        if (!po) return null;
        if (po.status === 'Pending Approval') return null; // chưa được duyệt, không thể nhận hàng
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

        let autoConfirmedSOs = [];
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
          let updatedStock = [...state.stock];
          if (stockIdx >= 0) {
            updatedStock[stockIdx] = { ...updatedStock[stockIdx], qty: updatedStock[stockIdx].qty + qty };
          } else {
            updatedStock.push({ materialId: po.materialId, plant: po.plant, qty, unit: po.unit });
          }

          // Re-check ATP cho các SO Backorder cùng material+plant, FIFO theo createdAt
          const backorderCandidates = state.salesOrders
            .filter((so) => so.status === 'Backorder' && so.materialId === po.materialId && so.plant === po.plant)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          const confirmedIds = new Set();
          let currentStockIdx = updatedStock.findIndex((s) => s.materialId === po.materialId && s.plant === po.plant);
          for (const so of backorderCandidates) {
            const availableNow = updatedStock[currentStockIdx]?.qty ?? 0;
            if (so.quantity <= availableNow) {
              updatedStock = updatedStock.map((s, idx) =>
                idx === currentStockIdx ? { ...s, qty: s.qty - so.quantity } : s
              );
              confirmedIds.add(so.id);
            } else {
              // Hết kho hoặc không đủ — các SO sau trong hàng đợi FIFO vẫn chờ
              break;
            }
          }

          const updatedSalesOrders = state.salesOrders.map((so) =>
            confirmedIds.has(so.id) ? { ...so, status: 'Confirmed', confirmedAt: new Date().toISOString() } : so
          );
          autoConfirmedSOs = updatedSalesOrders.filter((so) => confirmedIds.has(so.id));

          return {
            purchaseOrders: updatedPOs,
            goodsReceipts: [gr, ...state.goodsReceipts],
            stock: updatedStock,
            salesOrders: updatedSalesOrders,
          };
        });
        return { ...gr, autoConfirmedSOs };
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
          materialName: getMaterialName(material, 'vi'),
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

      // ── VF01: Create Billing Document from a confirmed Sales Order ──
      createBillingDocument: ({ soId }) => {
        const so = get().salesOrders.find((s) => s.id === soId);
        if (!so) return null;
        if (so.status !== 'Confirmed') return null;

        const billing = {
          id: String(nextBillingNumber++),
          soId,
          customerId: so.customerId,
          customerName: so.customerName,
          materialId: so.materialId,
          materialName: so.materialName,
          quantity: so.quantity,
          unit: so.unit,
          netValue: so.netValue,
          currency: 'VND',
          status: 'Posted',
          postedAt: new Date().toISOString(),
        };

        const fiDoc = {
          id: 'FI-' + Date.now(),
          type: 'Customer Invoice',
          reference: billing.id,
          vendorName: so.customerName,
          amount: so.netValue,
          postedAt: new Date().toISOString(),
        };

        set((state) => ({
          billingDocuments: [billing, ...state.billingDocuments],
          financeDocuments: [fiDoc, ...state.financeDocuments],
          salesOrders: state.salesOrders.map((s) => (s.id === soId ? { ...s, status: 'Billed' } : s)),
        }));
        return billing;
      },

      // ── Document Flow: truy vết toàn bộ chứng từ liên quan tới 1 PO ──
      // (giống tab "Document Flow" trong ME23N/PO Detail của SAP thật)
      getPoDocumentFlow: (poId) => {
        const state = get();
        const po = state.purchaseOrders.find((p) => p.id === poId);
        if (!po) return [];
        const flow = [{ type: 'Purchase Order', id: po.id, status: po.status, date: po.createdAt }];
        state.goodsReceipts
          .filter((gr) => gr.poId === poId)
          .forEach((gr) => flow.push({ type: 'Goods Receipt', id: gr.id, status: 'Posted', date: gr.postedAt }));
        state.supplierInvoices
          .filter((inv) => inv.poId === poId)
          .forEach((inv) => flow.push({ type: 'Supplier Invoice', id: inv.id, status: inv.status, date: inv.postedAt }));
        state.financeDocuments
          .filter((fi) => state.supplierInvoices.some((inv) => inv.poId === poId && inv.id === fi.reference))
          .forEach((fi) => flow.push({ type: 'FI Document', id: fi.id, status: 'Posted', date: fi.postedAt }));
        return flow.sort((a, b) => new Date(a.date) - new Date(b.date));
      },

      // ── Document Flow cho Sales Order (SO → Billing → FI) ──
      getSoDocumentFlow: (soId) => {
        const state = get();
        const so = state.salesOrders.find((s) => s.id === soId);
        if (!so) return [];
        const flow = [{ type: 'Sales Order', id: so.id, status: so.status, date: so.createdAt }];
        state.billingDocuments
          .filter((b) => b.soId === soId)
          .forEach((b) => flow.push({ type: 'Billing Document', id: b.id, status: b.status, date: b.postedAt }));
        state.financeDocuments
          .filter((fi) => state.billingDocuments.some((b) => b.soId === soId && b.id === fi.reference))
          .forEach((fi) => flow.push({ type: 'FI Document', id: fi.id, status: 'Posted', date: fi.postedAt }));
        return flow.sort((a, b) => new Date(a.date) - new Date(b.date));
      },

      // ── KPI tính động từ dữ liệu thật, không còn số tĩnh tách rời ──
      // overduePayables / overdueReceivables: ngưỡng quá hạn giả định 30 ngày
      // kể từ ngày đăng chứng từ (app chưa có khái niệm "đã thanh toán" tách
      // biệt, nên coi invoice/billing cũ hơn 30 ngày là chưa thu/chưa trả).
      // Đơn vị đồng nhất VND, khớp với mọi giao dịch trong store — không còn
      // lệch đơn vị EUR như bản trước.
      getKpis: () => {
        const state = get();
        const now = Date.now();
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;

        const overdueInvoices = state.supplierInvoices.filter(
          (inv) => now - new Date(inv.postedAt).getTime() > THIRTY_DAYS
        );
        const overduePayablesValue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

        const earlyPaidCount = state.supplierInvoices.filter(
          (inv) => now - new Date(inv.postedAt).getTime() <= TEN_DAYS
        ).length;
        const cashDiscountPct =
          state.supplierInvoices.length === 0
            ? 0
            : (earlyPaidCount / state.supplierInvoices.length) * 100;

        const totalReceivablesValue = state.billingDocuments.reduce((sum, b) => sum + b.netValue, 0);

        const overdueBillings = state.billingDocuments.filter(
          (b) => now - new Date(b.postedAt).getTime() > THIRTY_DAYS
        );
        const overdueReceivablesValue = overdueBillings.reduce((sum, b) => sum + b.netValue, 0);
        const overdueReceivablesPct =
          totalReceivablesValue === 0 ? 0 : (overdueReceivablesValue / totalReceivablesValue) * 100;

        // Trend giả lập 7 điểm quanh giá trị hiện tại (biến thiên nhẹ ±8%)
        // để sparkline có hình dạng, vì app không lưu lịch sử KPI theo ngày.
        const buildTrend = (value) => {
          const seedVariants = [0.94, 0.97, 1.03, 0.96, 1.05, 0.98, 1];
          return seedVariants.map((mult, i) => ({ i, v: Number((value * mult).toFixed(2)) }));
        };

        return {
          overduePayables: {
            value: Number((overduePayablesValue / 1e6).toFixed(2)),
            unit: 'M VND',
            trend: buildTrend(overduePayablesValue / 1e6),
          },
          cashDiscountUtilization: {
            value: Number(cashDiscountPct.toFixed(1)),
            unit: '%',
            trend: buildTrend(cashDiscountPct),
          },
          totalReceivables: {
            value: Number((totalReceivablesValue / 1e6).toFixed(1)),
            unit: 'M VND',
            trend: buildTrend(totalReceivablesValue / 1e6),
          },
          overdueReceivables: {
            value: Number(overdueReceivablesPct.toFixed(1)),
            unit: '%',
            trend: buildTrend(overdueReceivablesPct),
          },
        };
      },

      // ── Reset toàn bộ dữ liệu demo về trạng thái seed ban đầu ──
      resetStore: () => {
        nextPoNumber = 4500017001;
        nextInvoiceNumber = 5105602001;
        nextSoNumber = 30002001;
        nextBillingNumber = 90035001;
        set({
          vendors: VENDORS,
          customers: CUSTOMERS,
          materials: MATERIALS,
          purchaseOrders: SEED_PURCHASE_ORDERS,
          goodsReceipts: SEED_GOODS_RECEIPTS,
          supplierInvoices: SEED_SUPPLIER_INVOICES,
          stock: SEED_STOCK,
          salesOrders: SEED_SALES_ORDERS,
          billingDocuments: SEED_BILLING_DOCUMENTS,
          financeDocuments: SEED_FINANCE_DOCUMENTS,
        });
      },
    }),
    {
      name: 'sap-sim-storage-v2', // đổi key vì shape data đã thay đổi (tránh xung đột với localStorage cũ)
      version: 2,
    }
  )
);
