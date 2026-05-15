from sqlalchemy.orm import Session
from repositories import san_pham_repository
import json
import os

# Cố gắng sử dụng redis nếu có
try:
    import redis
    redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
except:
    redis_client = None

def lay_tat_ca_san_pham(db: Session):
    danh_sach = san_pham_repository.lay_danh_sach(db)
    ket_qua = []
    for sp in danh_sach:
        ket_qua.append({
            "id": sp.id,
            "ten_san_pham": sp.ten_san_pham,
            "gia": sp.gia,
            "mo_ta": sp.mo_ta,
            "hinh_anh": sp.hinh_anh,
            "so_luong": sp.so_luong,
            "noi_bat": sp.noi_bat
        })
    return ket_qua

def lay_san_pham_goi_y_trang_chu(db: Session):
    cache_key = "danh_sach_san_pham_trang_chu"
    
    # Kiểm tra cache
    if redis_client:
        try:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except:
            pass # Bỏ qua lỗi redis
            
    # Lấy từ DB
    danh_sach = san_pham_repository.lay_san_pham_trang_chu(db)
    
    # Chuyển đổi sang dict để cache
    ket_qua = []
    for sp in danh_sach:
        ket_qua.append({
            "id": sp.id,
            "ten_san_pham": sp.ten_san_pham,
            "gia": sp.gia,
            "mo_ta": sp.mo_ta,
            "hinh_anh": sp.hinh_anh,
            "so_luong": sp.so_luong,
            "noi_bat": sp.noi_bat
        })
        
    # Lưu vào cache 1 giờ (3600s)
    if redis_client:
        try:
            redis_client.setex(cache_key, 3600, json.dumps(ket_qua))
        except:
            pass
            
            
    return ket_qua

def them_san_pham_moi(db: Session, san_pham_data):
    from models.san_pham import SanPham
    san_pham = SanPham(
        ten_san_pham=san_pham_data.ten_san_pham,
        gia=san_pham_data.gia,
        mo_ta=san_pham_data.mo_ta,
        hinh_anh=san_pham_data.hinh_anh,
        so_luong=san_pham_data.so_luong,
        noi_bat=san_pham_data.noi_bat
    )
    db.add(san_pham)
    db.commit()
    db.refresh(san_pham)
    
    # Xoá cache khi có SP mới
    if redis_client:
        try:
            redis_client.delete("danh_sach_san_pham_trang_chu")
        except:
            pass
            
    return san_pham

def cap_nhat_san_pham(db: Session, sp_id: int, san_pham_data):
    du_lieu = {
        "ten_san_pham": san_pham_data.ten_san_pham,
        "gia": san_pham_data.gia,
        "mo_ta": san_pham_data.mo_ta,
        "hinh_anh": san_pham_data.hinh_anh,
        "so_luong": san_pham_data.so_luong,
        "noi_bat": san_pham_data.noi_bat
    }
    
    thanh_cong = san_pham_repository.cap_nhat(db, sp_id, du_lieu)
    
    if thanh_cong and redis_client:
        try:
            redis_client.delete("danh_sach_san_pham_trang_chu")
        except:
            pass
            
    return thanh_cong

def xoa_san_pham(db: Session, sp_id: int):
    thanh_cong = san_pham_repository.xoa(db, sp_id)
    
    if thanh_cong and redis_client:
        try:
            redis_client.delete("danh_sach_san_pham_trang_chu")
        except:
            pass
            
    return thanh_cong
