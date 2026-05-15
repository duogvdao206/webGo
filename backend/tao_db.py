from sqlalchemy import create_engine, text

engine = create_engine('mssql+pyodbc://sa:Duong2006%40@LAPTOP\\SQLEXPRESS/master?driver=ODBC+Driver+17+for+SQL+Server', isolation_level="AUTOCOMMIT")

try:
    with engine.connect() as conn:
        # Kiểm tra xem DB đã tồn tại chưa, nếu chưa thì tạo
        db_exists = conn.execute(text("SELECT name FROM sys.databases WHERE name = 'WebGoDB'")).fetchone()
        if not db_exists:
            conn.execute(text("CREATE DATABASE WebGoDB"))
            print("Đã tạo Database WebGoDB thành công!")
        else:
            print("Database WebGoDB đã tồn tại!")
except Exception as e:
    print(f"Lỗi: {e}")
