import { useGioHang } from '../components/GioHangContext';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const GioHang = () => {
  const { gio_hang, xoa_khoi_gio, cap_nhat_so_luong, tong_tien } = useGioHang();

  if (gio_hang.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ marginBottom: '24px', opacity: 0.2 }}>
          <ShoppingBag size={100} style={{ margin: '0 auto' }} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>Hãy dạo quanh cửa hàng và chọn cho mình những món đồ gỗ tinh xảo nhất nhé!</p>
        <Link to="/san-pham" className="btn-primary" style={{ padding: '12px 32px', borderRadius: '12px', textDecoration: 'none', display: 'inline-block' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px', textAlign: 'center' }}>Giỏ Hàng Của Bạn</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        {/* Danh sách sản phẩm */}
        <div>
          <div className="card" style={{ padding: '0' }}>
            {gio_hang.map((item) => (
              <div key={item.id} style={{ 
                display: 'grid', 
                gridTemplateColumns: '120px 1fr 150px 120px 40px', 
                alignItems: 'center', 
                gap: '20px', 
                padding: '24px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <img src={item.hinh_anh} alt={item.ten_san_pham} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
                
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{item.ten_san_pham}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Đơn giá: {item.gia.toLocaleString()} ₫</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', borderRadius: '8px', padding: '4px' }}>
                  <button onClick={() => cap_nhat_so_luong(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: '700' }}>{item.so_luong_mua}</span>
                  <button onClick={() => cap_nhat_so_luong(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px' }}>
                    <Plus size={16} />
                  </button>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '800', color: 'var(--primary-color)' }}>{(item.gia * item.so_luong_mua).toLocaleString()} ₫</p>
                </div>

                <button onClick={() => xoa_khoi_gio(item.id)} style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <Link to="/san-pham" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', color: '#666', textDecoration: 'none', fontWeight: '600' }}>
            <ArrowLeft size={18} /> Tiếp tục mua sắm
          </Link>
        </div>

        {/* Tổng kết */}
        <aside>
          <div className="card" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '24px' }}>Tóm tắt đơn hàng</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666' }}>
              <span>Tạm tính</span>
              <span>{tong_tien.toLocaleString()} ₫</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: '#666' }}>
              <span>Phí vận chuyển</span>
              <span style={{ color: '#22c55e', fontWeight: '600' }}>Miễn phí</span>
            </div>
            
            <div style={{ borderTop: '2px dashed #eee', paddingTop: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Tổng cộng</span>
                <span style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary-color)' }}>{tong_tien.toLocaleString()} ₫</span>
              </div>
            </div>

            <Link to="/thanh-toan" className="btn-primary" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              padding: '16px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}>
              <CreditCard size={20} /> Thanh toán ngay
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GioHang;
