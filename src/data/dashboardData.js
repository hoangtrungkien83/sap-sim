// dashboardData.js — dữ liệu KPI/chart/list/news/profile/status tile
// cho từng module. File NÀY HOÀN TOÀN ĐỘC LẬP, không ảnh hưởng logic gốc.
// tone: '' | 'danger' | 'warn' | 'good'

export const DASHBOARD_SECTIONS = {
  home: [
    {
      title: { vi: 'Tổng quan hôm nay', en: 'Today at a Glance' },
      tiles: [
        { type:'profile', id:'p1', name:'Donna Moore', role:{vi:'SAP Key User · Toàn bộ module', en:'SAP Key User · All Modules'} },
        { type:'kpi', id:'tasks',    title:{vi:'Nhiệm vụ hôm nay', en:'Tasks Due Today'},   sub:{vi:'Danh sách việc',    en:'Your worklist'},     val:'5',  unit:'',    tone:'warn',   icon:'ti-checklist',    ts:'now'        },
        { type:'kpi', id:'notifs',   title:{vi:'Thông báo chưa đọc',en:'Unread Notifications'},sub:{vi:'Cần xem',        en:'Needs attention'},   val:'9',  unit:'',    tone:'danger', icon:'ti-bell',         ts:'just now'   },
        { type:'kpi', id:'fi-items', title:{vi:'Mục FI đang mở',   en:'Open Items FI'},     sub:{vi:'Danh sách kế toán',en:'Finance worklist'},   val:'31', unit:'',    tone:'',       icon:'ti-report-money', ts:'5 min. ago' },
        { type:'list', id:'my-apps',
          title:{vi:'Thao tác nhanh', en:'Quick Actions'},
          links:[
            {label:{vi:'ME21N — Tạo PO',         en:'ME21N — Create PO'},        path:'/transaction/ME21N'},
            {label:{vi:'VA01 — Đơn bán hàng',    en:'VA01 — Sales Order'},       path:'/transaction/VA01' },
            {label:{vi:'MIGO — Nhập kho',         en:'MIGO — Goods Receipt'},     path:'/transaction/MIGO' },
            {label:{vi:'MIRO — Hóa đơn NCC',     en:'MIRO — Supplier Invoice'},  path:'/transaction/MIRO' },
            {label:{vi:'VF01 — Xuất hóa đơn',    en:'VF01 — Billing'},           path:'/transaction/VF01' },
          ],
        },
        { type:'news', id:'news-home',
          title:{vi:'Tổng kết Q2 2025 — Điểm nổi bật cho S/4HANA', en:'Q2 2025 Business Review — Key Highlights for S/4HANA Users'},
          dt:'Jun 2025 · Company News' },
      ],
    },
  ],

  finance: [
    {
      title:{vi:'Báo cáo tài chính', en:'Financial Reporting'},
      tiles:[
        { type:'kpi', id:'ap',     title:{vi:'Phải trả',       en:'Accounts Payable'},    sub:{vi:'Tổng còn lại',      en:'Total outstanding'}, val:'12.4M', unit:'VND', tone:'danger', icon:'ti-arrow-up-circle',   ts:'now'    },
        { type:'kpi', id:'ar',     title:{vi:'Phải thu',       en:'Accounts Receivable'}, sub:{vi:'Tổng còn lại',      en:'Total outstanding'}, val:'8.7M',  unit:'VND', tone:'warn',   icon:'ti-arrow-down-circle', ts:'now'    },
        { type:'kpi', id:'margin', title:{vi:'Lợi nhuận gộp', en:'Gross Margin'},        sub:{vi:'Từ hóa đơn bán hàng',en:'Billing documents'}, val:'28.3',  unit:'%',   tone:'good',   icon:'ti-chart-pie',         ts:'1h ago' },
        { type:'chart', id:'rev',
          title:{vi:'Doanh thu theo kỳ', en:'Revenue by Period'},
          sub:{vi:'4 tháng gần nhất', en:'Last 4 months'},
          bars:[
            {lbl:{vi:'T3',en:'Mar'}, pct:60, color:'var(--fiori-link)'},
            {lbl:{vi:'T4',en:'Apr'}, pct:72, color:'var(--fiori-link)'},
            {lbl:{vi:'T5',en:'May'}, pct:85, color:'#185FA5'},
            {lbl:{vi:'T6',en:'Jun'}, pct:78, color:'#185FA5'},
          ],
        },
        { type:'list', id:'fin-links',
          title:{vi:'Thao tác tài chính', en:'Finance Actions'},
          links:[
            {label:{vi:'Bảng cân đối / P&L',  en:'Balance Sheet / P&L'},   path:'/module/balance-sheet'},
            {label:{vi:'Báo cáo trung tâm CP', en:'Cost Center Report'},    path:'/app/cost-centers'},
            {label:{vi:'Nhật ký bút toán FI',  en:'FI Document Journal'},   path:'/app/gl-line-items'},
            {label:{vi:'Danh sách hóa đơn NCC',en:'Supplier Invoice List'}, path:'/list/invoices'},
            {label:{vi:'Danh sách HĐ bán hàng',en:'Billing Document List'}, path:'/list/billing'},
          ],
        },
      ],
    },
  ],

  procurement: [
    {
      title:{vi:'Tổng quan mua hàng', en:'Procurement Overview'},
      tiles:[
        { type:'kpi', id:'po-open',     title:{vi:'PO đang mở',       en:'Open Purchase Orders'}, sub:{vi:'Tất cả nhà máy', en:'All plants'},       val:'142',  unit:'POs', tone:'',       icon:'ti-clipboard-list',     ts:'5 min. ago' },
        { type:'kpi', id:'po-approval', title:{vi:'PO chờ phê duyệt', en:'Pending Approval'},     sub:{vi:'Vượt ngưỡng',    en:'Above threshold'},   val:'7',    unit:'',    tone:'warn',   icon:'ti-shield-exclamation', ts:'now'        },
        { type:'kpi', id:'overdue-del', title:{vi:'Giao hàng trễ',    en:'Overdue Deliveries'},   sub:{vi:'Cần theo dõi',   en:'Needs follow-up'},   val:'23',   unit:'',    tone:'danger', icon:'ti-truck-off',          ts:'2 min. ago' },
        { type:'kpi', id:'spend-mtd',   title:{vi:'Chi tiêu tháng',   en:'Spend MTD'},            sub:{vi:'Tháng hiện tại', en:'Month to date'},     val:'4.2M', unit:'VND', tone:'',       icon:'ti-cash',               ts:'now'        },
        { type:'chart', id:'vendor-perf',
          title:{vi:'Hiệu suất NCC', en:'Vendor Performance'},
          sub:{vi:'Giao hàng đúng hạn', en:'On-time delivery'},
          bars:[
            {lbl:{vi:'Hòa Phát',    en:'Hòa Phát'},    pct:91, color:'var(--fiori-success)'},
            {lbl:{vi:'Samsung SDI', en:'Samsung SDI'}, pct:87, color:'var(--fiori-success)'},
            {lbl:{vi:'Maersk',      en:'Maersk'},      pct:74, color:'var(--fiori-warning)'},
            {lbl:{vi:'PTT Chem.',   en:'PTT Chem.'},   pct:58, color:'var(--fiori-danger)' },
          ],
        },
        { type:'status', id:'po-mix',
          title:{vi:'Tình trạng PO', en:'PO Status Mix'},
          sub:{vi:'Danh mục hiện tại', en:'Current portfolio'},
          segments:[
            {lbl:{vi:'Mở',        en:'Open'},       pct:31, color:'#888'},
            {lbl:{vi:'Một phần',  en:'Partial'},    pct:24, color:'var(--fiori-warning)'},
            {lbl:{vi:'Đã giao',   en:'Delivered'},  pct:33, color:'var(--fiori-success)'},
            {lbl:{vi:'Chờ duyệt', en:'Pend.Appr.'}, pct:12, color:'var(--fiori-danger)' },
          ],
        },
        { type:'list', id:'proc-links',
          title:{vi:'Thao tác nhanh', en:'Quick Actions'},
          links:[
            {label:{vi:'Tạo PO (ME21N)',        en:'Create PO (ME21N)'},            path:'/transaction/ME21N'},
            {label:{vi:'Nhập kho (MIGO)',        en:'Post Goods Receipt (MIGO)'},    path:'/transaction/MIGO' },
            {label:{vi:'Hóa đơn NCC (MIRO)',     en:'Supplier Invoice (MIRO)'},      path:'/transaction/MIRO' },
            {label:{vi:'Danh sách PO',           en:'Purchase Order List'},          path:'/list/pos'         },
            {label:{vi:'Danh sách nhà cung cấp', en:'Supplier List'},                path:'/list/vendors'     },
            {label:{vi:'Tồn kho (MB52)',          en:'Stock Overview (MB52)'},        path:'/list/stock'       },
          ],
        },
        { type:'news', id:'news-proc',
          title:{vi:'Workflow phê duyệt PO mới cho đơn trên 500M VND', en:'New Approval Workflow for POs Above 500M VND Now Active'},
          dt:'Jun 2025 · Procurement Bulletin' },
      ],
    },
  ],

  manufacturing: [
    {
      title:{vi:'Sản xuất & Chuỗi cung ứng', en:'Manufacturing & Supply Chain'},
      tiles:[
        { type:'kpi', id:'stock-cov', title:{vi:'Bao phủ tồn kho', en:'Stock Coverage'},  sub:{vi:'Ngày cung ứng',    en:'Days of supply'},    val:'14', unit:'days', tone:'warn',   icon:'ti-building-warehouse', ts:'now'        },
        { type:'kpi', id:'low-stock', title:{vi:'Tồn kho thấp',    en:'Low Stock Items'}, sub:{vi:'Dưới mức an toàn', en:'Below safety level'}, val:'3',  unit:'',     tone:'danger', icon:'ti-alert-triangle',     ts:'5 min. ago' },
        { type:'chart', id:'stock-mat',
          title:{vi:'Tồn kho theo vật tư', en:'Stock by Material'},
          sub:{vi:'Vật tư chính', en:'Top materials'},
          bars:[
            {lbl:{vi:'Thép tấm', en:'Hot-Roll Steel'}, pct:90, color:'var(--fiori-success)'},
            {lbl:{vi:'Bo mạch',  en:'Electronic MB'},  pct:62, color:'var(--fiori-warning)'},
            {lbl:{vi:'Cáp đồng', en:'Copper Cable'},   pct:18, color:'var(--fiori-danger)' },
            {lbl:{vi:'Hạt nhựa', en:'PP Resin'},       pct:74, color:'var(--fiori-success)'},
          ],
        },
        { type:'list', id:'mfg-links',
          title:{vi:'Chất lượng & Tài sản', en:'Quality & Asset'},
          links:[
            {label:{vi:'Lô kiểm tra (QM)',      en:'Inspection Lots (QM)'},       path:'/app/inspection-lots'      },
            {label:{vi:'Yêu cầu bảo trì (EAM)', en:'Maintenance Requests (EAM)'}, path:'/app/maintenance-requests' },
            {label:{vi:'Tổng quan chất lượng',   en:'Quality Overview'},           path:'/app/quality-overview'     },
            {label:{vi:'Tồn kho (MB52)',          en:'Stock Overview (MB52)'},      path:'/list/stock'               },
          ],
        },
      ],
    },
  ],

  sales: [
    {
      title:{vi:'Đơn bán hàng', en:'Sales Orders'},
      tiles:[
        { type:'kpi', id:'so-open',    title:{vi:'SO Đang mở',      en:'Open Sales Orders'}, sub:{vi:'Giá trị thuần',  en:'Net Value'},       val:'4,621', unit:'orders', tone:'',       icon:'ti-shopping-cart',  ts:'5 min. ago'  },
        { type:'kpi', id:'rev-mtd',    title:{vi:'Doanh thu tháng', en:'Revenue MTD'},       sub:{vi:'Tháng hiện tại', en:'Month to date'},   val:'1.8M',  unit:'EUR',    tone:'good',   icon:'ti-trending-up',    ts:'now'         },
        { type:'kpi', id:'so-overdue', title:{vi:'SO Quá hạn',      en:'Overdue Orders'},    sub:{vi:'Cần chú ý',      en:'Needs attention'}, val:'37',    unit:'',       tone:'danger', icon:'ti-alert-triangle', ts:'10 min. ago' },
        { type:'kpi', id:'win-rate',   title:{vi:'Tỷ lệ chốt đơn', en:'Win Rate'},          sub:{vi:'Báo giá → Đơn',  en:'Quotation→Order'}, val:'63',    unit:'%',      tone:'good',   icon:'ti-trophy',         ts:'1d ago'      },
        { type:'chart', id:'so-fulfill',
          title:{vi:'Tình trạng hoàn thành SO', en:'Sales Order Fulfillment'},
          sub:{vi:'Theo nhóm', en:'By category'},
          bars:[
            {lbl:{vi:'Đúng hạn', en:'On Time'},   pct:72, color:'var(--fiori-success)'},
            {lbl:{vi:'Trễ hạn',  en:'Delayed'},   pct:18, color:'var(--fiori-warning)'},
            {lbl:{vi:'Đã hủy',   en:'Cancelled'}, pct:10, color:'var(--fiori-danger)' },
          ],
        },
        { type:'status', id:'pipeline',
          title:{vi:'Pipeline đơn hàng', en:'Order Pipeline'},
          sub:{vi:'Trạng thái thực', en:'Live status'},
          segments:[
            {lbl:{vi:'Mở',         en:'Open'},       pct:38, color:'var(--fiori-link)'   },
            {lbl:{vi:'Đang xử lý', en:'In Process'}, pct:29, color:'var(--fiori-warning)'},
            {lbl:{vi:'Đã giao',    en:'Shipped'},     pct:21, color:'var(--fiori-success)'},
            {lbl:{vi:'Đóng',       en:'Closed'},      pct:12, color:'#888'               },
          ],
        },
        { type:'list', id:'sales-links',
          title:{vi:'Thao tác nhanh', en:'Quick Actions'},
          links:[
            {label:{vi:'Tạo đơn bán hàng (VA01)',   en:'Create Sales Order (VA01)'},    path:'/transaction/VA01' },
            {label:{vi:'Danh sách Sales Order',      en:'Sales Order List'},             path:'/list/salesOrders' },
            {label:{vi:'Xuất hóa đơn (VF01)',        en:'Create Billing (VF01)'},        path:'/transaction/VF01' },
            {label:{vi:'Danh sách HĐ bán hàng',     en:'Billing Document List'},        path:'/list/billing'     },
            {label:{vi:'Khách hàng hàng đầu',        en:'Top Customers'},                path:'/app/top-customers'},
          ],
        },
        { type:'profile', id:'p-sales', name:'Donna Moore', role:{vi:'Trưởng phòng kinh doanh · APAC', en:'Sales Manager · Region APAC'} },
      ],
    },
    {
      title:{vi:'Giám sát', en:'Monitoring'},
      tiles:[
        { type:'kpi', id:'blocked', title:{vi:'SO bị chặn',    en:'Blocked Orders'}, sub:{vi:'Cần xử lý',  en:'Requires action'}, val:'12',  unit:'',  tone:'danger', icon:'ti-lock',          ts:'now'    },
        { type:'kpi', id:'returns', title:{vi:'Tỷ lệ trả hàng',en:'Returns Rate'},  sub:{vi:'30 ngày qua',en:'Last 30 days'},    val:'2.4', unit:'%', tone:'warn',   icon:'ti-arrow-back-up', ts:'1h ago' },
        { type:'chart', id:'biz-vol',
          title:{vi:'Doanh số theo KH', en:'Business Volume'},
          sub:{vi:'Khách hàng lớn', en:'Top customers'},
          bars:[
            {lbl:{vi:'Coteccons',  en:'Coteccons'},  pct:84, color:'var(--fiori-link)'},
            {lbl:{vi:'Samsung VN', en:'Samsung VN'}, pct:67, color:'#185FA5'},
            {lbl:{vi:'Vingroup',   en:'Vingroup'},   pct:55, color:'#378ADD'},
            {lbl:{vi:'LG Display', en:'LG Display'}, pct:41, color:'#66B2FF'},
          ],
        },
      ],
    },
  ],

  project: [
    {
      title:{vi:'Quản lý dự án', en:'Project Management'},
      tiles:[
        { type:'kpi', id:'proj-active', title:{vi:'Dự án đang chạy', en:'Active Projects'}, sub:{vi:'Đang thực hiện', en:'In progress'},    val:'6', unit:'', tone:'',       icon:'ti-folders',        ts:'now' },
        { type:'kpi', id:'proj-risk',   title:{vi:'Dự án rủi ro',    en:'At Risk'},         sub:{vi:'Trễ tiến độ',    en:'Behind schedule'}, val:'2', unit:'', tone:'danger', icon:'ti-alert-triangle', ts:'now' },
        { type:'status', id:'proj-health',
          title:{vi:'Sức khỏe dự án', en:'Project Health'},
          sub:{vi:'Danh mục dự án', en:'Portfolio view'},
          segments:[
            {lbl:{vi:'Đúng tiến độ', en:'On Track'}, pct:50, color:'var(--fiori-success)'},
            {lbl:{vi:'Có rủi ro',    en:'At Risk'},  pct:33, color:'var(--fiori-warning)'},
            {lbl:{vi:'Bị trễ',       en:'Delayed'},  pct:17, color:'var(--fiori-danger)' },
          ],
        },
        { type:'list', id:'proj-links',
          title:{vi:'Thao tác dự án', en:'Project Actions'},
          links:[
            {label:{vi:'Quản lý dự án',       en:'Manage Projects'},     path:'/app/projects'      },
            {label:{vi:'Theo dõi mốc tiến độ', en:'Track Milestones'},   path:'/app/milestones'    },
            {label:{vi:'Tổng quan ngân sách',  en:'Budget Overview'},     path:'/app/project-budget'},
            {label:{vi:'WBS Elements',         en:'WBS Elements'},        path:'/app/projects'      },
          ],
        },
      ],
    },
  ],
};
