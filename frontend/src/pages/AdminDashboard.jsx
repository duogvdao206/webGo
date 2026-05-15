import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { them_san_pham, lay_tat_ca_san_pham, cap_nhat_san_pham, xoa_san_pham } from '../services/api/api_san_pham';
import { lay_thong_ke_tong_quan } from '../services/api/api_thong_ke';
import { toast } from 'react-toastify';
import { 
  PlusCircle, Image, AlignLeft, DollarSign, Package, 
  LayoutDashboard, Users, ShoppingCart, Box, BarChart3, 
  Trash2, Edit, XCircle, List, CheckCircle2 
} from 'lucide-react';

// === CÁC COMPONENT CON (NỘI DUNG TỪNG TRANG) ===

const TongQuan = ({ thong_ke }) => {
  const stats = [
    { label: 'Tổng doanh thu', value: `${(thong_ke?.tong_doanh_thu || 0).toLocaleString()} ₫`, icon: <BarChart3/>, color: '#10b981' },
    { label: 'Đơn hàng mới', value: thong_ke?.tong_don_hang || 0, icon: <ShoppingCart/>, color: '#3b82f6' },
    { label: 'Sản phẩm', value: thong_ke?.tong_san_pham || 0, icon: <Box/>, color: '#8b5e3c' },
    { label: 'Khách hàng', value: thong_ke?.tong_nguoi_dung || 0, icon: <Users/>, color: '#8b5cf6' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Tổng quan hệ thống</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: `${stat.color}20`, color: stat.color, padding: '12px', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DanhSachSanPham = ({ set_active_tab, set_san_pham_dang_sua, set_form_data, danh_sach, tai_du_lieu, dang_tai_ds }) => {
  const xu_ly_sua = (sp) => {
    set_san_pham_dang_sua(sp);
    set_form_data({
      ten_san_pham: sp.ten_san_pham,
      gia: sp.gia,
      mo_ta: sp.mo_ta,
      hinh_anh: sp.hinh_anh,
      so_luong: sp.so_luong,
      noi_bat: sp.noi_bat
    });
    set_active_tab('san_pham_form');
  };

  const xu_ly_xoa = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await xoa_san_pham(id);
        toast.success('Xóa sản phẩm thành công!');
        tai_du_lieu();
      } catch (loi) {
        toast.error('Lỗi khi xóa sản phẩm');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Danh sách sản phẩm</h1>
        <button onClick={tai_du_lieu} className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', background: '#fff', border: '1px solid #d1d5db' }} disabled={dang_tai_ds}>
          {dang_tai_ds ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>
      <div className="card" style={{ padding: '24px', overflowX: 'auto', position: 'relative' }}>
        {dang_tai_ds && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <div className="spinner"></div>
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', opacity: dang_tai_ds ? 0.5 : 1 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <th style={{ padding: '12px 16px' }}>Hình ảnh</th>
              <th style={{ padding: '12px 16px' }}>Tên sản phẩm</th>
              <th style={{ padding: '12px 16px' }}>Giá</th>
              <th style={{ padding: '12px 16px' }}>Kho</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {danh_sach.map((sp) => (
              <tr key={sp.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}>
                  <img src={sp.hinh_anh} alt={sp.ten_san_pham} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{sp.ten_san_pham}</td>
                <td style={{ padding: '12px 16px' }}>{sp.gia.toLocaleString('vi-VN')} ₫</td>
                <td style={{ padding: '12px 16px' }}>{sp.so_luong}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => xu_ly_sua(sp)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#3b82f6' }}
                      title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => xu_ly_xoa(sp.id)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#ef4444' }}
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {danh_sach.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Chưa có sản phẩm nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FormSanPham = ({ san_pham_dang_sua, form_data, set_form_data, lam_moi_form, tai_du_lieu, set_active_tab }) => {
  const [dang_tai, set_dang_tai] = useState(false);

  const xu_ly_nhap = (e) => set_form_data({ ...form_data, [e.target.name]: e.target.value });

  const xu_ly_gui = async (e) => {
    e.preventDefault();
    set_dang_tai(true);
    try {
      if (san_pham_dang_sua) {
        await cap_nhat_san_pham(san_pham_dang_sua.id, { 
          ...form_data, 
          gia: Number(form_data.gia), 
          so_luong: Number(form_data.so_luong),
          noi_bat: Boolean(form_data.noi_bat)
        });
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await them_san_pham({ 
          ...form_data, 
          gia: Number(form_data.gia), 
          so_luong: Number(form_data.so_luong),
          noi_bat: Boolean(form_data.noi_bat)
        });
        toast.success('Thêm sản phẩm thành công!');
      }
      lam_moi_form();
      await tai_du_lieu();
      set_active_tab('san_pham_list');
    } catch (loi) {
      toast.error(san_pham_dang_sua ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm sản phẩm');
    } finally {
      set_dang_tai(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
        {san_pham_dang_sua ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={xu_ly_gui}>
            <div className="form-group">
              <label className="form-label">Tên sản phẩm</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Package size={18}/></div>
                <input className="form-input" style={{ paddingLeft: '44px' }} type="text" name="ten_san_pham" value={form_data.ten_san_pham} onChange={xu_ly_nhap} required />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Giá (VNĐ)</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><DollarSign size={18}/></div>
                  <input className="form-input" style={{ paddingLeft: '44px' }} type="number" name="gia" value={form_data.gia} onChange={xu_ly_nhap} required min="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Số lượng trong kho</label>
                <input className="form-input" type="number" name="so_luong" value={form_data.so_luong} onChange={xu_ly_nhap} required min="0" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL Hình ảnh</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Image size={18}/></div>
                <input className="form-input" style={{ paddingLeft: '44px' }} type="url" name="hinh_anh" placeholder="https://..." value={form_data.hinh_anh} onChange={xu_ly_nhap} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea className="form-input" style={{ minHeight: '120px', resize: 'vertical' }} name="mo_ta" value={form_data.mo_ta} onChange={xu_ly_nhap} required />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff9f2', padding: '12px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
              <input 
                type="checkbox" 
                name="noi_bat" 
                checked={form_data.noi_bat} 
                onChange={(e) => set_form_data({ ...form_data, noi_bat: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }}
              />
              <label className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: '600', color: '#8b4513' }}>
                Đánh dấu là Sản phẩm nổi bật (Hiển thị trang chủ)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={dang_tai}>
                {dang_tai ? 'Đang xử lý...' : (san_pham_dang_sua ? <><CheckCircle2 size={20}/> Cập nhật sản phẩm</> : <><PlusCircle size={20}/> Lưu sản phẩm</>)}
              </button>
              {san_pham_dang_sua && (
                <button type="button" onClick={lam_moi_form} className="btn" style={{ flex: 1, background: '#f3f4f6', color: '#4b5563' }}>
                  Hủy bỏ
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-light)' }}>Xem trước hiển thị</h2>
          <div className="card" style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', overflow: 'hidden', marginBottom: '20px' }}>
            {form_data.hinh_anh ? (
              <img src={form_data.hinh_anh} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x300?text=Lỗi+tải+ảnh" }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                <Image size={48} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p>URL hình ảnh sẽ hiển thị tại đây</p>
              </div>
            )}
          </div>
          {form_data.ten_san_pham && (
            <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary-color)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>{form_data.ten_san_pham}</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.3rem' }}>{Number(form_data.gia).toLocaleString('vi-VN')} ₫</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '8px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {form_data.mo_ta}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TinhNangDangPhatTrien = ({ tieu_de }) => (
  <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px' }}>
    <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '16px' }}>{tieu_de}</h1>
    <p style={{ color: 'var(--text-light)' }}>Tính năng này đang trong quá trình phát triển.</p>
  </div>
);

// === COMPONENT GỐC ===

const MenuItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
      width: '100%', background: active ? 'rgba(139, 94, 60, 0.1)' : 'transparent', 
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      color: active ? 'var(--primary-color)' : 'var(--text-light)',
      fontWeight: active ? '600' : '500', transition: 'var(--transition)',
      textAlign: 'left', marginBottom: '4px'
    }}
  >
    {icon} {label}
  </button>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const vai_tro = localStorage.getItem('vai_tro');
  const ten_dang_nhap = localStorage.getItem('ten_dang_nhap');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [danh_sach, set_danh_sach] = useState([]);
  const [dang_tai_ds, set_dang_tai_ds] = useState(false);
  const [thong_ke, set_thong_ke] = useState(null);
  const [san_pham_dang_sua, set_san_pham_dang_sua] = useState(null);
  const [form_data, set_form_data] = useState({ ten_san_pham: '', gia: '', mo_ta: '', hinh_anh: '', so_luong: 10, noi_bat: false });

  const tai_thong_ke = async () => {
    try {
      const data = await lay_thong_ke_tong_quan();
      set_thong_ke(data);
    } catch (loi) {
      console.error("Lỗi tải thống kê:", loi);
    }
  };

  const tai_du_lieu = async () => {
    set_dang_tai_ds(true);
    try {
      const data = await lay_tat_ca_san_pham();
      set_danh_sach(Array.isArray(data) ? data : []);
    } catch (loi) {
      console.error("Lỗi tải SP:", loi);
      toast.error('Không thể kết nối tới máy chủ để tải sản phẩm');
    } finally {
      set_dang_tai_ds(false);
    }
  };

  useEffect(() => {
    if (vai_tro !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này!');
      navigate('/');
    } else {
      tai_thong_ke();
      tai_du_lieu();
    }
  }, [vai_tro, navigate]);

  const lam_moi_form = () => {
    set_san_pham_dang_sua(null);
    set_form_data({ ten_san_pham: '', gia: '', mo_ta: '', hinh_anh: '', so_luong: 10, noi_bat: false });
  };

  if (vai_tro !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '80vh', gap: '32px', margin: '-40px -24px', background: '#fafaf9' }}>
      
      {/* Sidebar (Menu trái) */}
      <div style={{ width: '280px', background: '#fff', borderRight: '1px solid var(--border-color)', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '700' }}>Admin Panel</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '4px' }}>Hi, {ten_dang_nhap}</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
          <MenuItem icon={<LayoutDashboard size={20}/>} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          
          <div style={{ margin: '16px 0 8px 12px', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quản lý sản phẩm
          </div>
          <MenuItem icon={<List size={20}/>} label="Danh sách sản phẩm" active={activeTab === 'san_pham_list'} onClick={() => setActiveTab('san_pham_list')} />
          <MenuItem 
            icon={<PlusCircle size={20}/>} 
            label="Thêm sản phẩm" 
            active={activeTab === 'san_pham_form' && !san_pham_dang_sua} 
            onClick={() => { lam_moi_form(); setActiveTab('san_pham_form'); }} 
          />
          {san_pham_dang_sua && (
            <MenuItem 
              icon={<Edit size={20}/>} 
              label="Đang sửa sản phẩm" 
              active={activeTab === 'san_pham_form'} 
              onClick={() => setActiveTab('san_pham_form')} 
            />
          )}
          
          <div style={{ margin: '16px 0 8px 12px', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hệ thống
          </div>
          <MenuItem icon={<ShoppingCart size={20}/>} label="Đơn hàng" active={activeTab === 'don_hang'} onClick={() => setActiveTab('don_hang')} />
          <MenuItem icon={<Users size={20}/>} label="Người dùng" active={activeTab === 'nguoi_dung'} onClick={() => setActiveTab('nguoi_dung')} />
        </nav>
      </div>

      {/* Main Content (Nội dung phải) */}
      <div style={{ flex: 1, padding: '40px 40px 40px 0', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && <TongQuan thong_ke={thong_ke} />}
        
        {activeTab === 'san_pham_list' && (
          <DanhSachSanPham 
            danh_sach={danh_sach} 
            tai_du_lieu={tai_du_lieu} 
            dang_tai_ds={dang_tai_ds}
            set_active_tab={setActiveTab} 
            set_san_pham_dang_sua={set_san_pham_dang_sua}
            set_form_data={set_form_data}
          />
        )}
        
        {activeTab === 'san_pham_form' && (
          <FormSanPham 
            san_pham_dang_sua={san_pham_dang_sua}
            form_data={form_data}
            set_form_data={set_form_data}
            lam_moi_form={lam_moi_form}
            tai_du_lieu={tai_du_lieu}
            set_active_tab={setActiveTab}
          />
        )}

        {activeTab === 'don_hang' && <TinhNangDangPhatTrien tieu_de="Quản lý Đơn hàng" />}
        {activeTab === 'nguoi_dung' && <TinhNangDangPhatTrien tieu_de="Quản lý Người dùng" />}
      </div>
      
    </div>
  );
};

export default AdminDashboard;
