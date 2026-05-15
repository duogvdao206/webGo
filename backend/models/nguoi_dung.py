from sqlalchemy import Column, Integer, String, DateTime
from configs.database import Base
from datetime import datetime

class NguoiDung(Base):
    __tablename__ = "nguoi_dung"

    id = Column(Integer, primary_key=True, index=True)
    ten_dang_nhap = Column(String(50), unique=True, index=True, nullable=False)
    mat_khau_ma_hoa = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    vai_tro = Column(String(20), default="nguoi_dung")
    ngay_tao = Column(DateTime, default=datetime.utcnow)
