from pydantic import BaseModel
from typing import Optional, List

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
    noi_bat: Optional[bool] = False

class ThongTinSanPham(BaseModel):
    id: int
    ten_san_pham: str
    gia: float
    mo_ta: Optional[str] = None
    hinh_anh: Optional[str] = None
    so_luong: int
    noi_bat: bool

    class Config:
        from_attributes = True

class ChiTietDonHangBase(BaseModel):
    san_pham_id: int
    so_luong: int
    gia_don_vi: float

class TaoDonHang(BaseModel):
    ho_ten: str
    so_dien_thoai: str
    dia_chi: str
    ghi_chu: Optional[str] = None
    tong_tien: float
    chi_tiet: List[ChiTietDonHangBase]
