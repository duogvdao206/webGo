from sqlalchemy.orm import Session
from models.nguoi_dung import NguoiDung

def lay_nguoi_dung_theo_ten(db: Session, ten_dang_nhap: str):
    return db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == ten_dang_nhap).first()

def lay_nguoi_dung_theo_email(db: Session, email: str):
    return db.query(NguoiDung).filter(NguoiDung.email == email).first()

def tao_moi_nguoi_dung(db: Session, thong_tin: NguoiDung):
    db.add(thong_tin)
    db.commit()
    db.refresh(thong_tin)
    return thong_tin
