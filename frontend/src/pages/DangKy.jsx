import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dang_ky } from '../services/api/api_xac_thuc';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-toastify';

const DangKy = () => {
  const [thong_tin, set_thong_tin] = useState({ ten_dang_nhap: '', mat_khau: '', email: '' });
  const [dang_tai, set_dang_tai] = useState(false);
  const navigate = useNavigate();

  const xu_ly_nhap = (e) => {
    set_thong_tin({ ...thong_tin, [e.target.name]: e.target.value });
  };

  const xu_ly_gui = async (e) => {
    e.preventDefault();
    set_dang_tai(true);
    try {
      await dang_ky(thong_tin);
      toast.success('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/dang-nhap'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Đăng ký thất bại. Tên hoặc email đã tồn tại.');
      set_dang_tai(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', background: 'rgba(139, 94, 60, 0.1)', color: 'var(--primary-color)', borderRadius: '50%', marginBottom: '16px' }}>
            <UserPlus size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>Tạo tài khoản mới</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Tham gia cùng chúng tôi ngay hôm nay</p>
        </div>

        <form onSubmit={xu_ly_gui}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><User size={18}/></div>
              <input 
                className="form-input" 
                style={{ paddingLeft: '44px' }} 
                type="text" 
                name="ten_dang_nhap"
                placeholder="Ví dụ: nguyenvan_a" 
                onChange={xu_ly_nhap} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email liên hệ</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Mail size={18}/></div>
              <input 
                className="form-input" 
                style={{ paddingLeft: '44px' }} 
                type="email" 
                name="email"
                placeholder="Email của bạn" 
                onChange={xu_ly_nhap} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Lock size={18}/></div>
              <input 
                className="form-input" 
                style={{ paddingLeft: '44px' }} 
                type="password" 
                name="mat_khau"
                placeholder="Tạo mật khẩu an toàn" 
                onChange={xu_ly_nhap} 
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }} disabled={dang_tai}>
            {dang_tai ? 'Đang tạo...' : 'Đăng Ký Tài Khoản'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-light)' }}>
          Đã có tài khoản? <Link to="/dang-nhap" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default DangKy;
