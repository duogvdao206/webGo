from sqlalchemy.orm import Session
from models.thong_bao import ThongBao
from fastapi import HTTPException

def lay_thong_bao_nguoi_dung(db: Session, user_id: int):
    return db.query(ThongBao).filter(ThongBao.nguoi_dung_id == user_id).order_by(ThongBao.ngay_tao.desc()).all()

def lay_thong_bao_admin(db: Session):
    return db.query(ThongBao).filter(ThongBao.nguoi_dung_id == None).order_by(ThongBao.ngay_tao.desc()).all()

def danh_dau_da_doc(db: Session, thong_bao_id: int, user_id: int = None, is_admin: bool = False):
    query = db.query(ThongBao).filter(ThongBao.id == thong_bao_id)
    if not is_admin:
        query = query.filter(ThongBao.nguoi_dung_id == user_id)
    
    thong_bao = query.first()
    if thong_bao:
        thong_bao.da_doc = True
        db.commit()
        return True
    return False

def danh_dau_tat_ca_da_doc(db: Session, user_id: int = None, is_admin: bool = False):
    query = db.query(ThongBao)
    if is_admin:
        query = query.filter(ThongBao.nguoi_dung_id == None)
    else:
        query = query.filter(ThongBao.nguoi_dung_id == user_id)
        
    query.update({"da_doc": True})
    db.commit()
    return True
