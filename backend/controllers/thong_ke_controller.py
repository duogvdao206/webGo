from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from configs.database import lay_db
from models.san_pham import SanPham
from models.nguoi_dung import NguoiDung
from jose import jwt
from configs.security import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/thong-ke", tags=["Thống kê"])

@router.get("/tong-quan")
def thong_ke_tong_quan(authorization: str = Header(None), db: Session = Depends(lay_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token xác thực")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        vai_tro = payload.get("vai_tro")
        if vai_tro != "admin":
            raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền xem thống kê")
    except Exception:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    tong_san_pham = db.query(SanPham).count()
    tong_nguoi_dung = db.query(NguoiDung).count()
    
    # Giả định đơn hàng và doanh thu là 0 nếu chưa có bảng
    return {
        "tong_san_pham": tong_san_pham,
        "tong_nguoi_dung": tong_nguoi_dung,
        "tong_don_hang": 0,
        "tong_doanh_thu": 0
    }
