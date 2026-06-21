// ─────────────────────────────────────────────────────────────
// Seed data: dữ liệu giao dịch mẫu để app khởi động đã "có sẵn"
// lịch sử hoạt động thay vì hoàn toàn trống — giống một hệ thống
// SAP thật đã chạy được vài tháng. Toàn bộ document flow (PO → GR
// → Invoice → FI, SO → Billing → FI) được seed nhất quán, để
// Document Flow timeline hiển thị đúng ngay từ đầu.
//
// Lưu ý: stock trong sapStore.js đã trừ sẵn theo các SO seed ở đây,
// nên không cần đồng bộ lại — chỉ cần đảm bảo 2 file khớp số liệu.
// ─────────────────────────────────────────────────────────────

import { VENDORS, CUSTOMERS, MATERIALS, getMaterialName } from './masterData';

const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

function mat(id) {
  return MATERIALS.find((m) => m.id === id);
}
function vendor(id) {
  return VENDORS.find((v) => v.id === id);
}
function customer(id) {
  return CUSTOMERS.find((c) => c.id === id);
}

// Snapshot tên vật tư bằng tiếng Việt tại "thời điểm tạo chứng từ"
// — đúng hành vi SAP thật: document giữ nguyên giá trị lúc post,
// không tự cập nhật theo master data hay theo ngôn ngữ UI sau này.
function matNameVi(id) {
  return getMaterialName(mat(id), 'vi');
}

// ── Purchase Orders (đã có Goods Receipt + Invoice ở các mức độ khác nhau) ──
export const SEED_PURCHASE_ORDERS = [
  {
    id: '4500016001',
    vendorId: 'V1001',
    vendorName: vendor('V1001').name,
    materialId: 'M-2001',
    materialName: matNameVi('M-2001'),
    quantity: 200,
    unit: 'TON',
    netPrice: mat('M-2001').price,
    netValue: mat('M-2001').price * 200,
    plant: '1010',
    status: 'Delivered',
    createdAt: day(45),
    goodsReceived: 200,
    invoiced: mat('M-2001').price * 200,
  },
  {
    id: '4500016002',
    vendorId: 'V1004',
    vendorName: vendor('V1004').name,
    materialId: 'M-2010',
    materialName: matNameVi('M-2010'),
    quantity: 5000,
    unit: 'EA',
    netPrice: mat('M-2010').price,
    netValue: mat('M-2010').price * 5000,
    plant: '1010',
    status: 'Delivered',
    createdAt: day(38),
    goodsReceived: 5000,
    invoiced: mat('M-2010').price * 5000,
  },
  {
    id: '4500016003',
    vendorId: 'V1005',
    vendorName: vendor('V1005').name,
    materialId: 'M-2005',
    materialName: matNameVi('M-2005'),
    quantity: 300,
    unit: 'EA',
    netPrice: mat('M-2005').price,
    netValue: mat('M-2005').price * 300,
    plant: '1020',
    status: 'Partially Delivered',
    createdAt: day(20),
    goodsReceived: 180,
    invoiced: mat('M-2005').price * 180,
  },
  {
    id: '4500016004',
    vendorId: 'V1007',
    vendorName: vendor('V1007').name,
    materialId: 'M-2006',
    materialName: matNameVi('M-2006'),
    quantity: 40,
    unit: 'TON',
    netPrice: mat('M-2006').price,
    netValue: mat('M-2006').price * 40,
    plant: '1010',
    status: 'Open',
    createdAt: day(6),
    goodsReceived: 0,
    invoiced: 0,
  },
  {
    id: '4500016005',
    vendorId: 'V1010',
    vendorName: vendor('V1010').name,
    materialId: 'M-2007',
    materialName: matNameVi('M-2007'),
    quantity: 800,
    unit: 'EA',
    netPrice: mat('M-2007').price,
    netValue: mat('M-2007').price * 800,
    plant: '1020',
    status: 'Delivered',
    createdAt: day(15),
    goodsReceived: 800,
    invoiced: mat('M-2007').price * 800,
  },
  {
    id: '4500016006',
    vendorId: 'V1012',
    vendorName: vendor('V1012').name,
    materialId: 'M-2008',
    materialName: matNameVi('M-2008'),
    quantity: 25,
    unit: 'EA',
    netPrice: mat('M-2008').price,
    netValue: mat('M-2008').price * 25,
    plant: '1010',
    status: 'Open',
    createdAt: day(2),
    goodsReceived: 0,
    invoiced: 0,
  },
  {
    // PO giá trị lớn (6 container × 95 triệu = 570 triệu, vượt ngưỡng 500
    // triệu) để minh họa ngay tính năng Approval Workflow khi mở app lần đầu.
    id: '4500016007',
    vendorId: 'V1003',
    vendorName: vendor('V1003').name,
    materialId: 'M-2002',
    materialName: matNameVi('M-2002'),
    quantity: 6,
    unit: 'EA',
    netPrice: mat('M-2002').price,
    netValue: mat('M-2002').price * 6,
    plant: '1010',
    status: 'Pending Approval',
    createdAt: day(1),
    goodsReceived: 0,
    invoiced: 0,
  },
];

// ── Goods Receipts tương ứng với các PO đã Delivered/Partially Delivered ──
export const SEED_GOODS_RECEIPTS = [
  { id: 'GR-seed-1', poId: '4500016001', materialId: 'M-2001', materialName: matNameVi('M-2001'), quantity: 200, plant: '1010', postedAt: day(40) },
  { id: 'GR-seed-2', poId: '4500016002', materialId: 'M-2010', materialName: matNameVi('M-2010'), quantity: 5000, plant: '1010', postedAt: day(33) },
  { id: 'GR-seed-3', poId: '4500016003', materialId: 'M-2005', materialName: matNameVi('M-2005'), quantity: 180, plant: '1020', postedAt: day(14) },
  { id: 'GR-seed-4', poId: '4500016005', materialId: 'M-2007', materialName: matNameVi('M-2007'), quantity: 800, plant: '1020', postedAt: day(10) },
];

// ── Supplier Invoices tương ứng ──
export const SEED_SUPPLIER_INVOICES = [
  { id: '5105601001', poId: '4500016001', vendorId: 'V1001', vendorName: vendor('V1001').name, amount: mat('M-2001').price * 200, currency: 'VND', status: 'Posted', postedAt: day(39) },
  { id: '5105601002', poId: '4500016002', vendorId: 'V1004', vendorName: vendor('V1004').name, amount: mat('M-2010').price * 5000, currency: 'VND', status: 'Posted', postedAt: day(32) },
  { id: '5105601003', poId: '4500016003', vendorId: 'V1005', vendorName: vendor('V1005').name, amount: mat('M-2005').price * 180, currency: 'VND', status: 'Posted', postedAt: day(13) },
  { id: '5105601004', poId: '4500016005', vendorId: 'V1010', vendorName: vendor('V1010').name, amount: mat('M-2007').price * 800, currency: 'VND', status: 'Posted', postedAt: day(9) },
];

// ── Sales Orders (đa dạng trạng thái: Confirmed, Billed, Backorder) ──
export const SEED_SALES_ORDERS = [
  {
    id: '30001001',
    customerId: 'C3001',
    customerName: customer('C3001').name,
    materialId: 'M-2007',
    materialName: matNameVi('M-2007'),
    quantity: 150,
    unit: 'EA',
    netValue: mat('M-2007').price * 150,
    plant: '1020',
    status: 'Billed',
    availableAtCreation: 600,
    createdAt: day(25),
  },
  {
    id: '30001002',
    customerId: 'C3003',
    customerName: customer('C3003').name,
    materialId: 'M-2005',
    materialName: matNameVi('M-2005'),
    quantity: 50,
    unit: 'EA',
    netValue: mat('M-2005').price * 50,
    plant: '1020',
    status: 'Billed',
    availableAtCreation: 120,
    createdAt: day(17),
  },
  {
    id: '30001003',
    customerId: 'C3004',
    customerName: customer('C3004').name,
    materialId: 'M-2001',
    materialName: matNameVi('M-2001'),
    quantity: 80,
    unit: 'TON',
    netValue: mat('M-2001').price * 80,
    plant: '1010',
    status: 'Confirmed',
    availableAtCreation: 160,
    createdAt: day(8),
  },
  {
    id: '30001004',
    customerId: 'C3006',
    customerName: customer('C3006').name,
    materialId: 'M-2009',
    materialName: matNameVi('M-2009'),
    quantity: 300,
    unit: 'EA',
    netValue: mat('M-2009').price * 300,
    plant: '1010',
    status: 'Backorder',
    availableAtCreation: 40,
    createdAt: day(4),
  },
  {
    id: '30001005',
    customerId: 'C3009',
    customerName: customer('C3009').name,
    materialId: 'M-2010',
    materialName: matNameVi('M-2010'),
    quantity: 2000,
    unit: 'EA',
    netValue: mat('M-2010').price * 2000,
    plant: '1010',
    status: 'Confirmed',
    availableAtCreation: 3000,
    createdAt: day(1),
  },
];

// ── Billing Documents tương ứng SO đã Billed ──
export const SEED_BILLING_DOCUMENTS = [
  {
    id: '90034001',
    soId: '30001001',
    customerId: 'C3001',
    customerName: customer('C3001').name,
    materialId: 'M-2007',
    materialName: matNameVi('M-2007'),
    quantity: 150,
    unit: 'EA',
    netValue: mat('M-2007').price * 150,
    currency: 'VND',
    status: 'Posted',
    postedAt: day(24),
  },
  {
    id: '90034002',
    soId: '30001002',
    customerId: 'C3003',
    customerName: customer('C3003').name,
    materialId: 'M-2005',
    materialName: matNameVi('M-2005'),
    quantity: 50,
    unit: 'EA',
    netValue: mat('M-2005').price * 50,
    currency: 'VND',
    status: 'Posted',
    postedAt: day(16),
  },
];

// ── FI Documents tương ứng (Vendor Invoice + Customer Invoice) ──
export const SEED_FINANCE_DOCUMENTS = [
  { id: 'FI-seed-1', type: 'Vendor Invoice', reference: '5105601001', vendorName: vendor('V1001').name, amount: mat('M-2001').price * 200, postedAt: day(39) },
  { id: 'FI-seed-2', type: 'Vendor Invoice', reference: '5105601002', vendorName: vendor('V1004').name, amount: mat('M-2010').price * 5000, postedAt: day(32) },
  { id: 'FI-seed-3', type: 'Vendor Invoice', reference: '5105601003', vendorName: vendor('V1005').name, amount: mat('M-2005').price * 180, postedAt: day(13) },
  { id: 'FI-seed-4', type: 'Vendor Invoice', reference: '5105601004', vendorName: vendor('V1010').name, amount: mat('M-2007').price * 800, postedAt: day(9) },
  { id: 'FI-seed-5', type: 'Customer Invoice', reference: '90034001', vendorName: customer('C3001').name, amount: mat('M-2007').price * 150, postedAt: day(24) },
  { id: 'FI-seed-6', type: 'Customer Invoice', reference: '90034002', vendorName: customer('C3003').name, amount: mat('M-2005').price * 50, postedAt: day(16) },
];

// ── Stock sau khi đã trừ/cộng theo toàn bộ seed PO/SO ở trên ──
// Công thức mỗi material: tồn ban đầu giả định + GR seed - SO seed đã Confirmed/Billed
export const SEED_STOCK = [
  { materialId: 'M-2001', plant: '1010', qty: 240 + 200 - 80, unit: 'TON' }, // 360
  { materialId: 'M-2002', plant: '1010', qty: 58, unit: 'EA' },
  { materialId: 'M-2003', plant: '1010', qty: 1200, unit: 'EA' },
  { materialId: 'M-2004', plant: '1010', qty: 95, unit: 'TON' },
  { materialId: 'M-2005', plant: '1020', qty: 120 + 180 - 50, unit: 'EA' }, // 250
  { materialId: 'M-2006', plant: '1010', qty: 12, unit: 'TON' },
  { materialId: 'M-2007', plant: '1020', qty: 600 + 800 - 150, unit: 'EA' }, // 1250
  { materialId: 'M-2008', plant: '1010', qty: 30, unit: 'EA' },
  { materialId: 'M-2009', plant: '1010', qty: 40, unit: 'EA' }, // thấp, gây Backorder cho SO seed
  { materialId: 'M-2010', plant: '1010', qty: 3000 + 5000 - 2000, unit: 'EA' }, // 6000
];
