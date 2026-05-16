from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from configs.database import lay_db
from configs.deps import lay_nguoi_dung_hien_tai
from services import thong_bao_service
from models.nguoi_dung import NguoiDung

router = APIRouter(prefix="/api/thong-bao", tags=["Thông báo"])

@router.get("/")
def lay_thong_bao(db: Session = Depends(lay_db), user: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    if user.vai_tro == "admin":
        return thong_bao_service.lay_thong_bao_admin(db)
    return thong_bao_service.lay_thong_bao_nguoi_dung(db, user.id)

@router.put("/{id}/doc")
def doc_thong_bao(id: int, db: Session = Depends(lay_db), user: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    is_admin = user.vai_tro == "admin"
    thanh_cong = thong_bao_service.danh_dau_da_doc(db, id, user_id=user.id, is_admin=is_admin)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông báo")
    return {"message": "Đã đọc thông báo"}

@router.put("/doc-tat-ca")
def doc_tat_ca(db: Session = Depends(lay_db), user: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    is_admin = user.vai_tro == "admin"
    thong_bao_service.danh_dau_tat_ca_da_doc(db, user_id=user.id, is_admin=is_admin)
    return {"message": "Đã đọc tất cả thông báo"}
