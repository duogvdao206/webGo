import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const GioHangContext = createContext();

export const GioHangProvider = ({ children }) => {
  const [gio_hang, set_gio_hang] = useState(() => {
    const saved = localStorage.getItem('gio_hang');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gio_hang', JSON.stringify(gio_hang));
  }, [gio_hang]);

  const them_vao_gio = (san_pham) => {
    let message = "";
    let type = "success";
    
    set_gio_hang(prev => {
      const ton_tai = prev.find(item => item.id === san_pham.id);
      if (ton_tai) {
        message = `Tăng số lượng ${san_pham.ten_san_pham}`;
        type = "info";
        return prev.map(item => 
          item.id === san_pham.id ? { ...item, so_luong_mua: item.so_luong_mua + 1 } : item
        );
      }
      message = `Đã thêm ${san_pham.ten_san_pham} vào giỏ`;
      type = "success";
      return [...prev, { ...san_pham, so_luong_mua: 1 }];
    });

    // Gọi toast bên ngoài set_gio_hang
    if (type === "info") toast.info(message);
    else toast.success(message);
  };

  const xoa_khoi_gio = (id) => {
    set_gio_hang(prev => prev.filter(item => item.id !== id));
    toast.warn('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const cap_nhat_so_luong = (id, delta) => {
    set_gio_hang(prev => prev.map(item => {
      if (item.id === id) {
        const moi = item.so_luong_mua + delta;
        return { ...item, so_luong_mua: moi > 0 ? moi : 1 };
      }
      return item;
    }));
  };

  const lam_trong_gio = () => {
    set_gio_hang([]);
  };

  const tong_tien = gio_hang.reduce((sum, item) => sum + (item.gia * item.so_luong_mua), 0);
  const tong_so_luong = gio_hang.reduce((sum, item) => sum + item.so_luong_mua, 0);

  return (
    <GioHangContext.Provider value={{ 
      gio_hang, them_vao_gio, xoa_khoi_gio, cap_nhat_so_luong, lam_trong_gio, tong_tien, tong_so_luong 
    }}>
      {children}
    </GioHangContext.Provider>
  );
};

export const useGioHang = () => useContext(GioHangContext);
