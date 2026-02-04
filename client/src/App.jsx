import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProductDetails from "./components/productDetails/ProductDetails";
import ProductLists from "./components/productLists/ProductLists";
import WatchList from "./screens/userScreens/WatchList/WatchList";
import AddToCart from "./screens/userScreens/addToCart/AddToCart";
import Profile from "./screens/userScreens/profile/Profile";
import AdminDashBoardHome from "./screens/adminScreen/adminDashboard/AdminDashboard";
import AdminLayout from "./screens/adminScreen/layout";
import AddProduct from "./screens/adminScreen/adminDashboard/addProduct/AddProduct";
import UploadProductDetails from "./screens/adminScreen/adminDashboard/addProduct/UploadProduct/index";
import OrdersPage from "./screens/adminScreen/adminDashboard/ordersPage";
import AllProducts from "./screens/adminScreen/adminDashboard/allProducts";

const Login = lazy(() => import("./screens/authScreens/login/Login"));
const Otp = lazy(() => import("./screens/authScreens/otp/Otp"));
const ForgetPassword = lazy(() =>
  import(
    "./screens/authScreens/passwordScreens/forgetPasswords/ForgetPasswords"
  )
);
const CreatePassword = lazy(() =>
  import("./screens/authScreens/passwordScreens/CreatePassword")
);

const AdminDashboard = lazy(() =>
  import("./screens/adminScreen/adminDashboard/AdminDashboard")
);
const UserDashboard = lazy(() =>
  import("./screens/userScreens/userDashBoard/UserDashBoard")
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashBoardHome />} />
            <Route path="admin-dashboard" element={<AdminDashBoardHome />} />
            <Route path="admin-AddProduct" element={<AddProduct />} />
            <Route
              path="upload-product-details"
              element={<UploadProductDetails />}
            />
            <Route path="ordersPage-details" element={<OrdersPage />} />
            <Route path="AllProducts-details" element={<AllProducts />} />
          </Route>

          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/ProductDetails" element={<ProductDetails />} />
          <Route path="/ProductLists" element={<ProductLists />} />
          <Route path="/WatchList" element={<WatchList />} />
          <Route path="/AddToCart" element={<AddToCart />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
