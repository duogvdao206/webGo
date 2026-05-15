from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "chuoi_bi_mat_mac_dinh")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

import bcrypt
if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = bcrypt.__version__
    bcrypt.__about__ = About

import bcrypt

def bam_mat_khau(mat_khau: str) -> str:
    # Hash trực tiếp bằng bcrypt để tránh lỗi passlib
    salt = bcrypt.gensalt()
    mat_khau_bam = bcrypt.hashpw(mat_khau.encode('utf-8'), salt)
    return mat_khau_bam.decode('utf-8')

def kiem_tra_mat_khau(mat_khau_chua_bam: str, mat_khau_da_bam: str) -> bool:
    try:
        return bcrypt.checkpw(mat_khau_chua_bam.encode('utf-8'), mat_khau_da_bam.encode('utf-8'))
    except:
        return False

def tao_token_truy_cap(du_lieu: dict):
    du_lieu_sao_chep = du_lieu.copy()
    thoi_gian_het_han = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    du_lieu_sao_chep.update({"exp": thoi_gian_het_han})
    token_ma_hoa = jwt.encode(du_lieu_sao_chep, SECRET_KEY, algorithm=ALGORITHM)
    return token_ma_hoa
