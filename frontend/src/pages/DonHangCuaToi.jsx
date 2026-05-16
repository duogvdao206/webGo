import { useState, useEffect } from 'react';
import { lay_don_hang_cua_tooi, huy_don_hang } from '../services/api/api_don_hang';
import { ShoppingBag, Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight, Info, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const DonHangCuaToi = () => {
  const [don_hangs, set_don_hangs] = useState([]);
  const [dang_tai, set_dang_tai] = useState(true);
  const [don_hang_chi_tiet, set_don_hang_chi_tiet] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await lay_don_hang_cua_tooi();
      set_don_hangs(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      set_dang_tai(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const xu_ly_huy = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        await huy_don_hang(id);
        toast.success("Đã hủy đơn hàng thành công");
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.detail || "Không thể hủy đơn hàng");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Chờ xác nhận': return <Clock size={18} color="#f59e0b" />;
      case 'Đã xác nhận': return <CheckCircle2 size={18} color="#10b981" />;
      case 'Đang giao': return <Truck size={18} color="#3b82f6" />;
      case 'Đã giao': return <CheckCircle2 size={18} color="#059669" />;
      case 'Đã hủy': return <XCircle size={18} color="#ef4444" />;
      default: return <Info size={18} color="#6b7280" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Chờ xác nhận': return { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };
      case 'Đã xác nhận': return { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
      case 'Đang giao': return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
      case 'Đã giao': return { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' };
      case 'Đã hủy': return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' };
      default: return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    }
  };

  if (dang_tai) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto 20px' }}></div>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Đang tải đơn hàng của bạn...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
      {/* Modal chi tiết đơn hàng */}
      {don_hang_chi_tiet && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative' }}>
            <button onClick={() => set_don_hang_chi_tiet(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            <h2 style={{ marginBottom: '24px', fontWeight: '800' }}>Chi tiết đơn hàng #DH{don_hang_chi_tiet.id.toString().padStart(5, '0')}</h2>
            
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f9f9f9', borderRadius: '12px' }}>
              <p><strong>Người nhận:</strong> {don_hang_chi_tiet.ho_ten}</p>
              <p><strong>Số điện thoại:</strong> {don_hang_chi_tiet.so_dien_thoai}</p>
              <p><strong>Địa chỉ:</strong> {don_hang_chi_tiet.dia_chi}</p>
              {don_hang_chi_tiet.ghi_chu && <p><strong>Ghi chú:</strong> {don_hang_chi_tiet.ghi_chu}</p>}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: '700' }}>Sản phẩm đã đặt</h3>
              {don_hang_chi_tiet.chi_tiet.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img src={item.san_pham?.hinh_anh} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <p style={{ fontWeight: '600' }}>{item.san_pham?.ten_san_pham}</p>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.so_luong} x {item.gia_don_vi.toLocaleString()} ₫</p>
                    </div>
                  </div>
                  <p style={{ fontWeight: '700' }}>{(item.so_luong * item.gia_don_vi).toLocaleString()} ₫</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>Tổng cộng</p>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', fontWeight: '900' }}>{don_hang_chi_tiet.tong_tien.toLocaleString()} ₫</h3>
            </div>
            
            <button onClick={() => set_don_hang_chi_tiet(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Đóng</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary-color)', color: '#fff', padding: '12px', borderRadius: '16px' }}>
          <ShoppingBag size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Đơn Hàng Của Tôi</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>Theo dõi trạng thái các đơn hàng bạn đã đặt</p>
        </div>
      </div>

      {don_hangs.length === 0 ? (
        <div className="card" style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '32px' }}>
          <Package size={64} color="#ccc" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>Bạn chưa có đơn hàng nào</h3>
          <p style={{ color: '#666', marginBottom: '32px' }}>Hãy khám phá các sản phẩm gỗ tre tuyệt vời của chúng tôi nhé!</p>
          <a href="/san-pham" className="btn btn-primary" style={{ padding: '12px 32px' }}>Khám phá ngay</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {don_hangs.map((dh) => (
            <div key={dh.id} className="card order-card" style={{ 
              padding: '0', 
              borderRadius: '24px', 
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid #eee'
            }}>
              <div style={{ 
                padding: '24px 32px', 
                background: '#fafafa', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Mã đơn hàng</p>
                    <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>#DH{dh.id.toString().padStart(5, '0')}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ngày đặt</p>
                    <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{new Date(dh.ngay_tao).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Tổng tiền</p>
                    <p style={{ fontWeight: '800', color: 'var(--primary-color)' }}>{dh.tong_tien.toLocaleString()} ₫</p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px', 
                  borderRadius: '100px',
                  ...getStatusStyle(dh.trang_thai)
                }}>
                  {getStatusIcon(dh.trang_thai)}
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{dh.trang_thai}</span>
                </div>
              </div>

              <div style={{ padding: '24px 32px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Truck size={16} /> <strong>Địa chỉ giao hàng:</strong> {dh.ho_ten} - {dh.so_dien_thoai}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#888', marginLeft: '24px' }}>{dh.dia_chi}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                  {dh.trang_thai === 'Chờ xác nhận' && (
                    <button 
                      onClick={() => xu_ly_huy(dh.id)}
                      style={{ 
                        background: '#fef2f2', 
                        border: '1px solid #fee2e2', 
                        color: '#ef4444', 
                        fontWeight: '600', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '0.9rem'
                      }}>
                      <AlertTriangle size={16} /> Hủy đơn hàng
                    </button>
                  )}
                  <button 
                    onClick={() => set_don_hang_chi_tiet(dh)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--primary-color)', 
                      fontWeight: '600', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}>
                    <Eye size={18} /> Xem chi tiết <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          border-color: var(--primary-color);
        }
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid #FFF;
          border-bottom-color: var(--primary-color);
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DonHangCuaToi;
