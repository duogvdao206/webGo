from sqlalchemy.orm import Session, joinedload
from models.don_hang import DonHang, ChiTietDonHang
from models.san_pham import SanPham
from models.thong_bao import ThongBao
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
        nguoi_dung_id=don_hang_data.nguoi_dung_id,
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
        
        # Thêm thông báo cho người dùng
        if don_hang.nguoi_dung_id:
            thong_bao_user = ThongBao(
                nguoi_dung_id=don_hang.nguoi_dung_id,
                noi_dung=f"Bạn đã đặt đơn hàng mới #{don_hang.id} thành công!",
                loai="order"
            )
            db.add(thong_bao_user)
        
        # Thêm thông báo cho admin
        thong_bao_admin = ThongBao(
            nguoi_dung_id=None,
            noi_dung=f"Có đơn hàng mới #{don_hang.id} từ khách hàng {don_hang.ho_ten}",
            loai="order"
        )
        db.add(thong_bao_admin)
        db.commit()

        return don_hang
    except Exception as e:
        db.rollback()
        raise e

def lay_chi_tiet_don_hang(db: Session, dh_id: int):
    return db.query(DonHang).filter(DonHang.id == dh_id).options(joinedload(DonHang.chi_tiet).joinedload(ChiTietDonHang.san_pham)).first()

def lay_danh_sach_don_hang(db: Session):
    return db.query(DonHang).options(joinedload(DonHang.chi_tiet).joinedload(ChiTietDonHang.san_pham)).order_by(DonHang.ngay_tao.desc()).all()

def lay_don_hang_theo_user(db: Session, user_id: int):
    return db.query(DonHang).filter(DonHang.nguoi_dung_id == user_id).options(joinedload(DonHang.chi_tiet).joinedload(ChiTietDonHang.san_pham)).order_by(DonHang.ngay_tao.desc()).all()

def cap_nhat_trang_thai(db: Session, don_hang_id: int, trang_thai: str):
    don_hang = db.query(DonHang).filter(DonHang.id == don_hang_id).first()
    if don_hang:
        old_status = don_hang.trang_thai
        don_hang.trang_thai = trang_thai
        
        # Thông báo cho người dùng khi trạng thái thay đổi
        if don_hang.nguoi_dung_id and old_status != trang_thai:
            noi_dung = f"Đơn hàng #{don_hang.id} của bạn đã chuyển sang trạng thái: {trang_thai}"
            thong_bao = ThongBao(nguoi_dung_id=don_hang.nguoi_dung_id, noi_dung=noi_dung, loai="status_update")
            db.add(thong_bao)
            
        db.commit()
        return True
    return False

def huy_don_hang(db: Session, don_hang_id: int, user_id: int = None, is_admin: bool = False):
    query = db.query(DonHang).filter(DonHang.id == don_hang_id)
    if not is_admin:
        query = query.filter(DonHang.nguoi_dung_id == user_id)
    
    don_hang = query.first()
    if not don_hang:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    
    if don_hang.trang_thai != "Chờ xác nhận" and not is_admin:
        raise HTTPException(status_code=400, detail="Không thể hủy đơn hàng đã được xử lý")
    
    don_hang.trang_thai = "Đã hủy"
    
    # Hoàn lại tồn kho
    for item in don_hang.chi_tiet:
        sp = db.query(SanPham).filter(SanPham.id == item.san_pham_id).first()
        if sp:
            sp.so_luong += item.so_luong
            
    # Thông báo
    if is_admin and don_hang.nguoi_dung_id:
        db.add(ThongBao(nguoi_dung_id=don_hang.nguoi_dung_id, noi_dung=f"Đơn hàng #{don_hang.id} của bạn đã bị hủy bởi quản trị viên", loai="cancel"))
    elif not is_admin:
        db.add(ThongBao(nguoi_dung_id=None, noi_dung=f"Khách hàng {don_hang.ho_ten} đã hủy đơn hàng #{don_hang.id}", loai="cancel"))

    db.commit()
    return True
