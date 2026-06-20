# SAP S/4HANA Fiori Simulation (React)

Portfolio project mô phỏng giao diện SAP S/4HANA Cloud Public Edition (Fiori Launchpad),
dựa trên screenshot thực tế từ hệ thống trial.

## Chạy thử

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Build production

```bash
npm run build
```

## Kiến trúc

- `src/store/sapStore.js` — Zustand store mô phỏng SAP HANA in-memory DB.
  Các transaction (ME21N, MIGO, MIRO, VA01) đọc/ghi chung 1 store, tạo data flow
  xuyên module giống hệ thống SAP thực (PO → Goods Receipt → Invoice → FI document).
- `src/data/launchpadData.js` — Định nghĩa nav tabs + section + tile cho từng module.
- `src/components/FioriShell.jsx` — Top bar + nav tabs (giống ảnh chụp SAP gốc).
- `src/components/Tiles.jsx` — 3 loại tile: KpiTile (số liệu), NavTile (điều hướng), CountTile (đếm).
- `src/pages/` — Các trang module: MyHome, Finance, Procurement, Manufacturing.
- `src/pages/transactions/` — Form giao dịch thật: ME21N (tạo PO), MIGO (nhận hàng), MIRO (hóa đơn).
- `src/pages/ListPage.jsx` — Bảng hiển thị data: vendor list, invoice list, stock (MB52).

## Data flow demo

1. Vào **Procurement → Manage Purchase Orders** → tạo PO mới (ME21N).
2. Sau khi tạo, bấm "Tiếp tục: Post Goods Receipt" → MIGO tự động điền PO vừa tạo.
3. Nhận hàng → tồn kho (MB52) tự cập nhật, PO chuyển trạng thái Delivered.
4. Bấm "Tiếp tục: Create Supplier Invoice" → MIRO tự điền PO, đề xuất số tiền.
5. Đăng hóa đơn → bút toán FI tự sinh, xuất hiện trong Finance > Accounts Payable.
6. Vào **Sales → Create Sales Order** (VA01) → chọn khách hàng + vật tư → hệ thống
   tự kiểm tra tồn kho (ATP check đơn giản): đủ hàng thì "Confirmed" và trừ kho,
   thiếu hàng thì "Backorder".

## Đã hoàn thành (Phase 1 + 2 + 3)

- [x] Fiori Shell (top bar + nav tabs) giống ảnh chụp gốc
- [x] My Home với Pages cards màu + Insights Tiles
- [x] Finance, Procurement, Manufacturing module với tile/section thật
- [x] ME21N (Create PO), MIGO (Goods Receipt), MIRO (Supplier Invoice), VA01 (Sales Order)
- [x] Data flow xuyên module qua Zustand store (PO → GR → Invoice → FI doc; SO → trừ kho)
- [x] Recharts sparkline trong KPI tile (xu hướng 7 điểm dữ liệu)
- [x] "All My Apps" panel 2 cột (mở từ nút Home trên thanh top bar)
- [x] localStorage persistence (Zustand `persist` middleware, key `sap-sim-storage`)
- [x] Nút "Reset Demo" ở My Home để xóa toàn bộ dữ liệu transaction và khôi phục ban đầu

## Roadmap (Phase tiếp theo, nếu muốn mở rộng thêm)

- [ ] Project Management module (PS)
- [ ] Billing document thật cho Sales (liên kết SO → Billing → FI)
- [ ] Search bar hoạt động thật (tìm app/tile theo tên)
- [ ] Notification bell có nội dung (vd: "PO vượt ngân sách", "SO backorder")
- [ ] Responsive mobile layout cho nav tabs (hiện đã overflow-x-auto cơ bản)
# sap-sim
