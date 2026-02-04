import { Outlet } from "react-router-dom";
import AdminHeader from "../../../components/header/admin/adminHeader/AdminHeader";
import Sidebar from "../../../components/header/admin/sidebar/Sidebar";
import "./Adminlayout.css";
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
