from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from configs.database import lay_db
from services import san_pham_service
from schemas.api_schemas import TaoSanPham

router = APIRouter(prefix="/api/san-pham", tags=["Sản phẩm"])

@router.get("/")
def danh_sach_san_pham(db: Session = Depends(lay_db)):
    return san_pham_service.lay_tat_ca_san_pham(db)

@router.get("/trang-chu")
def danh_sach_san_pham_trang_chu(db: Session = Depends(lay_db)):
    return san_pham_service.lay_san_pham_goi_y_trang_chu(db)

from fastapi import Header, HTTPException

@router.post("/")
def tao_san_pham(san_pham: TaoSanPham, authorization: str = Header(None), db: Session = Depends(lay_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token xác thực")
    
    token = authorization.split(" ")[1]
    from jose import jwt
    from configs.security import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        vai_tro = payload.get("vai_tro")
        if vai_tro != "admin":
            raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền thêm sản phẩm")
    except Exception:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    return san_pham_service.them_san_pham_moi(db, san_pham)

@router.put("/{sp_id}")
def cap_nhat_san_pham(sp_id: int, san_pham: TaoSanPham, authorization: str = Header(None), db: Session = Depends(lay_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token xác thực")
    
    token = authorization.split(" ")[1]
    from jose import jwt
    from configs.security import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        vai_tro = payload.get("vai_tro")
        if vai_tro != "admin":
            raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền sửa sản phẩm")
    except Exception:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    thanh_cong = san_pham_service.cap_nhat_san_pham(db, sp_id, san_pham)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return {"message": "Cập nhật sản phẩm thành công"}

@router.delete("/{sp_id}")
def xoa_san_pham(sp_id: int, authorization: str = Header(None), db: Session = Depends(lay_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thiếu token xác thực")
    
    token = authorization.split(" ")[1]
    from jose import jwt
    from configs.security import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        vai_tro = payload.get("vai_tro")
        if vai_tro != "admin":
            raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền xóa sản phẩm")
    except Exception:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    thanh_cong = san_pham_service.xoa_san_pham(db, sp_id)
    if not thanh_cong:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return {"message": "Xóa sản phẩm thành công"}
