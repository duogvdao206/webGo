from sqlalchemy.orm import Session
from models.san_pham import SanPham

def lay_danh_sach(db: Session, bo_qua: int = 0, gioi_han: int = 100):
    return db.query(SanPham).all()

def lay_theo_id(db: Session, sp_id: int):
    return db.query(SanPham).filter(SanPham.id == sp_id).first()

def lay_san_pham_trang_chu(db: Session):
    # Ưu tiên sản phẩm nổi bật trước, sau đó là mới nhất
    return db.query(SanPham).order_by(SanPham.noi_bat.desc(), SanPham.id.desc()).limit(8).all()

def cap_nhat(db: Session, sp_id: int, san_pham_data: dict):
    result = db.query(SanPham).filter(SanPham.id == sp_id).update(san_pham_data)
    db.commit()
    return result > 0

def xoa(db: Session, sp_id: int):
    sp = db.query(SanPham).filter(SanPham.id == sp_id).first()
    if sp:
        db.delete(sp)
        db.commit()
        return True
    return False
