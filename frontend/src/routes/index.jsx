import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutChinh from '../layouts/LayoutChinh';
import TrangChu from '../pages/TrangChu';
import DangNhap from '../pages/DangNhap';
import DangKy from '../pages/DangKy';

import AdminDashboard from '../pages/AdminDashboard';
import SanPhamPage from '../pages/SanPham';
import GioiThieuPage from '../pages/GioiThieu';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutChinh />}>
          <Route index element={<TrangChu />} />
          <Route path="san-pham" element={<SanPhamPage />} />
          <Route path="gioi-thieu" element={<GioiThieuPage />} />
          <Route path="dang-nhap" element={<DangNhap />} />
          <Route path="dang-ky" element={<DangKy />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
