from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from configs.database import lay_db
from models.cau_hinh import CauHinh
from configs.deps import xac_thuc_admin
from typing import Dict

router = APIRouter(prefix="/api/cau-hinh", tags=["Cấu hình"])

@router.get("/")
def lay_tat_ca_cau_hinh(db: Session = Depends(lay_db)):
    items = db.query(CauHinh).all()
    return {item.khoa: item.gia_tri for item in items}

@router.post("/")
def cap_nhat_cau_hinh(du_lieu: Dict[str, str], db: Session = Depends(lay_db), _ = Depends(xac_thuc_admin)):
    for khoa, gia_tri in du_lieu.items():
        item = db.query(CauHinh).filter(CauHinh.khoa == khoa).first()
        if item:
            item.gia_tri = gia_tri
        else:
            new_item = CauHinh(khoa=khoa, gia_tri=gia_tri)
            db.add(new_item)
    
    db.commit()
    return {"message": "Cập nhật thành công"}
