from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Sử dụng SQL Server (pyodbc) hoặc fallback qua SQLite để dễ test
CHUOI_KET_NOI_DB = os.getenv("DATABASE_URL", "sqlite:///./du_lieu_tam.db")

# connect_args={"check_same_thread": False} chỉ dùng cho sqlite
connect_args = {"check_same_thread": False} if "sqlite" in CHUOI_KET_NOI_DB else {}

engine = create_engine(CHUOI_KET_NOI_DB, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def lay_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
