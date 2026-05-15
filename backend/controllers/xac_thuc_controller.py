from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from configs.database import lay_db
from schemas.api_schemas import DangKyNguoiDung, DangNhapNguoiDung, Token
from services import xac_thuc_service

router = APIRouter(prefix="/api/auth", tags=["Xác thực"])

@router.post("/dang-ky")
def dang_ky(thong_tin: DangKyNguoiDung, db: Session = Depends(lay_db)):
    nguoi_dung = xac_thuc_service.xu_ly_dang_ky(db, thong_tin)
    return {"thong_bao": "Đăng ký thành công", "id": nguoi_dung.id}

@router.post("/dang-nhap", response_model=Token)
def dang_nhap(thong_tin: DangNhapNguoiDung, db: Session = Depends(lay_db)):
    return xac_thuc_service.xu_ly_dang_nhap(db, thong_tin)
