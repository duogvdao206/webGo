from configs.database import engine, Base
from models import san_pham, nguoi_dung, cau_hinh, don_hang
from seed_data import tao_du_lieu_mau

def create_tables():
    print("Creating tables in database...")
    # SQL Alchemy will automatically create tables based on imported models
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

    # Seed initial data
    print("Initializing seed data...")
    tao_du_lieu_mau()
    print("Initialization complete!")

if __name__ == "__main__":
    create_tables()
