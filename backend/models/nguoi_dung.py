from sqlalchemy import Column, Integer, Unicode, DateTime, String
from configs.database import Base
from datetime import datetime

class NguoiDung(Base):
    __tablename__ = "nguoi_dung"

    id = Column(Integer, primary_key=True, index=True)
    ten_dang_nhap = Column(Unicode(50), unique=True, index=True, nullable=False)
    mat_khau_ma_hoa = Column(String(255), nullable=False) # Mật khẩu không cần unicode
    email = Column(Unicode(100), unique=True, index=True, nullable=False)
    vai_tro = Column(String(20), default="nguoi_dung")
    ngay_tao = Column(DateTime, default=datetime.utcnow)
