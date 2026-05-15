import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Leaf } from 'lucide-react';

const DieuHuong = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const da_dang_nhap = !!localStorage.getItem('token_truy_cap');
  const vai_tro = localStorage.getItem('vai_tro');
  const ten_dang_nhap = localStorage.getItem('ten_dang_nhap');

  const xu_ly_dang_xuat = () => {
    localStorage.removeItem('token_truy_cap');
    localStorage.removeItem('vai_tro');
    localStorage.removeItem('ten_dang_nhap');
    navigate('/dang-nhap');
  };

  const isActive = (path) => {
    return location.pathname === path ? { color: 'var(--primary-color)', fontWeight: '600' } : { color: 'var(--text-main)' };
  };

  return (
    <header style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '80px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--primary-color)' }}>
          <Leaf size={28} />
          <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>TreGỗ.</span>
        </Link>

        {/* Menu */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', transition: 'var(--transition)', ...isActive('/') }}>
            Trang Chủ
          </Link>
          <Link to="/san-pham" style={{ textDecoration: 'none', transition: 'var(--transition)', ...isActive('/san-pham') }}>
            Sản Phẩm
          </Link>
          {vai_tro === 'admin' && (
            <Link to="/admin" style={{ textDecoration: 'none', color: '#d97706', fontWeight: '600' }}>
              Quản Trị Admin
            </Link>
          )}
        </nav>

        {/* Auth / Cart */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', transition: 'var(--transition)' }} 
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
            <ShoppingCart size={20} />
          </button>
          
          {da_dang_nhap ? (
            <button onClick={xu_ly_dang_xuat} className="btn" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <LogOut size={18} /> Đăng xuất
            </button>
          ) : (
            <>
              <Link to="/dang-nhap" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>
                Đăng nhập
              </Link>
              <Link to="/dang-ky" className="btn btn-primary">
                <User size={18} /> Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DieuHuong;
