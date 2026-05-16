from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from configs.database import lay_db
from services import san_pham_service
from schemas.api_schemas import TaoSanPham
from configs.deps import xac_thuc_admin

router = APIRouter(prefix="/api/san-pham", tags=["Sản phẩm"])

@router.get("/")
def danh_sach_san_pham(db: Session = Depends(lay_db)):
    return san_pham_service.lay_tat_ca_san_pham(db)

@router.get("/trang-chu")
def danh_sach_san_pham_trang_chu(db: Session = Depends(lay_db)):
    return san_pham_service.lay_san_pham_goi_y_trang_chu(db)

@router.post("/")
def tao_san_pham(san_pham: TaoSanPham, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    return san_pham_service.them_san_pham_moi(db, san_pham)

@router.put("/{sp_id}")
def cap_nhat_san_pham(sp_id: int, san_pham: TaoSanPham, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    thanh_cong = san_pham_service.cap_nhat_san_pham(db, sp_id, san_pham)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return {"message": "Cập nhật sản phẩm thành công"}

@router.delete("/{sp_id}")
def xoa_san_pham(sp_id: int, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    thanh_cong = san_pham_service.xoa_san_pham(db, sp_id)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return {"message": "Xóa sản phẩm thành công"}
