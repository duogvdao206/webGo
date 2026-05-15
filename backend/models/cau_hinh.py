from sqlalchemy import Column, Integer, Unicode, UnicodeText, String
from configs.database import Base

class CauHinh(Base):
    __tablename__ = "cau_hinh"

    id = Column(Integer, primary_key=True, index=True)
    khoa = Column(String(50), unique=True, index=True) # VD: 'hero_title', 'hero_subtitle'
    gia_tri = Column(UnicodeText, nullable=True)
