import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutChinh from '../layouts/LayoutChinh';
import TrangChu from '../pages/TrangChu';
import DangNhap from '../pages/DangNhap';
import DangKy from '../pages/DangKy';

import AdminDashboard from '../pages/AdminDashboard';
import SanPhamPage from '../pages/SanPham';
import GioiThieuPage from '../pages/GioiThieu';
import GioHang from '../pages/GioHang';
import ThanhToan from '../pages/ThanhToan';
import DonHangCuaToi from '../pages/DonHangCuaToi';
import { GioHangProvider } from '../components/GioHangContext';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <GioHangProvider>
        <Routes>
          <Route path="/" element={<LayoutChinh />}>
            <Route index element={<TrangChu />} />
            <Route path="san-pham" element={<SanPhamPage />} />
            <Route path="gioi-thieu" element={<GioiThieuPage />} />
            <Route path="dang-nhap" element={<DangNhap />} />
            <Route path="dang-ky" element={<DangKy />} />
            <Route path="gio-hang" element={<GioHang />} />
            <Route path="thanh-toan" element={<ThanhToan />} />
            <Route path="don-hang" element={<DonHangCuaToi />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </GioHangProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
