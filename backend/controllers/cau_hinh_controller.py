from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from configs.database import lay_db
from models.cau_hinh import CauHinh
from jose import jwt
from configs.security import SECRET_KEY, ALGORITHM
from typing import Dict

router = APIRouter(prefix="/api/cau-hinh", tags=["Cấu hình"])

@router.get("/")
def lay_tat_ca_cau_hinh(db: Session = Depends(lay_db)):
    items = db.query(CauHinh).all()
    return {item.khoa: item.gia_tri for item in items}

@router.post("/")
def cap_nhat_cau_hinh(du_lieu: Dict[str, str], authorization: str = Header(None), db: Session = Depends(lay_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token xác thực")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("vai_tro") != "admin":
            raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền chỉnh sửa")
    except:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    for khoa, gia_tri in du_lieu.items():
        item = db.query(CauHinh).filter(CauHinh.khoa == khoa).first()
        if item:
            item.gia_tri = gia_tri
        else:
            new_item = CauHinh(khoa=khoa, gia_tri=gia_tri)
            db.add(new_item)
    
    db.commit()
    return {"message": "Cập nhật thành công"}
