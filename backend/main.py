from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Trigger reload again
from controllers import xac_thuc_controller, san_pham_controller, thong_ke_controller
from configs.database import engine, Base

# Tạo các bảng trong DB (chỉ dùng cho dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Web Gỗ", description="Backend cho dự án web bán đồ tre gỗ")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router
app.include_router(xac_thuc_controller.router)
app.include_router(san_pham_controller.router)
app.include_router(thong_ke_controller.router)

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
        try:
            db.execute(text("ALTER TABLE nguoi_dung ADD vai_tro VARCHAR(20) DEFAULT 'nguoi_dung'"))
            db.commit()
        except:
            db.rollback() 
            
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
        elif admin.vai_tro != "admin":
            admin.vai_tro = "admin"
            db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()
