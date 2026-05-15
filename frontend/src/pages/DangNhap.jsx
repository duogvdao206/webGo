import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dang_nhap } from '../services/api/api_xac_thuc';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const DangNhap = () => {
  const [ten_dang_nhap, set_ten_dang_nhap] = useState('');
  const [mat_khau, set_mat_khau] = useState('');
  const [dang_tai, set_dang_tai] = useState(false);
  const navigate = useNavigate();

  const xu_ly_gui = async (e) => {
    e.preventDefault();
    set_dang_tai(true);
    try {
      const ket_qua = await dang_nhap({ ten_dang_nhap, mat_khau });
      localStorage.setItem('token_truy_cap', ket_qua.token_truy_cap);
      localStorage.setItem('vai_tro', ket_qua.vai_tro);
      localStorage.setItem('ten_dang_nhap', ket_qua.ten_dang_nhap);
      toast.success('Đăng nhập thành công!');
      setTimeout(() => {
        if (ket_qua.vai_tro === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/'; 
        }
      }, 1000);
    } catch (err) {
      toast.error('Sai tên đăng nhập hoặc mật khẩu!');
      set_dang_tai(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', background: 'rgba(139, 94, 60, 0.1)', color: 'var(--primary-color)', borderRadius: '50%', marginBottom: '16px' }}>
            <LogIn size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>Chào mừng trở lại</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Đăng nhập để tiếp tục mua sắm</p>
        </div>

        <form onSubmit={xu_ly_gui}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Mail size={18}/></div>
              <input 
                className="form-input" 
                style={{ paddingLeft: '44px' }} 
                type="text" 
                placeholder="Nhập tên đăng nhập" 
                value={ten_dang_nhap} 
                onChange={e => set_ten_dang_nhap(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Mật khẩu</label>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>Quên mật khẩu?</a>
            </div>
            <div style={{ position: 'relative', marginTop: '8px' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Lock size={18}/></div>
              <input 
                className="form-input" 
                style={{ paddingLeft: '44px' }} 
                type="password" 
                placeholder="Nhập mật khẩu" 
                value={mat_khau} 
                onChange={e => set_mat_khau(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={dang_tai}>
            {dang_tai ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-light)' }}>
          Chưa có tài khoản? <Link to="/dang-ky" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default DangNhap;
