import DieuHuong from '../components/DieuHuong';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LayoutChinh = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DieuHuong />
      <main className="container animate-fade-in" style={{ flexGrow: 1, padding: '40px 24px', width: '100%' }}>
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer style={{ background: '#2d241c', color: '#e6dfd5', padding: '40px 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff' }}>Tre Gỗ Việt</h3>
            <p style={{ maxWidth: '300px', opacity: 0.8 }}>Mang thiên nhiên vào không gian sống của bạn với những sản phẩm thủ công từ tre và gỗ chất lượng cao.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px', color: '#fff' }}>Liên hệ</h4>
            <p style={{ opacity: 0.8 }}>Email: lienhe@trego.vn</p>
            <p style={{ opacity: 0.8 }}>Điện thoại: 0123 456 789</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '0', opacity: 0.5, fontSize: '0.9rem' }}>
          &copy; 2026 Tre Gỗ Việt. All rights reserved.
        </div>
      </footer>

      {/* Cấu hình Toast */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LayoutChinh;
