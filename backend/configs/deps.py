from fastapi import Header, HTTPException, Depends
from jose import jwt
from configs.security import SECRET_KEY, ALGORITHM
from sqlalchemy.orm import Session
from configs.database import lay_db
from models.nguoi_dung import NguoiDung

def lay_nguoi_dung_hien_tai(authorization: str = Header(None), db: Session = Depends(lay_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token xác thực")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        ten_dang_nhap = payload.get("sub")
        if ten_dang_nhap is None:
            raise HTTPException(status_code=401, detail="Token không hợp lệ")
        
        nguoi_dung = db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == ten_dang_nhap).first()
        if nguoi_dung is None:
            raise HTTPException(status_code=401, detail="Người dùng không tồn tại")
        return nguoi_dung
    except Exception:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

def xac_thuc_admin(nguoi_dung: NguoiDung = Depends(lay_nguoi_dung_hien_tai)):
    if nguoi_dung.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền thực hiện hành động này")
    return nguoi_dung
