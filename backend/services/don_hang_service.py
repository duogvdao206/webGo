from sqlalchemy.orm import Session
from models.don_hang import DonHang, ChiTietDonHang
from models.san_pham import SanPham
from schemas.api_schemas import TaoDonHang
from fastapi import HTTPException

def tao_don_hang_moi(db: Session, don_hang_data: TaoDonHang):
    # 1. Kiểm tra tồn kho trước khi tạo đơn hàng
    san_pham_ids = [item.san_pham_id for item in don_hang_data.chi_tiet]
    db_san_phams = db.query(SanPham).filter(SanPham.id.in_(san_pham_ids)).all()
    sp_dict = {sp.id: sp for sp in db_san_phams}

    for item in don_hang_data.chi_tiet:
        if item.san_pham_id not in sp_dict:
            raise HTTPException(status_code=404, detail=f"Sản phẩm ID {item.san_pham_id} không tồn tại")
        
        sp = sp_dict[item.san_pham_id]
        if sp.so_luong < item.so_luong:
            raise HTTPException(status_code=400, detail=f"Sản phẩm {sp.ten_san_pham} không đủ hàng (Còn {sp.so_luong})")

    # 2. Tạo đơn hàng chính
    don_hang = DonHang(
        ho_ten=don_hang_data.ho_ten,
        so_dien_thoai=don_hang_data.so_dien_thoai,
        dia_chi=don_hang_data.dia_chi,
        ghi_chu=don_hang_data.ghi_chu,
        tong_tien=don_hang_data.tong_tien,
        trang_thai="Chờ xác nhận"
    )
    db.add(don_hang)
    db.flush() # Để lấy ID đơn hàng mà chưa commit
    
    # 3. Tạo chi tiết đơn hàng và cập nhật tồn kho
    for item in don_hang_data.chi_tiet:
        chi_tiet = ChiTietDonHang(
            don_hang_id=don_hang.id,
            san_pham_id=item.san_pham_id,
            so_luong=item.so_luong,
            gia_don_vi=item.gia_don_vi
        )
        db.add(chi_tiet)
        
        # Giảm số lượng tồn kho
        sp = sp_dict[item.san_pham_id]
        sp.so_luong -= item.so_luong
    
    try:
        db.commit()
        db.refresh(don_hang)
        return don_hang
    except Exception as e:
        db.rollback()
        raise e

def lay_danh_sach_don_hang(db: Session):
    return db.query(DonHang).order_by(DonHang.ngay_tao.desc()).all()

def cap_nhat_trang_thai(db: Session, don_hang_id: int, trang_thai: str):
    don_hang = db.query(DonHang).filter(DonHang.id == don_hang_id).first()
    if don_hang:
        don_hang.trang_thai = trang_thai
        db.commit()
        return True
    return False
