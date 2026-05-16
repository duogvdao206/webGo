from configs.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("SELECT DATABASEPROPERTYEX('WebGoDB', 'Collation')")).scalar()
    print(f"Collation: {res}")
