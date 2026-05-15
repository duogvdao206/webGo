import { useState, useEffect } from 'react';
import { lay_san_pham_trang_chu } from '../services/api/api_san_pham';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const TrangChu = () => {
  const [danh_sach_san_pham, set_danh_sach_san_pham] = useState([]);
  const [dang_tai, set_dang_tai] = useState(true);

  useEffect(() => {
    const tai_du_lieu = async () => {
      try {
        const du_lieu = await lay_san_pham_trang_chu();
        set_danh_sach_san_pham(du_lieu);
      } catch (loi) {
        toast.error("Không thể kết nối đến máy chủ.");
      } finally {
        set_dang_tai(false);
      }
    };
    tai_du_lieu();
  }, []);

  const themVaoGio = (sp) => {
    toast.success(`Đã thêm ${sp.ten_san_pham} vào giỏ!`);
  };

  if (dang_tai) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(rgba(45, 36, 28, 0.7), rgba(45, 36, 28, 0.7)), url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920") center/cover',
        borderRadius: 'var(--radius-lg)',
        padding: '80px 40px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '60px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '20px', lineHeight: '1.2' }}>Nét Đẹp Tự Nhiên<br/>Trong Ngôi Nhà Bạn</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 30px' }}>Khám phá bộ sưu tập nội thất tre gỗ tinh tế, mang lại sự ấm áp và bình yên cho không gian sống.</p>
        <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
          Khám phá ngay <ArrowRight size={20} />
        </button>
      </section>

      {/* Product List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Sản Phẩm Nổi Bật</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Những sản phẩm được yêu thích nhất tháng này</p>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Xem tất cả <ArrowRight size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {danh_sach_san_pham.length > 0 ? (
          danh_sach_san_pham.map((sp, index) => (
            <div key={sp.id} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div style={{ position: 'relative' }}>
                <img src={sp.hinh_anh || "https://images.unsplash.com/photo-1594620113688-66779435b62b?q=80&w=800"} alt={sp.ten_san_pham} className="card-img" />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--surface-color)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-color)', boxShadow: 'var(--shadow-sm)' }}>
                  Mới
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{sp.ten_san_pham}</h3>
                <p className="card-desc">{sp.mo_ta || "Sản phẩm chất lượng cao từ Tre Gỗ Việt."}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span className="card-price">{sp.gia.toLocaleString('vi-VN')} ₫</span>
                  <button onClick={() => themVaoGio(sp)} className="btn btn-primary" style={{ padding: '10px 16px' }}>
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Chưa có sản phẩm nào. Vui lòng chạy file seed_data.py.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrangChu;
