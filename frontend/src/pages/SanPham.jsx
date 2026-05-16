import { useState, useEffect } from 'react';
import { lay_tat_ca_san_pham } from '../services/api/api_san_pham';
import { ShoppingBag, Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGioHang } from '../components/GioHangContext';

const SanPhamPage = () => {
  const { them_vao_gio } = useGioHang();
  const [danh_sach, set_danh_sach] = useState([]);
  const [dang_tai, set_dang_tai] = useState(true);
  const [tu_khoa, set_tu_khoa] = useState('');
  const [gia_loc, set_gia_loc] = useState(10000000); // Mặc định 10M

  useEffect(() => {
    const tai_du_lieu = async () => {
      try {
        const data = await lay_tat_ca_san_pham();
        set_danh_sach(Array.isArray(data) ? data : []);
      } catch (loi) {
        console.error("Lỗi tải SP:", loi);
        toast.error('Không thể tải danh sách sản phẩm');
      } finally {
        set_dang_tai(false);
      }
    };
    tai_du_lieu();
  }, []);

  const danh_sach_loc = danh_sach.filter(sp => 
    sp.ten_san_pham.toLowerCase().includes(tu_khoa.toLowerCase()) && 
    sp.gia <= gia_loc
  );

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh' }}>
      {/* Banner Header */}
      <div style={{ 
        height: '250px', 
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200") center/cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '12px' }}>Cửa Hàng Gỗ Mỹ Nghệ</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', opacity: 0.9 }}>
          <span>Trang chủ</span> <ChevronRight size={14}/> <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sản phẩm</span>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', paddingBottom: '80px' }}>
        
        {/* Sidebar Bộ lọc */}
        <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #eee', pb: '12px' }}>
              <Filter size={20} color="var(--primary-color)"/>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Bộ lọc tìm kiếm</h3>
            </div>

            {/* Tìm kiếm */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Tìm tên sản phẩm</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}/>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ví dụ: Bàn trà..." 
                  style={{ paddingLeft: '40px', fontSize: '0.9rem' }}
                  value={tu_khoa}
                  onChange={(e) => set_tu_khoa(e.target.value)}
                />
              </div>
            </div>

            {/* Khoảng giá */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: 0 }}>Khoảng giá</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                  {gia_loc.toLocaleString()} ₫
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20000000" 
                step="500000" 
                value={gia_loc}
                onChange={(e) => set_gia_loc(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-color)' }} 
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                <span>0đ</span>
                <span>20M+</span>
              </div>
            </div>

            {/* Danh mục (Demo) */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Danh mục</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Bàn ghế gỗ', 'Kệ trang trí', 'Đồ mỹ nghệ', 'Nội thất phòng ngủ'].map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: '#4b5563' }}>
                    <input type="checkbox" style={{ accentColor: 'var(--primary-color)' }} /> {cat}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Danh sách sản phẩm */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--text-light)' }}>Hiển thị <b>{danh_sach_loc.length}</b> sản phẩm</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Sắp xếp:</span>
              <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}>
                <option>Mới nhất</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
              </select>
            </div>
          </div>

          {dang_tai ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
              <p>Đang tải tinh hoa đồ gỗ...</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: '30px' 
            }}>
              {danh_sach_loc.map((sp) => (
                <div key={sp.id} className="card product-card" style={{ overflow: 'hidden', transition: 'var(--transition)' }}>
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={sp.hinh_anh} 
                      alt={sp.ten_san_pham} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {sp.so_luong <= 5 && (
                      <span style={{ 
                        position: 'absolute', top: '12px', right: '12px', 
                        background: '#ef4444', color: '#fff', 
                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600'
                      }}>
                        Sắp hết hàng
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)', height: '2.4rem', overflow: 'hidden' }}>
                      {sp.ten_san_pham}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: '800' }}>
                        {sp.gia.toLocaleString('vi-VN')} ₫
                      </p>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => them_vao_gio(sp)}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {danh_sach_loc.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px' }}>
                  <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <h3>Không tìm thấy sản phẩm phù hợp</h3>
                  <p style={{ color: '#999' }}>Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</p>
                  <button onClick={() => { set_tu_khoa(''); set_gia_loc(10000000); }} className="btn" style={{ marginTop: '20px' }}>Xóa bộ lọc</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
        }
      `}} />
    </div>
  );
};

export default SanPhamPage;
