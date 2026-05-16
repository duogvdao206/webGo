from sqlalchemy import Column, Integer, Unicode, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from configs.database import Base
from datetime import datetime

class ThongBao(Base):
    __tablename__ = "thong_bao"

    id = Column(Integer, primary_key=True, index=True)
    nguoi_dung_id = Column(Integer, ForeignKey("nguoi_dung.id"), nullable=True) # NULL cho admin hoặc thông báo hệ thống
    noi_dung = Column(Unicode(500), nullable=False)
    da_doc = Column(Boolean, default=False)
    loai = Column(Unicode(50), default="info") # info, order, cancel, system
    ngay_tao = Column(DateTime, default=datetime.utcnow)

    nguoi_dung = relationship("NguoiDung")
