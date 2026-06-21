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

## Data flow demo (end-to-end)

**Luồng mua hàng (Procure-to-Pay):**
1. Vào **Procurement → Manage Purchase Orders** → tạo PO mới (ME21N).
2. Bấm "Tiếp tục: Post Goods Receipt" → MIGO tự động điền PO vừa tạo.
3. Nhận hàng → tồn kho (MB52) tự cập nhật, PO chuyển trạng thái Delivered.
4. Bấm "Tiếp tục: Create Supplier Invoice" → MIRO tự điền PO, đề xuất số tiền.
5. Đăng hóa đơn → bút toán FI tự sinh, xuất hiện trong Finance > Accounts Payable.

**Luồng bán hàng (Order-to-Cash):**
6. Vào **Sales → Create Sales Order** (VA01) → chọn khách hàng + vật tư → hệ thống
   tự kiểm tra tồn kho (ATP check đơn giản): đủ hàng thì "Confirmed" và trừ kho,
   thiếu hàng thì "Backorder".
7. Nếu Confirmed, bấm "Tiếp tục: Create Billing Document" → VF01 tự điền SO.
8. Đăng hóa đơn bán hàng → bút toán FI (Customer Invoice) tự sinh, xuất hiện trong
   Finance > Accounts Receivable. SO chuyển trạng thái "Billed".

**Khám phá thêm:**
- Bấm icon search (kính lúp) trên top bar → gõ tên transaction/tile để tìm nhanh.
- Bấm icon chuông → xem thông báo thật được tạo từ dữ liệu hiện có (PO mới, SO backorder, tồn kho thấp).
- Bấm "Home" (desktop) hoặc icon lưới (mobile) → mở All My Apps, duyệt theo nhóm module.

## Sửa lỗi sau đánh giá độc lập (Audit Fixes)

Sau một vòng đánh giá khách quan (đóng vai reviewer logic/nghiệp vụ), 7 vấn đề sau
đã được khắc phục:

**Nghiêm trọng:**
1. **Backorder tự động Confirmed** — `postGoodsReceipt` giờ quét lại mọi SO đang
   Backorder cùng material/plant theo thứ tự FIFO, tự xác nhận khi đủ kho. UI hiển
   thị rõ "X Sales Order đã tự động chuyển sang Confirmed" ngay sau khi MIGO, kèm
   notification tương ứng — không còn lời hứa suông.
2. **KPI tính động từ dữ liệu thật** — bỏ hoàn toàn số liệu tĩnh "40.64M EUR" sai đơn
   vị. `getKpis()` giờ tính trực tiếp từ `supplierInvoices`/`billingDocuments` thật,
   luôn nhất quán với bảng chi tiết, đơn vị VND xuyên suốt.
3. **MIRO áp dụng 3-way match** — chặn xuất hóa đơn vượt giá trị hàng đã nhận theo
   PO, hiển thị rõ "Tối đa có thể xuất" và validate trước khi submit.
4. **Gross Margin dùng giá vốn thật** — mỗi material có `costPrice` riêng phản ánh
   biên lợi nhuận thực tế theo ngành hàng, thay vì giả định cứng 70% cho mọi vật tư.

**Trung bình:**
5. **StatusBadge dịch theo ngôn ngữ** — mọi nhãn trạng thái (Open, Confirmed,
   Backorder...) giờ hiển thị đúng tiếng Việt/Anh theo lựa chọn, nhất quán với
   phần còn lại của UI.
6. **DataTable responsive thật trên mobile** — chuyển sang dạng card-list dọc trên
   màn hình nhỏ (`sm:hidden`) thay vì chỉ cuộn ngang một bảng nhiều cột.
7. **Approval Workflow (release strategy)** — PO trên 500 triệu VND vào trạng thái
   "Pending Approval", cần phê duyệt thủ công ở Object Page trước khi có thể nhận
   hàng (MIGO) hoặc xuất hóa đơn (MIRO). Có sẵn 1 PO seed minh họa tính năng này.

## Đa ngôn ngữ (Tiếng Việt / English)

Toàn bộ UI hỗ trợ chuyển đổi Anh/Việt theo thời gian thực — bấm nút **VI/EN** ở góc
trên bên phải thanh top bar. Bao gồm:
- Nav tabs, Pages cards, section title, tile title trên mọi module
- Toàn bộ form giao dịch (ME21N, MIGO, MIRO, VA01, VF01)
- Object Page (header, key facts, action button, Document Flow)
- DataTable (search placeholder, cột, trạng thái), breadcrumb, notification, search,
  All My Apps panel

Lựa chọn ngôn ngữ được lưu qua `localStorage` (Zustand `persist`, key `sap-sim-lang`),
giữ nguyên khi reload trang. Dữ liệu giao dịch (PO, SO, hóa đơn...) snapshot tên vật tư
bằng tiếng Việt tại thời điểm tạo — đúng hành vi document trong SAP thật không tự đổi
ngôn ngữ sau khi đã post.

## Master Data mở rộng + Seed Data

- **12 vendor**, **10 customer**, **10 material** đa dạng ngành nghề (thép, logistics,
  điện tử, hóa chất, bao bì, xây dựng...) thay vì chỉ 3 dòng như bản đầu.
- App khởi động **đã có sẵn lịch sử giao dịch**: 6 Purchase Order, 4 Goods Receipt,
  4 Supplier Invoice, 5 Sales Order (đủ trạng thái Open/Delivered/Partially
  Delivered/Confirmed/Backorder/Billed), 2 Billing Document — toàn bộ Document Flow
  hiển thị đúng ngay từ lần mở đầu tiên, không cần tự tạo giao dịch để thấy dữ liệu.
- Material/Vendor giờ phân bổ theo 2 Plant (1010 — Bắc Ninh, 1020 — Đà Nẵng), VA01 tự
  tra đúng plant theo material thay vì hardcode 1010.

## Liên kết module chặt chẽ hơn

- Thêm **Customer Object Page** (`/object/customer/:id`) — đối xứng với Vendor Object
  Page, hiển thị toàn bộ Sales Order + Billing Document của khách hàng đó.
- PO Detail, Invoice Detail giờ có nút **"Xem nhà cung cấp"** dẫn sang Vendor Detail.
- SO Detail, Billing Detail có nút **"Xem khách hàng"** dẫn sang Customer Detail.
- "Top Customers" trong Sales Analytics giờ click được, dẫn thẳng tới Customer Detail.
- All My Apps panel bổ sung link còn thiếu (Fulfillment Issues, Top Customers...).

## Object Page — trải nghiệm giống SAP thật

Bản nâng cấp lớn nhất: mọi bảng dữ liệu (PO list, SO list, Invoice list, Billing list,
Vendor list...) giờ có:

- **Search + Sort** trên mọi cột quan trọng (click vào tiêu đề cột để sort tăng/giảm).
- **Click vào 1 dòng** → mở **Object Page** chi tiết, đúng pattern Fiori thật:
  - Header với key facts (số liệu chính), status badge màu theo trạng thái.
  - Action buttons theo ngữ cảnh (vd: PO chưa nhận đủ hàng → nút "Post Goods Receipt";
    SO đã Confirmed → nút "Create Billing Document").
  - **Document Flow** — timeline trực quan hiển thị toàn bộ chứng từ liên quan
    (PO → Goods Receipt → Invoice → FI Document, hoặc SO → Billing → FI Document),
    đúng như tab "Document Flow" trong ME23N/VA03 của SAP thật.
  - Object Page liên kết chéo nhau: từ Invoice Detail bấm sang PO Detail, từ Vendor
    Detail xem toàn bộ PO/Invoice của nhà cung cấp đó — drill-down nhiều lớp.
- **Breadcrumb** ở mọi trang con (List, Transaction, Object Page, App Detail) để biết
  đang ở đâu trong cây điều hướng và quay lại module cha dễ dàng.

5 Object Page đã có: **Purchase Order**, **Sales Order**, **Supplier Invoice**,
**Billing Document**, **Vendor**.

## Mọi tile đều có thể bấm vào

Khác với bản trước (nhiều tile "display-only" bấm không có phản hồi), giờ **toàn bộ tile**
trên launchpad đều điều hướng tới nội dung thật:
- **Transaction tile** (ME21N, MIGO, MIRO, VA01, VF01) → mở form giao dịch.
- **List tile** (Supplier List, Stock, Invoices...) → mở bảng dữ liệu từ store.
- **App tile** (Balance Sheet, Cost Centers, Quality Overview...) → mở trang chi tiết
  theo khuôn mẫu Fiori "List Report" / "Object Page", lấy dữ liệu thật từ store khi có
  liên quan (vd: Gross Margin tính từ Billing Document thật), hoặc dữ liệu mẫu tĩnh cho
  các nghiệp vụ chưa có transaction tương ứng (vd: Balance Sheet, WBS Elements).
- **KPI tile** (Overdue Payables, Cash Discount...) → hiển thị số liệu + sparkline,
  không điều hướng (giống hành vi tile KPI trong SAP thật).

Toàn bộ mapping tile → đích đến được định nghĩa tập trung trong `src/data/launchpadData.js`
(`APP_REGISTRY`), dễ mở rộng thêm app mới mà không cần sửa component.

**Phase 1**
- [x] Fiori Shell (top bar + nav tabs, responsive mobile dropdown) giống ảnh chụp gốc
- [x] My Home với Pages cards màu + Insights Tiles
- [x] KPI tile component (3 loại: KpiTile, NavTile, CountTile)
- [x] All My Apps panel 2 cột (mở từ nút Home / icon grid trên mobile)

**Phase 2**
- [x] Finance module (Financial Reporting, Predictive Accounting, AP, AR)
- [x] Procurement module (PO, GR, Invoice, Enterprise Contract, Supplier Accounts)
- [x] ME21N (Create PO), MIGO (Goods Receipt), MIRO (Supplier Invoice)
- [x] Data flow xuyên module qua Zustand store (PO → GR → Invoice → FI doc)

**Phase 3**
- [x] Manufacturing & Supply Chain module (Quality Management, Service & Asset)
- [x] Sales module (Order Management, Billing, Sales Analytics)
- [x] VA01 (Create Sales Order) với ATP check đơn giản — trừ kho hoặc Backorder
- [x] VF01 (Create Billing Document) — nối SO Confirmed → Billing → FI Customer Invoice
- [x] Recharts sparkline trong KPI tile (xu hướng 7 điểm dữ liệu)
- [x] localStorage persistence (Zustand `persist` middleware, key `sap-sim-storage`)
- [x] Nút "Reset Demo" ở My Home để khôi phục dữ liệu ban đầu
- [x] Project Management module (Project Planning, Execution, Financials)
- [x] Search bar hoạt động thật — tìm theo tên tile/transaction trên mọi module
- [x] Notification bell có nội dung thật — PO mới, SO backorder, hóa đơn vừa đăng, tồn kho thấp
- [x] Responsive mobile layout (hamburger menu cho nav tabs, icon grid thay Home text)

## Có thể mở rộng thêm (ngoài roadmap gốc)

- [ ] Unit test cho các action trong sapStore (Vitest)
- [ ] Dark mode theo Fiori Horizon Dark theme
- [ ] Export PO/SO list ra Excel (dùng thư viện xlsx)
- [ ] Multi-currency thật (tỷ giá quy đổi) thay vì chỉ VND
