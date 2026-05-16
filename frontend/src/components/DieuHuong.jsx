import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Leaf, Bell, Check, Trash2 } from 'lucide-react';
import { useGioHang } from './GioHangContext';
import { lay_thong_bao, doc_thong_bao, doc_tat_ca_thong_bao } from '../services/api/api_thong_bao';

const DieuHuong = () => {
  const { tong_so_luong } = useGioHang();
  const navigate = useNavigate();
  const location = useLocation();
  const da_dang_nhap = !!localStorage.getItem('token_truy_cap');
  const vai_tro = localStorage.getItem('vai_tro');
  const ten_dang_nhap = localStorage.getItem('ten_dang_nhap');

  const [thong_bao, set_thong_bao] = useState([]);
  const [hien_thong_bao, set_hien_thong_bao] = useState(false);

  useEffect(() => {
    if (da_dang_nhap) {
      const fetchThongBao = async () => {
        try {
          const res = await lay_thong_bao();
          set_thong_bao(res);
        } catch (err) {
          console.error("Lỗi tải thông báo", err);
        }
      };
      fetchThongBao();
      const interval = setInterval(fetchThongBao, 30000); // Tự động làm mới mỗi 30s
      return () => clearInterval(interval);
    }
  }, [da_dang_nhap]);

  const so_chua_doc = thong_bao.filter(t => !t.da_doc).length;

  const xu_ly_doc = async (id) => {
    try {
      await doc_thong_bao(id);
      set_thong_bao(thong_bao.map(t => t.id === id ? { ...t, da_doc: true } : t));
    } catch (err) {}
  };

  const xu_ly_doc_tat_ca = async () => {
    try {
      await doc_tat_ca_thong_bao();
      set_thong_bao(thong_bao.map(t => ({ ...t, da_doc: true })));
    } catch (err) {}
  };

  const xu_ly_dang_xuat = () => {
    localStorage.removeItem('token_truy_cap');
    localStorage.removeItem('vai_tro');
    localStorage.removeItem('ten_dang_nhap');
    localStorage.removeItem('user_id');
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

        {/* Auth / Cart / Notification */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Thông báo */}
          {da_dang_nhap && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => set_hien_thong_bao(!hien_thong_bao)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)',
                  position: 'relative', width: '40px', height: '40px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
              >
                <Bell size={20} />
                {so_chua_doc > 0 && (
                  <span style={{ 
                    position: 'absolute', top: '8px', right: '8px', background: '#ef4444', 
                    color: '#fff', fontSize: '10px', width: '16px', height: '16px', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{so_chua_doc}</span>
                )}
              </button>

              {hien_thong_bao && (
                <div style={{ 
                  position: 'absolute', top: '50px', right: 0, width: '320px', background: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '12px', border: '1px solid #eee',
                  zIndex: 1001, maxHeight: '450px', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontWeight: '700' }}>Thông báo</h4>
                    <button onClick={xu_ly_doc_tat_ca} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>Đã đọc tất cả</button>
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {thong_bao.length === 0 ? (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#999' }}>Không có thông báo nào</div>
                    ) : (
                      thong_bao.map((t) => (
                        <div 
                          key={t.id} 
                          onClick={() => xu_ly_doc(t.id)}
                          style={{ 
                            padding: '12px 16px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer',
                            background: t.da_doc ? '#fff' : '#f0f9ff', transition: 'background 0.3s'
                          }}
                        >
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#333', lineHeight: '1.4', fontWeight: t.da_doc ? '400' : '600' }}>{t.noi_dung}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#888' }}>{new Date(t.ngay_tao).toLocaleString('vi-VN')}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <Link to="/gio-hang" style={{ 
            position: 'relative',
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            transition: 'var(--transition)' 
          }} 
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
            <ShoppingCart size={20} />
            {tong_so_luong > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                background: 'var(--primary-color)', 
                color: '#fff', 
                fontSize: '10px', 
                fontWeight: '700', 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {tong_so_luong}
              </span>
            )}
          </Link>
          
          {da_dang_nhap ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to="/don-hang" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '500' }}>
                Đơn hàng của tôi
              </Link>
              <button onClick={xu_ly_dang_xuat} className="btn" style={{ background: '#fef2f2', color: '#ef4444', padding: '8px 16px' }}>
                <LogOut size={18} /> Đăng xuất
              </button>
            </div>
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
