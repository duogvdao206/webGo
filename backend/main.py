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

from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
def trang_chu():
    return """
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tre Gỗ Việt - API Control Center</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #8B5E34;
                --secondary: #BC8F8F;
                --dark: #2D241C;
                --glass: rgba(255, 255, 255, 0.1);
            }
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
            body { 
                background: linear-gradient(135deg, #1a1612 0%, #2d241c 100%);
                color: #fff;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .bg-glow {
                position: absolute;
                width: 500px;
                height: 500px;
                background: radial-gradient(circle, rgba(139, 94, 52, 0.2) 0%, transparent 70%);
                z-index: 0;
            }
            .container {
                position: relative;
                z-index: 1;
                width: 90%;
                max-width: 1000px;
                background: var(--glass);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 32px;
                padding: 60px;
                box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                text-align: center;
            }
            h1 {
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 10px;
                background: linear-gradient(to right, #f5e6d3, #8B5E34);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p.subtitle {
                color: #a89a8e;
                font-size: 1.1rem;
                margin-bottom: 50px;
                letter-spacing: 1px;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
            }
            .card {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.05);
                padding: 32px;
                border-radius: 24px;
                text-decoration: none;
                color: #fff;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
            }
            .card:hover {
                transform: translateY(-10px);
                background: rgba(139, 94, 52, 0.2);
                border-color: rgba(139, 94, 52, 0.5);
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            .icon {
                font-size: 2.5rem;
                margin-bottom: 8px;
            }
            .card h3 { font-size: 1.3rem; font-weight: 700; }
            .card p { font-size: 0.9rem; color: #a89a8e; text-align: center; }
            .status-badge {
                position: absolute;
                top: 40px;
                right: 40px;
                background: rgba(34, 197, 94, 0.1);
                color: #4ade80;
                padding: 8px 20px;
                border-radius: 100px;
                font-size: 0.8rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                border: 1px solid rgba(34, 197, 94, 0.2);
            }
            .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
            @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
            
            @media (max-width: 600px) {
                .container { padding: 30px; }
                h1 { font-size: 2.2rem; }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="container">
            <div class="status-badge">
                <div class="dot"></div>
                API SYSTEM ONLINE
            </div>
            <h1>Tre Gỗ Việt</h1>
            <p class="subtitle">HỆ THỐNG QUẢN TRỊ BACKEND & API</p>
            
            <div class="grid">
                <a href="/docs" class="card">
                    <div class="icon">🚀</div>
                    <h3>Swagger UI</h3>
                    <p>Giao diện test API tương tác, trực quan và đầy đủ endpoint.</p>
                </a>
                <a href="/redoc" class="card">
                    <div class="icon">📖</div>
                    <h3>ReDoc</h3>
                    <p>Tài liệu API chi tiết, chuyên nghiệp cho việc tích hợp hệ thống.</p>
                </a>
                <a href="/openapi.json" class="card">
                    <div class="icon">⚙️</div>
                    <h3>JSON Schema</h3>
                    <p>Cấu trúc dữ liệu thô chuẩn OpenAPI cho các công cụ tự động.</p>
                </a>
            </div>
            
            <div style="margin-top: 50px; color: rgba(255,255,255,0.3); font-size: 0.8rem;">
                © 2026 Tre Gỗ Việt - Developed for Premium Wood E-commerce
            </div>
        </div>
    </body>
    </html>
    """

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
