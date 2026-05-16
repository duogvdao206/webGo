import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { them_san_pham, lay_tat_ca_san_pham, cap_nhat_san_pham, xoa_san_pham } from '../services/api/api_san_pham';
import { lay_thong_ke_tong_quan } from '../services/api/api_thong_ke';
import { toast } from 'react-toastify';
import { 
  PlusCircle, Image, AlignLeft, DollarSign, Package, 
  LayoutDashboard, Users, ShoppingCart, Box, BarChart3, 
  Trash2, Edit, XCircle, List, CheckCircle2, Settings, Home, FileUp, Eye
} from 'lucide-react';
import { tai_anh_len } from '../services/api/api_upload';
import { lay_cau_hinh, cap_nhat_cau_hinh } from '../services/api/api_cau_hinh';
import { lay_danh_sach_don_hang, cap_nhat_trang_thai_don_hang, huy_don_hang } from '../services/api/api_don_hang';

// === CÁC COMPONENT CON (NỘI DUNG TỪNG TRANG) ===

const CauHinhTrangChu = () => {
  const [config, setConfig] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_banner: '',
    about_title: '',
    about_desc: '',
    about_img: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await lay_cau_hinh();
        if (Object.keys(data).length > 0) {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Lỗi khi tải cấu hình');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setConfig({ ...config, [e.target.name]: e.target.value });

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const toastId = toast.loading("Đang tải ảnh lên...");
    try {
      const res = await tai_anh_len(file);
      setConfig({ ...config, [field]: res.url });
      toast.update(toastId, { render: "Tải ảnh thành công!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      toast.update(toastId, { render: err.response?.data?.detail || "Lỗi khi tải ảnh", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cap_nhat_cau_hinh(config);
      toast.success('Cập nhật trang chủ thành công!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Lỗi khi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Cấu hình trang chủ</h1>
      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Section 1: Hero */}
            <div>
              <h3 style={{ marginBottom: '20px', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', pb: '4px' }}>Phần Banner Chính (Hero)</h3>
              <div className="form-group">
                <label className="form-label">Tiêu đề chính</label>
                <input className="form-input" name="hero_title" value={config.hero_title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề phụ</label>
                <textarea className="form-input" name="hero_subtitle" value={config.hero_subtitle} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Ảnh Banner (Khuyên dùng 1920x800)</label>
                <input type="file" onChange={(e) => handleUpload(e, 'hero_banner')} style={{ marginBottom: '10px' }} />
                <div style={{ height: '150px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                  <img src={config.hero_banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>

            {/* Section 2: About */}
            <div>
              <h3 style={{ marginBottom: '20px', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', pb: '4px' }}>Phần Giới Thiệu (About)</h3>
              <div className="form-group">
                <label className="form-label">Tiêu đề giới thiệu</label>
                <input className="form-input" name="about_title" value={config.about_title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung giới thiệu</label>
                <textarea className="form-input" style={{ height: '100px' }} name="about_desc" value={config.about_desc} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Ảnh giới thiệu</label>
                <input type="file" onChange={(e) => handleUpload(e, 'about_img')} style={{ marginBottom: '10px' }} />
                <div style={{ height: '150px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                  <img src={config.about_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '30px', width: '200px' }} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
};

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

  const xu_ly_xoa = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await xoa_san_pham(id);
        toast.success('Xóa sản phẩm thành công!');
        tai_du_lieu();
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Lỗi khi xóa sản phẩm');
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
                      onClick={(e) => xu_ly_xoa(e, sp.id)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#ef4444' }}
                      title="Xóa"
                    >
                      <Trash2 size={18} style={{ pointerEvents: 'none' }} />
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
      const payload = { 
        ...form_data, 
        gia: Number(form_data.gia), 
        so_luong: Number(form_data.so_luong),
        noi_bat: Boolean(form_data.noi_bat)
      };

      if (san_pham_dang_sua) {
        await cap_nhat_san_pham(san_pham_dang_sua.id, payload);
      } else {
        await them_san_pham(payload);
      }
      
      toast.success(san_pham_dang_sua ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
      lam_moi_form();
      await tai_du_lieu();
      set_active_tab('san_pham_list');
    } catch (err) {
      toast.error(err.response?.data?.detail || (san_pham_dang_sua ? 'Lỗi khi cập nhật' : 'Lỗi khi thêm sản phẩm'));
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
              <label className="form-label">Hình ảnh sản phẩm</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><Image size={18}/></div>
                  <input className="form-input" style={{ paddingLeft: '44px' }} type="text" name="hinh_anh" placeholder="URL ảnh hoặc chọn file bên phải..." value={form_data.hinh_anh} onChange={xu_ly_nhap} required />
                </div>
                <label style={{ 
                  background: 'var(--primary-color)', color: '#fff', padding: '12px 20px', 
                  borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  fontWeight: '600', fontSize: '0.9rem'
                }}>
                  <FileUp size={18}/> Tải ảnh
                  <input type="file" hidden onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const toastId = toast.loading("Đang tải ảnh lên...");
                    try {
                      const res = await tai_anh_len(file);
                      set_form_data({ ...form_data, hinh_anh: res.url });
                      toast.update(toastId, { render: "Tải ảnh thành công!", type: "success", isLoading: false, autoClose: 3000 });
                    } catch (err) {
                      toast.update(toastId, { render: "Lỗi tải ảnh", type: "error", isLoading: false, autoClose: 3000 });
                    }
                  }} />
                </label>
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

const QuanLyDonHang = () => {
  const [donHangs, setDonHangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [don_hang_chi_tiet, set_don_hang_chi_tiet] = useState(null);

  const taiDuLieu = async () => {
    setLoading(true);
    try {
      const data = await lay_danh_sach_don_hang();
      setDonHangs(data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await cap_nhat_trang_thai_don_hang(id, status);
      toast.success('Cập nhật trạng thái thành công');
      taiDuLieu();
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        await huy_don_hang(id);
        toast.success("Đã hủy đơn hàng");
        taiDuLieu();
      } catch (err) {
        toast.error("Lỗi khi hủy đơn hàng");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ xác nhận': return '#f59e0b';
      case 'Đã xác nhận': return '#3b82f6';
      case 'Đang giao': return '#8b5cf6';
      case 'Đã giao': return '#10b981';
      case 'Đã hủy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      {/* Modal chi tiết cho Admin */}
      {don_hang_chi_tiet && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', color: '#333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: '800' }}>Đơn hàng #DH{don_hang_chi_tiet.id}</h2>
              <button onClick={() => set_don_hang_chi_tiet(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '8px', borderBottom: '1px solid #ddd', pb: '4px' }}>Thông tin khách hàng</h4>
                <p><strong>Họ tên:</strong> {don_hang_chi_tiet.ho_ten}</p>
                <p><strong>SĐT:</strong> {don_hang_chi_tiet.so_dien_thoai}</p>
                <p><strong>Địa chỉ:</strong> {don_hang_chi_tiet.dia_chi}</p>
                <p><strong>Ngày đặt:</strong> {new Date(don_hang_chi_tiet.ngay_tao).toLocaleString('vi-VN')}</p>
              </div>
              <div style={{ padding: '16px', background: '#fff9f2', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '8px', borderBottom: '1px solid #ddd', pb: '4px' }}>Trạng thái & Ghi chú</h4>
                <p><strong>Trạng thái hiện tại:</strong> <span style={{ color: getStatusColor(don_hang_chi_tiet.trang_thai), fontWeight: '700' }}>{don_hang_chi_tiet.trang_thai}</span></p>
                <p><strong>Ghi chú từ khách:</strong> {don_hang_chi_tiet.ghi_chu || '(Không có)'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px' }}>Danh sách sản phẩm</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: '#eee' }}>
                    <th style={{ padding: '8px' }}>Sản phẩm</th>
                    <th style={{ padding: '8px' }}>Số lượng</th>
                    <th style={{ padding: '8px' }}>Đơn giá</th>
                    <th style={{ padding: '8px' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {don_hang_chi_tiet.chi_tiet.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{item.san_pham?.ten_san_pham}</td>
                      <td style={{ padding: '8px' }}>{item.so_luong}</td>
                      <td style={{ padding: '8px' }}>{item.gia_don_vi.toLocaleString()} ₫</td>
                      <td style={{ padding: '8px', fontWeight: '600' }}>{(item.so_luong * item.gia_don_vi).toLocaleString()} ₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <p style={{ fontSize: '1.2rem' }}>Tổng thanh toán: <strong style={{ color: 'var(--primary-color)', fontSize: '1.6rem' }}>{don_hang_chi_tiet.tong_tien.toLocaleString()} ₫</strong></p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => set_don_hang_chi_tiet(null)} className="btn" style={{ flex: 1, background: '#eee' }}>Đóng</button>
              {don_hang_chi_tiet.trang_thai !== 'Đã hủy' && don_hang_chi_tiet.trang_thai !== 'Đã giao' && (
                <button onClick={() => handleCancelOrder(don_hang_chi_tiet.id)} className="btn" style={{ flex: 1, background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' }}>Hủy đơn hàng này</button>
              )}
            </div>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Quản lý đơn hàng</h1>
      <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <th style={{ padding: '12px 16px' }}>Mã ĐH</th>
              <th style={{ padding: '12px 16px' }}>Khách hàng</th>
              <th style={{ padding: '12px 16px' }}>Ngày đặt</th>
              <th style={{ padding: '12px 16px' }}>Tổng tiền</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {donHangs.map((dh) => (
              <tr key={dh.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: '700' }}>#{dh.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: '500' }}>{dh.ho_ten}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{dh.so_dien_thoai}</div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                  {new Date(dh.ngay_tao).toLocaleString('vi-VN')}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                  {dh.tong_tien.toLocaleString()} ₫
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: `${getStatusColor(dh.trang_thai)}20`,
                    color: getStatusColor(dh.trang_thai)
                  }}>
                    {dh.trang_thai}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => set_don_hang_chi_tiet(dh)}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={14}/> Chi tiết
                    </button>
                    <select 
                      value={dh.trang_thai} 
                      onChange={(e) => handleStatusChange(dh.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Đã giao">Đã giao</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {donHangs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
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
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
      // Không hiện toast ở đây để tránh làm phiền người dùng nếu dashboard vẫn hiện được phần khác
    }
  };

  const tai_du_lieu = async () => {
    set_dang_tai_ds(true);
    try {
      const data = await lay_tat_ca_san_pham();
      set_danh_sach(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải SP:", err);
      toast.error(err.response?.data?.detail || 'Không thể kết nối tới máy chủ để tải sản phẩm');
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
          <MenuItem icon={<Home size={20}/>} label="Cấu hình trang chủ" active={activeTab === 'home_config'} onClick={() => setActiveTab('home_config')} />
          <MenuItem icon={<ShoppingCart size={20}/>} label="Đơn hàng" active={activeTab === 'don_hang'} onClick={() => setActiveTab('don_hang')} />
          <MenuItem icon={<Users size={20}/>} label="Người dùng" active={activeTab === 'nguoi_dung'} onClick={() => setActiveTab('nguoi_dung')} />
          <MenuItem icon={<Settings size={20}/>} label="Cài đặt khác" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
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

        {activeTab === 'don_hang' && <QuanLyDonHang />}
        {activeTab === 'nguoi_dung' && <TinhNangDangPhatTrien tieu_de="Quản lý Người dùng" />}
        {activeTab === 'home_config' && <CauHinhTrangChu />}
        {activeTab === 'settings' && <TinhNangDangPhatTrien tieu_de="Cài đặt hệ thống" />}
      </div>
      
    </div>
  );
};

export default AdminDashboard;
