from sqlalchemy.orm import Session
from configs.database import SessionLocal
from models.san_pham import SanPham
from configs.security import bam_mat_khau
from models.nguoi_dung import NguoiDung

def tao_du_lieu_mau():
    db = SessionLocal()
    try:
        # Kiểm tra xem có sản phẩm chưa
        san_pham_ton_tai = db.query(SanPham).first()
        if not san_pham_ton_tai:
            danh_sach_sp = [
                SanPham(ten_san_pham="Bàn Trà Tre Tự Nhiên Cao Cấp", gia=1250000, mo_ta="Bàn trà làm từ 100% tre tự nhiên, phù hợp không gian phòng khách hiện đại và mộc mạc.", hinh_anh="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800", so_luong=15),
                SanPham(ten_san_pham="Ghế Tựa Gỗ Óc Chó Thanh Lịch", gia=3500000, mo_ta="Ghế ăn gỗ óc chó nhập khẩu, thiết kế tối giản, êm ái và sang trọng.", hinh_anh="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800", so_luong=8),
                SanPham(ten_san_pham="Kệ Sách Tre Đa Năng 5 Tầng", gia=850000, mo_ta="Kệ lắp ghép linh hoạt, chịu lực tốt, giúp gọn gàng không gian làm việc.", hinh_anh="https://images.unsplash.com/photo-1594620113688-66779435b62b?q=80&w=800", so_luong=30),
                SanPham(ten_san_pham="Đèn Thả Trần Mây Tre Đan", gia=450000, mo_ta="Đèn thả thủ công nghệ thuật, tạo ánh sáng ấm áp cho phòng ngủ và quán cafe.", hinh_anh="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800", so_luong=50),
                SanPham(ten_san_pham="Khay Đựng Trà Bằng Tre Khắc Chữ", gia=300000, mo_ta="Khay trà phong cách Á Đông, chi tiết sắc nét, bền bỉ với thời gian.", hinh_anh="https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=800", so_luong=100),
                SanPham(ten_san_pham="Sofa Gỗ Sồi Bọc Nỉ Sang Trọng", gia=8900000, mo_ta="Sofa gỗ sồi tự nhiên kết hợp đệm nỉ êm ái, mang lại vẻ đẹp tân cổ điển.", hinh_anh="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", so_luong=5),
            ]
            db.add_all(danh_sach_sp)
            
        db.commit()
        print("Đã tạo dữ liệu mẫu thành công!")
    except Exception as e:
        db.rollback()
        print(f"Có lỗi xảy ra: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    tao_du_lieu_mau()
