from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from configs.database import lay_db
from services import san_pham_service
from schemas.api_schemas import TaoSanPham, SanPhamResponse
from configs.deps import xac_thuc_admin
from typing import List

router = APIRouter(prefix="/api/san-pham", tags=["Sản phẩm"])

@router.get("/", response_model=List[SanPhamResponse])
def danh_sach_san_pham(db: Session = Depends(lay_db)):
    return san_pham_service.lay_tat_ca_san_pham(db)

@router.get("/trang-chu", response_model=List[SanPhamResponse])
def danh_sach_san_pham_trang_chu(db: Session = Depends(lay_db)):
    return san_pham_service.lay_san_pham_goi_y_trang_chu(db)

@router.post("/", response_model=SanPhamResponse)
def tao_san_pham(san_pham: TaoSanPham, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    try:
        return san_pham_service.them_san_pham_moi(db, san_pham)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi khi tạo sản phẩm: {str(e)}")

@router.put("/{sp_id}")
def cap_nhat_san_pham(sp_id: int, san_pham: TaoSanPham, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    try:
        thanh_cong = san_pham_service.cap_nhat_san_pham(db, sp_id, san_pham)
        if not thanh_cong:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm để cập nhật")
        return {"message": "Cập nhật sản phẩm thành công"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi khi cập nhật sản phẩm: {str(e)}")

@router.delete("/{sp_id}")
def xoa_san_pham(sp_id: int, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    try:
        thanh_cong = san_pham_service.xoa_san_pham(db, sp_id)
        if not thanh_cong:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm để xóa")
        return {"message": "Xóa sản phẩm thành công"}
    except Exception as e:
        # Kiểm tra nếu lỗi liên quan đến khóa ngoại (Foreign Key)
        if "REFERENCE constraint" in str(e) or "foreign key" in str(e).lower():
            raise HTTPException(status_code=400, detail="Không thể xóa sản phẩm này vì đã có đơn hàng liên quan.")
        raise HTTPException(status_code=400, detail=f"Lỗi khi xóa sản phẩm: {str(e)}")
