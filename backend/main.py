from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from controllers import xac_thuc_controller, san_pham_controller, thong_ke_controller, upload_controller, cau_hinh_controller, don_hang_controller
from configs.database import engine, Base
from models import san_pham, nguoi_dung, cau_hinh, don_hang

# Đảm bảo thư mục static/uploads tồn tại
import os
if not os.path.exists("static/uploads"):
    os.makedirs("static/uploads")

# Tạo các bảng trong DB (chỉ dùng cho dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Web Gỗ Tre API")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả để tránh lỗi CORS khi dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phục vụ file tĩnh (ảnh upload)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Đăng ký các router
app.include_router(xac_thuc_controller.router)
app.include_router(san_pham_controller.router)
app.include_router(thong_ke_controller.router)
app.include_router(upload_controller.router)
app.include_router(cau_hinh_controller.router)
app.include_router(don_hang_controller.router)

@app.get("/")
def trang_chu():
    return {"thong_bao": "Chào mừng đến với API Web Bán Đồ Tre Gỗ"}

from sqlalchemy import text
@app.on_event("startup")
def khoi_tao_du_lieu():
    from configs.database import SessionLocal
    from models.nguoi_dung import NguoiDung
    from configs.security import bam_mat_khau
    db = SessionLocal()
    try:
        # 1. Khởi tạo admin nếu chưa có
        admin = db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == "admin").first()
        if not admin:
            admin_moi = NguoiDung(
                ten_dang_nhap="admin",
                email="admin@trego.vn",
                mat_khau_ma_hoa=bam_mat_khau("admin123"),
                vai_tro="admin"
            )
            db.add(admin_moi)
            db.commit()
            print("Đã tạo tài khoản admin mặc định.")
        elif admin.vai_tro != "admin":
            admin.vai_tro = "admin"
            db.commit()
            
        # 2. Bạn có thể thêm các logic khởi tạo khác ở đây
        
    except Exception as e:
        print(f"Lỗi khởi tạo: {e}")
        db.rollback()
    finally:
        db.close()
