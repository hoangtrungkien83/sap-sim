// ─────────────────────────────────────────────────────────────
// Master Data mở rộng — vendor, customer, material với quy mô
// đủ lớn để cảm giác "thật" hơn một demo 3-dòng. Tên riêng (công ty,
// người) giữ nguyên không dịch — đúng thực tế nghiệp vụ quốc tế.
// Trường mô tả/category có cả vi/en để phục vụ i18n.
// ─────────────────────────────────────────────────────────────

export const VENDORS = [
  { id: 'V1001', name: 'Công ty TNHH Thép Hòa Phát', country: 'VN', currency: 'VND', category: { vi: 'Nguyên vật liệu thô', en: 'Raw Materials' } },
  { id: 'V1002', name: 'Nippon Steel Corporation', country: 'JP', currency: 'JPY', category: { vi: 'Nguyên vật liệu thô', en: 'Raw Materials' } },
  { id: 'V1003', name: 'Maersk Logistics Vietnam', country: 'VN', currency: 'USD', category: { vi: 'Vận tải & Logistics', en: 'Transportation & Logistics' } },
  { id: 'V1004', name: 'Công ty CP Bao bì Sài Gòn', country: 'VN', currency: 'VND', category: { vi: 'Bao bì đóng gói', en: 'Packaging' } },
  { id: 'V1005', name: 'Samsung SDI Vietnam', country: 'VN', currency: 'USD', category: { vi: 'Linh kiện điện tử', en: 'Electronic Components' } },
  { id: 'V1006', name: 'Công ty TNHH Nhựa Bình Minh', country: 'VN', currency: 'VND', category: { vi: 'Vật liệu nhựa', en: 'Plastic Materials' } },
  { id: 'V1007', name: 'PTT Global Chemical', country: 'TH', currency: 'USD', category: { vi: 'Hóa chất công nghiệp', en: 'Industrial Chemicals' } },
  { id: 'V1008', name: 'Công ty CP Vận tải Gemadept', country: 'VN', currency: 'VND', category: { vi: 'Vận tải & Logistics', en: 'Transportation & Logistics' } },
  { id: 'V1009', name: 'Foxconn Technology Group', country: 'TW', currency: 'USD', category: { vi: 'Linh kiện điện tử', en: 'Electronic Components' } },
  { id: 'V1010', name: 'Công ty TNHH Gỗ An Cường', country: 'VN', currency: 'VND', category: { vi: 'Vật liệu xây dựng', en: 'Construction Materials' } },
  { id: 'V1011', name: 'Hoà Bình Minh Logistics', country: 'VN', currency: 'VND', category: { vi: 'Vận tải & Logistics', en: 'Transportation & Logistics' } },
  { id: 'V1012', name: 'Mitsubishi Electric Vietnam', country: 'JP', currency: 'JPY', category: { vi: 'Thiết bị công nghiệp', en: 'Industrial Equipment' } },
];

export const CUSTOMERS = [
  { id: 'C3001', name: 'Công ty CP Xây dựng Coteccons', country: 'VN', industry: { vi: 'Xây dựng', en: 'Construction' } },
  { id: 'C3002', name: 'Vinamilk Logistics', country: 'VN', industry: { vi: 'Thực phẩm & Đồ uống', en: 'Food & Beverage' } },
  { id: 'C3003', name: 'Samsung Electronics Vietnam', country: 'VN', industry: { vi: 'Điện tử', en: 'Electronics' } },
  { id: 'C3004', name: 'Công ty CP Tập đoàn Hòa Phát', country: 'VN', industry: { vi: 'Luyện kim', en: 'Metallurgy' } },
  { id: 'C3005', name: 'Vingroup JSC', country: 'VN', industry: { vi: 'Bất động sản & Đa ngành', en: 'Real Estate & Conglomerate' } },
  { id: 'C3006', name: 'Toyota Motor Vietnam', country: 'VN', industry: { vi: 'Ô tô', en: 'Automotive' } },
  { id: 'C3007', name: 'Công ty CP Sữa TH True Milk', country: 'VN', industry: { vi: 'Thực phẩm & Đồ uống', en: 'Food & Beverage' } },
  { id: 'C3008', name: 'LG Display Vietnam', country: 'VN', industry: { vi: 'Điện tử', en: 'Electronics' } },
  { id: 'C3009', name: 'Công ty CP Thế Giới Di Động', country: 'VN', industry: { vi: 'Bán lẻ', en: 'Retail' } },
  { id: 'C3010', name: 'Heineken Vietnam Brewery', country: 'VN', industry: { vi: 'Thực phẩm & Đồ uống', en: 'Food & Beverage' } },
];

export const MATERIALS = [
  { id: 'M-2001', name: { vi: 'Thép tấm cán nóng', en: 'Hot-Rolled Steel Sheet' }, unit: 'TON', price: 18500000, costPrice: 15725000, category: { vi: 'Nguyên vật liệu thô', en: 'Raw Materials' } },
  { id: 'M-2002', name: { vi: 'Container 40ft chuẩn', en: 'Standard 40ft Container' }, unit: 'EA', price: 95000000, costPrice: 80750000, category: { vi: 'Bao bì đóng gói', en: 'Packaging' } },
  { id: 'M-2003', name: { vi: 'Pallet gỗ tiêu chuẩn', en: 'Standard Wooden Pallet' }, unit: 'EA', price: 450000, costPrice: 337500, category: { vi: 'Bao bì đóng gói', en: 'Packaging' } },
  { id: 'M-2004', name: { vi: 'Hạt nhựa PP nguyên sinh', en: 'Virgin PP Resin Pellets' }, unit: 'TON', price: 32000000, costPrice: 27200000, category: { vi: 'Vật liệu nhựa', en: 'Plastic Materials' } },
  { id: 'M-2005', name: { vi: 'Bo mạch chủ điện tử', en: 'Electronic Mainboard' }, unit: 'EA', price: 2800000, costPrice: 1820000, category: { vi: 'Linh kiện điện tử', en: 'Electronic Components' } },
  { id: 'M-2006', name: { vi: 'Hóa chất xử lý nước thải', en: 'Wastewater Treatment Chemical' }, unit: 'TON', price: 24500000, costPrice: 19600000, category: { vi: 'Hóa chất công nghiệp', en: 'Industrial Chemicals' } },
  { id: 'M-2007', name: { vi: 'Ván gỗ công nghiệp MDF', en: 'MDF Engineered Wood Panel' }, unit: 'EA', price: 680000, costPrice: 510000, category: { vi: 'Vật liệu xây dựng', en: 'Construction Materials' } },
  { id: 'M-2008', name: { vi: 'Động cơ điện công nghiệp 5HP', en: 'Industrial Electric Motor 5HP' }, unit: 'EA', price: 8200000, costPrice: 5740000, category: { vi: 'Thiết bị công nghiệp', en: 'Industrial Equipment' } },
  { id: 'M-2009', name: { vi: 'Cuộn dây cáp đồng', en: 'Copper Cable Coil' }, unit: 'EA', price: 5400000, costPrice: 4320000, category: { vi: 'Linh kiện điện tử', en: 'Electronic Components' } },
  { id: 'M-2010', name: { vi: 'Bao bì carton 3 lớp', en: '3-Ply Carton Box' }, unit: 'EA', price: 12000, costPrice: 9000, category: { vi: 'Bao bì đóng gói', en: 'Packaging' } },
];

export const PLANTS = [
  { id: '1010', name: { vi: 'Nhà máy Bắc Ninh', en: 'Bac Ninh Plant' } },
  { id: '1020', name: { vi: 'Nhà máy Đà Nẵng', en: 'Da Nang Plant' } },
];

export function getMaterialName(material, lang) {
  if (!material) return '';
  return typeof material.name === 'object' ? material.name[lang] ?? material.name.vi : material.name;
}
