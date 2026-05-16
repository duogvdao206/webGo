import { useState } from 'react';
import { useGioHang } from '../components/GioHangContext';
import { tao_don_hang } from '../services/api/api_don_hang';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, User, Phone, ClipboardList, CheckCircle2 } from 'lucide-react';

const ThanhToan = () => {
  const { gio_hang, tong_tien, lam_trong_gio } = useGioHang();
  const navigate = useNavigate();
  const [dang_gui, set_dang_gui] = useState(false);
  const [hoan_tat, set_hoan_tat] = useState(false);

  const [form, set_form] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: '',
    ghi_chu: ''
  });

  if (gio_hang.length === 0 && !hoan_tat) {
    navigate('/gio-hang');
    return null;
  }

  const xu_ly_gui = async (e) => {
    e.preventDefault();
    if (!form.ho_ten || !form.so_dien_thoai || !form.dia_chi) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    set_dang_gui(true);
    try {
      const payload = {
        ...form,
        tong_tien,
        chi_tiet: gio_hang.map(item => ({
          san_pham_id: item.id,
          so_luong: item.so_luong_mua,
          gia_don_vi: item.gia
        }))
      };

      await tao_don_hang(payload);
      toast.success('Đặt hàng thành công!');
      lam_trong_gio();
      set_hoan_tat(true);
    } catch (loi) {
      console.error(loi);
      toast.error('Đã có lỗi xảy ra khi đặt hàng');
    } finally {
      set_dang_gui(false);
    }
  };

  if (hoan_tat) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ color: '#22c55e', marginBottom: '24px' }}>
          <CheckCircle2 size={100} style={{ margin: '0 auto' }} />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Cảm Ơn Bạn Đã Tin Tưởng!</h2>
        <p style={{ color: '#666', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý. Chúng tôi sẽ liên hệ với bạn qua số điện thoại để xác nhận sớm nhất.
        </p>
        <button onClick={() => navigate('/san-pham')} className="btn-primary" style={{ padding: '12px 32px', borderRadius: '12px' }}>
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px', textAlign: 'center' }}>Thanh Toán</h1>

      <form onSubmit={xu_ly_gui} style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '40px' }}>
        {/* Thông tin giao hàng */}
        <div className="card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Truck color="var(--primary-color)" /> Thông tin giao hàng
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label"><User size={14} style={{ marginRight: '6px' }}/> Họ tên người nhận</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nguyễn Văn A"
                value={form.ho_ten}
                onChange={e => set_form({...form, ho_ten: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label"><Phone size={14} style={{ marginRight: '6px' }}/> Số điện thoại</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="09xx xxx xxx"
                value={form.so_dien_thoai}
                onChange={e => set_form({...form, so_dien_thoai: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label"><MapPin size={14} style={{ marginRight: '6px' }}/> Địa chỉ nhận hàng</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              value={form.dia_chi}
              onChange={e => set_form({...form, dia_chi: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label"><ClipboardList size={14} style={{ marginRight: '6px' }}/> Ghi chú thêm (không bắt buộc)</label>
            <textarea 
              className="form-input" 
              rows="4" 
              placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến..."
              value={form.ghi_chu}
              onChange={e => set_form({...form, ghi_chu: e.target.value})}
              style={{ resize: 'none' }}
            ></textarea>
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <aside>
          <div className="card" style={{ padding: '32px', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '24px' }}>Đơn hàng ({gio_hang.length} sản phẩm)</h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', paddingRight: '10px' }}>
              {gio_hang.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                  <img src={item.hinh_anh} alt={item.ten_san_pham} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{item.ten_san_pham}</p>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>SL: {item.so_luong_mua} x {item.gia.toLocaleString()} ₫</p>
                  </div>
                  <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{(item.gia * item.so_luong_mua).toLocaleString()} ₫</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#666' }}>Tạm tính</span>
                <span style={{ fontWeight: '600' }}>{tong_tien.toLocaleString()} ₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: '#666' }}>Vận chuyển</span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>Tổng cộng</span>
                <span style={{ fontWeight: '900', fontSize: '1.6rem', color: 'var(--primary-color)' }}>{tong_tien.toLocaleString()} ₫</span>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={dang_gui}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  fontSize: '1.1rem', 
                  fontWeight: '700',
                  opacity: dang_gui ? 0.7 : 1,
                  cursor: dang_gui ? 'not-allowed' : 'pointer'
                }}
              >
                {dang_gui ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '16px' }}>
                Bằng cách đặt hàng, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default ThanhToan;
