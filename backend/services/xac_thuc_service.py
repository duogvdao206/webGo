from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories import nguoi_dung_repository
from schemas.api_schemas import DangKyNguoiDung, DangNhapNguoiDung
from models.nguoi_dung import NguoiDung
from configs.security import bam_mat_khau, kiem_tra_mat_khau, tao_token_truy_cap

def xu_ly_dang_ky(db: Session, thong_tin: DangKyNguoiDung):
    nguoi_dung_ton_tai = nguoi_dung_repository.lay_nguoi_dung_theo_ten(db, thong_tin.ten_dang_nhap)
    if nguoi_dung_ton_tai:
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    email_ton_tai = nguoi_dung_repository.lay_nguoi_dung_theo_email(db, thong_tin.email)
    if email_ton_tai:
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")

    mat_khau_bam = bam_mat_khau(thong_tin.mat_khau)
    nguoi_dung_moi = NguoiDung(
        ten_dang_nhap=thong_tin.ten_dang_nhap,
        email=thong_tin.email,
        mat_khau_ma_hoa=mat_khau_bam
    )
    return nguoi_dung_repository.tao_moi_nguoi_dung(db, nguoi_dung_moi)

def xu_ly_dang_nhap(db: Session, thong_tin: DangNhapNguoiDung):
    nguoi_dung = nguoi_dung_repository.lay_nguoi_dung_theo_ten(db, thong_tin.ten_dang_nhap)
    if not nguoi_dung or not kiem_tra_mat_khau(thong_tin.mat_khau, nguoi_dung.mat_khau_ma_hoa):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không đúng",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = tao_token_truy_cap(du_lieu={"sub": nguoi_dung.ten_dang_nhap, "vai_tro": nguoi_dung.vai_tro})
    return {
        "token_truy_cap": token, 
        "loai_token": "bearer",
        "vai_tro": nguoi_dung.vai_tro,
        "ten_dang_nhap": nguoi_dung.ten_dang_nhap,
        "id": nguoi_dung.id
    }
