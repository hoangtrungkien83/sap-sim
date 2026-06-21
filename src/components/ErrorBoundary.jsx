import { Component } from 'react';

/**
 * Bắt mọi lỗi runtime trong cây component con và hiển thị thông báo rõ ràng
 * thay vì để React unmount toàn bộ app, gây màn hình trắng không manh mối.
 * Đây là lớp phòng thủ cuối cùng — không thay thế việc sửa lỗi gốc, nhưng
 * đảm bảo người dùng (và người debug) luôn thấy được nguyên nhân.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log chi tiết ra console để debug qua DevTools
    console.error('SAP Simulation crashed:', error, info);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('sap-sim-storage-v3');
      localStorage.removeItem('sap-sim-storage-v2');
      localStorage.removeItem('sap-sim-storage');
    } catch {
      // localStorage có thể bị chặn (private mode) — bỏ qua, vẫn reload
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7] p-6">
          <div className="max-w-lg w-full bg-white border border-gray-200 rounded-lg p-6 text-center">
            <i className="ti ti-alert-triangle text-4xl text-amber-500 mb-3" aria-hidden="true" />
            <h1 className="text-lg font-medium text-gray-900 mb-2">Đã xảy ra lỗi / Something went wrong</h1>
            <p className="text-sm text-gray-600 mb-4">
              Ứng dụng gặp lỗi không mong muốn, có thể do dữ liệu cũ lưu trong trình duyệt
              không còn tương thích. Bấm nút bên dưới để xóa dữ liệu cũ và tải lại từ đầu.
            </p>
            <pre className="text-left text-xs bg-gray-50 border border-gray-200 rounded p-3 mb-4 overflow-x-auto text-red-600">
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
            <button
              onClick={this.handleReset}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:opacity-90"
            >
              Xóa dữ liệu cũ và tải lại / Clear data &amp; reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
