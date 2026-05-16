from sqlalchemy.orm import Session
from configs.database import SessionLocal
from models.san_pham import SanPham
from models.cau_hinh import CauHinh
from configs.security import bam_mat_khau
from models.nguoi_dung import NguoiDung

def tao_du_lieu_mau():
    db = SessionLocal()
    try:
        # 1. Kiểm tra và thêm người dùng admin
        admin_ton_tai = db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == "admin").first()
        if not admin_ton_tai:
            admin = NguoiDung(
                ten_dang_nhap="admin",
                email="admin@trego.vn",
                mat_khau_ma_hoa=bam_mat_khau("admin123"),
                vai_tro="admin"
            )
            db.add(admin)
            print("Created admin account: admin / admin123")

        # 2. Check and add homepage config
        cau_hinh_ton_tai = db.query(CauHinh).first()
        if not cau_hinh_ton_tai:
            mac_dinh = [
                CauHinh(khoa="hero_title", gia_tri="Nét Đẹp Tự Nhiên Trong Ngôi Nhà Bạn"),
                CauHinh(khoa="hero_subtitle", gia_tri="Khám phá bộ sưu tập nội thất tre gỗ tinh tế, mang lại sự ấm áp và bình yên cho không gian sống."),
                CauHinh(khoa="hero_banner", gia_tri="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920"),
                CauHinh(khoa="about_title", gia_tri="Nâng Tầm Không Gian Sống Bằng Đồ Gỗ Thủ Công"),
                CauHinh(khoa="about_desc", gia_tri="Tại Tre Gỗ Việt, chúng tôi tin rằng mỗi khối gỗ, mỗi thanh tre đều mang trong mình một linh hồn. Qua bàn tay khéo léo của các nghệ nhân làng nghề, chúng tôi biến những vật liệu thô sơ thành các tác phẩm nghệ thuật có giá trị sử dụng cao."),
                CauHinh(khoa="about_img", gia_tri="https://images.unsplash.com/photo-1596683764394-b7437ef46e1e?q=80&w=800")
            ]
            db.add_all(mac_dinh)
            print("Created default homepage configurations.")

        # 3. Check if products exist
        san_pham_ton_tai = db.query(SanPham).first()
        if not san_pham_ton_tai:
            danh_sach_sp = [
                SanPham(ten_san_pham="Bàn Trà Tre Tự Nhiên Cao Cấp", gia=1250000, mo_ta="Bàn trà làm từ 100% tre tự nhiên, phù hợp không gian phòng khách hiện đại và mộc mạc.", hinh_anh="https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800", so_luong=15, noi_bat=True),
                SanPham(ten_san_pham="Ghế Tựa Gỗ Óc Chó Thanh Lịch", gia=3500000, mo_ta="Ghế ăn gỗ óc chó nhập khẩu, thiết kế tối giản, êm ái và sang trọng.", hinh_anh="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800", so_luong=8, noi_bat=True),
                SanPham(ten_san_pham="Kệ Sách Tre Đa Năng 5 Tầng", gia=850000, mo_ta="Kệ lắp ghép linh hoạt, chịu lực tốt, giúp gọn gàng không gian làm việc.", hinh_anh="https://images.unsplash.com/photo-1594620113688-66779435b62b?q=80&w=800", so_luong=30, noi_bat=False),
                SanPham(ten_san_pham="Đèn Thả Trần Mây Tre Đan", gia=450000, mo_ta="Đèn thả thủ công nghệ thuật, tạo ánh sáng ấm áp cho phòng ngủ và quán cafe.", hinh_anh="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800", so_luong=50, noi_bat=True),
                SanPham(ten_san_pham="Khay Đựng Trà Bằng Tre Khắc Chữ", gia=300000, mo_ta="Khay trà phong cách Á Đông, chi tiết sắc nét, bền bỉ với thời gian.", hinh_anh="https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=800", so_luong=100, noi_bat=False),
                SanPham(ten_san_pham="Sofa Gỗ Sồi Bọc Nỉ Sang Trọng", gia=8900000, mo_ta="Sofa gỗ sồi tự nhiên kết hợp đệm nỉ êm ái, mang lại vẻ đẹp tân cổ điển.", hinh_anh="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", so_luong=5, noi_bat=True),
            ]
            db.add_all(danh_sach_sp)
            print("Created sample products.")
            
        db.commit()
        print("--- Data initialization complete! ---")
    except Exception as e:
        db.rollback()
        print(f"Error occurred: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    tao_du_lieu_mau()
