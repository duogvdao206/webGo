from sqlalchemy import Column, Integer, Unicode, DateTime, Float, ForeignKey, String, UnicodeText
from sqlalchemy.orm import relationship
from configs.database import Base
from datetime import datetime

class DonHang(Base):
    __tablename__ = "don_hang"

    id = Column(Integer, primary_key=True, index=True)
    ho_ten = Column(Unicode(255), nullable=False)
    so_dien_thoai = Column(String(20), nullable=False)
    dia_chi = Column(Unicode(500), nullable=False)
    ghi_chu = Column(UnicodeText, nullable=True)
    tong_tien = Column(Float, nullable=False)
    trang_thai = Column(Unicode(50), default="Chờ xác nhận") # Chờ xác nhận, Đã xác nhận, Đang giao, Đã giao, Đã hủy
    ngay_tao = Column(DateTime, default=datetime.utcnow)

    chi_tiet = relationship("ChiTietDonHang", back_populates="don_hang")

class ChiTietDonHang(Base):
    __tablename__ = "chi_tiet_don_hang"

    id = Column(Integer, primary_key=True, index=True)
    don_hang_id = Column(Integer, ForeignKey("don_hang.id"))
    san_pham_id = Column(Integer, ForeignKey("san_pham.id"))
    so_luong = Column(Integer, nullable=False)
    gia_don_vi = Column(Float, nullable=False)

    don_hang = relationship("DonHang", back_populates="chi_tiet")
    san_pham = relationship("SanPham")
