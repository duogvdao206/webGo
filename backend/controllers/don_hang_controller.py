from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from configs.database import lay_db
from services import don_hang_service
from schemas.api_schemas import TaoDonHang
from configs.deps import xac_thuc_admin

router = APIRouter(prefix="/api/don-hang", tags=["Đơn hàng"])

@router.post("/")
def tao_don_hang(don_hang: TaoDonHang, db: Session = Depends(lay_db)):
    try:
        return don_hang_service.tao_don_hang_moi(db, don_hang)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi khi tạo đơn hàng: {str(e)}")

@router.get("/")
def danh_sach_don_hang(db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    return don_hang_service.lay_danh_sach_don_hang(db)

@router.put("/{dh_id}/trang-thai")
def cap_nhat_trang_thai(dh_id: int, trang_thai: str, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    thanh_cong = don_hang_service.cap_nhat_trang_thai(db, dh_id, trang_thai)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    return {"message": "Cập nhật trạng thái thành công"}
