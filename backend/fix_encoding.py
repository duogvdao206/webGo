from sqlalchemy import text
from configs.database import engine

def fix_db_encoding():
    with engine.connect() as conn:
        print("Starting conversion with index handling...")
        try:
            # Table san_pham
            print("Processing san_pham...")
            try: conn.execute(text("DROP INDEX ix_san_pham_ten_san_pham ON san_pham"))
            except: pass
            
            conn.execute(text("ALTER TABLE san_pham ALTER COLUMN ten_san_pham NVARCHAR(255) NOT NULL"))
            conn.execute(text("ALTER TABLE san_pham ALTER COLUMN mo_ta NVARCHAR(MAX) NULL"))
            
            conn.execute(text("CREATE INDEX ix_san_pham_ten_san_pham ON san_pham (ten_san_pham)"))

            # Table nguoi_dung
            print("Processing nguoi_dung...")
            try: conn.execute(text("DROP INDEX ix_nguoi_dung_ten_dang_nhap ON nguoi_dung"))
            except: pass
            try: conn.execute(text("DROP INDEX ix_nguoi_dung_email ON nguoi_dung"))
            except: pass
            
            conn.execute(text("ALTER TABLE nguoi_dung ALTER COLUMN ten_dang_nhap NVARCHAR(50) NOT NULL"))
            conn.execute(text("ALTER TABLE nguoi_dung ALTER COLUMN email NVARCHAR(100) NOT NULL"))
            
            conn.execute(text("CREATE INDEX ix_nguoi_dung_ten_dang_nhap ON nguoi_dung (ten_dang_nhap)"))
            conn.execute(text("CREATE INDEX ix_nguoi_dung_email ON nguoi_dung (email)"))
            
            conn.commit()
            print("Successfully converted all columns to NVARCHAR!")
        except Exception as e:
            print(f"Error: {e}")
            conn.rollback()

if __name__ == "__main__":
    fix_db_encoding()
