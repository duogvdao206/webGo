from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from configs.database import lay_db
from services import don_hang_service
from schemas.api_schemas import TaoDonHang
from configs.deps import xac_thuc_admin, lay_nguoi_dung_hien_tai
from models.nguoi_dung import NguoiDung

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

@router.get("/me")
def don_hang_cua_tooi(db: Session = Depends(lay_db), user: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    return don_hang_service.lay_don_hang_theo_user(db, user.id)

@router.get("/{dh_id}")
def chi_tiet_don_hang(dh_id: int, db: Session = Depends(lay_db), user: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    don_hang = don_hang_service.lay_chi_tiet_don_hang(db, dh_id)
    if not don_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    # Kiểm tra quyền: chỉ chủ đơn hàng hoặc admin mới được xem
    if don_hang.nguoi_dung_id != user.id and user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem đơn hàng này")
    return don_hang

@router.put("/{dh_id}/trang-thai")
def cap_nhat_trang_thai(dh_id: int, trang_thai: str, db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    thanh_cong = don_hang_service.cap_nhat_trang_thai(db, dh_id, trang_thai)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    return {"message": "Cập nhật trạng thái thành công"}

@router.put("/{dh_id}/huy")
def huy_don_hang(dh_id: int, db: Session = Depends(lay_db), user: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    try:
        is_admin = user.vai_tro == "admin"
        don_hang_service.huy_don_hang(db, dh_id, user_id=user.id, is_admin=is_admin)
        return {"message": "Hủy đơn hàng thành công"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))
