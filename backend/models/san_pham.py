from sqlalchemy import Column, Integer, Unicode, Float, UnicodeText, String, Boolean
from configs.database import Base

class SanPham(Base):
    __tablename__ = "san_pham"

    id = Column(Integer, primary_key=True, index=True)
    ten_san_pham = Column(Unicode(255), index=True, nullable=False)
    gia = Column(Float, nullable=False)
    mo_ta = Column(UnicodeText, nullable=True)
    hinh_anh = Column(String(500), nullable=True)
    so_luong = Column(Integer, default=0)
    noi_bat = Column(Boolean, default=False)
