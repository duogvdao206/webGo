from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from configs.database import lay_db
from models.san_pham import SanPham
from models.nguoi_dung import NguoiDung
from models.don_hang import DonHang
from configs.deps import xac_thuc_admin

router = APIRouter(prefix="/api/thong-ke", tags=["Thống kê"])

@router.get("/tong-quan")
def thong_ke_tong_quan(db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    tong_san_pham = db.query(SanPham).count()
    tong_nguoi_dung = db.query(NguoiDung).count()
    tong_don_hang = db.query(DonHang).count()
    tong_doanh_thu = db.query(func.sum(DonHang.tong_tien)).filter(DonHang.trang_thai != 'Đã hủy').scalar() or 0
    
    return {
        "tong_san_pham": tong_san_pham,
        "tong_nguoi_dung": tong_nguoi_dung,
        "tong_don_hang": tong_don_hang,
        "tong_doanh_thu": tong_doanh_thu
    }
