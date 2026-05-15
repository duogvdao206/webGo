import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lay_san_pham_trang_chu } from '../services/api/api_san_pham';
import { ShoppingBag, ArrowRight, ShieldCheck, Heart, Truck, Award, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const TrangChu = () => {
  const navigate = useNavigate();
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
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(rgba(45, 36, 28, 0.6), rgba(45, 36, 28, 0.6)), url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920") center/cover',
        borderRadius: '24px',
        padding: '120px 40px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '80px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1' }}>Tre Gỗ Việt <br/> Tinh Hoa Đất Việt</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.95, maxWidth: '700px', margin: '0 auto 40px' }}>Chuyên cung cấp các sản phẩm nội thất từ tre và gỗ tự nhiên cao cấp, mang đến vẻ đẹp mộc mạc nhưng đầy sang trọng cho ngôi nhà của bạn.</p>
        <button onClick={() => navigate('/san-pham')} className="btn btn-primary" style={{ padding: '18px 36px', fontSize: '1.1rem', borderRadius: '30px' }}>
          Xem Bộ Sưu Tập <ArrowRight size={20} />
        </button>
      </section>

      {/* Cam kết của shop */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '80px' }}>
        {[
          { icon: <ShieldCheck size={32}/>, title: "Chất lượng cao", desc: "100% gỗ tự nhiên" },
          { icon: <Truck size={32}/>, title: "Giao hàng nhanh", desc: "Toàn quốc trong 3 ngày" },
          { icon: <Heart size={32}/>, title: "Tận tâm", desc: "Chăm sóc khách hàng 24/7" },
          { icon: <Award size={32}/>, title: "Bảo hành", desc: "Cam kết bảo hành 2 năm" },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '30px', background: '#fff', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
            <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Giới thiệu về Shop */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '100px' }}>
        <div style={{ position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1596683764394-b7437ef46e1e?q=80&w=800" alt="About" style={{ width: '100%', borderRadius: '24px', boxShadow: '20px 20px 0px var(--primary-color)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '250px' }}>
            <h5 style={{ color: 'var(--primary-color)', fontSize: '2rem', fontWeight: '800' }}>15+</h5>
            <p style={{ fontWeight: '600' }}>Năm kinh nghiệm trong ngành đồ mỹ nghệ</p>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'var(--primary-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Về chúng tôi</h4>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--text-main)' }}>Nâng Tầm Không Gian Sống Bằng Đồ Gỗ Thủ Công</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '24px' }}>
            Tại Tre Gỗ Việt, chúng tôi tin rằng mỗi khối gỗ, mỗi thanh tre đều mang trong mình một linh hồn. Qua bàn tay khéo léo của các nghệ nhân làng nghề, chúng tôi biến những vật liệu thô sơ thành các tác phẩm nghệ thuật có giá trị sử dụng cao.
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['Sử dụng gỗ bền vững, thân thiện môi trường', 'Thiết kế độc quyền, mang bản sắc riêng', 'Gia công tinh xảo đến từng chi tiết'].map(point => (
              <li key={point} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontWeight: '600' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Products */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Sản Phẩm Nổi Bật</h2>
          <div style={{ width: '80px', height: '4px', background: 'var(--primary-color)', marginTop: '8px' }}></div>
        </div>
        <button onClick={() => navigate('/san-pham')} className="btn" style={{ background: '#fff', border: '1px solid #ddd' }}>
          Xem tất cả sản phẩm
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {danh_sach_san_pham.length > 0 ? (
          danh_sach_san_pham.map((sp, index) => (
            <div key={sp.id} className="card product-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                <img src={sp.hinh_anh} alt={sp.ten_san_pham} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} className="main-img" />
                {sp.noi_bat && (
                  <div style={{ 
                    position: 'absolute', top: '16px', left: '16px', 
                    background: 'var(--primary-color)', color: '#fff', 
                    padding: '6px 14px', borderRadius: '30px', 
                    fontSize: '0.85rem', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}>
                    <Star size={14} fill="#fff"/> NỔI BẬT
                  </div>
                )}
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>{sp.ten_san_pham}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-color)' }}>{sp.gia.toLocaleString('vi-VN')} ₫</span>
                  <button onClick={() => themVaoGio(sp)} className="btn-primary" style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '24px' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Chưa có sản phẩm nổi bật nào được chọn.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .product-card:hover .main-img {
          transform: scale(1.1);
        }
        .product-card {
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-10px);
        }
      `}} />
    </div>
  );
};

export default TrangChu;
