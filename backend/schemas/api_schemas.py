from pydantic import BaseModel
from typing import Optional

class DangKyNguoiDung(BaseModel):
    ten_dang_nhap: str
    mat_khau: str
    email: str

class DangNhapNguoiDung(BaseModel):
    ten_dang_nhap: str
    mat_khau: str

class Token(BaseModel):
    token_truy_cap: str
    loai_token: str
    vai_tro: str
    ten_dang_nhap: str

class TaoSanPham(BaseModel):
    ten_san_pham: str
    gia: float
    mo_ta: Optional[str] = None
    hinh_anh: Optional[str] = None
    so_luong: int

class ThongTinSanPham(BaseModel):
    id: int
    ten_san_pham: str
    gia: float
    mo_ta: Optional[str] = None
    hinh_anh: Optional[str] = None
    so_luong: int

    class Config:
        from_attributes = True
