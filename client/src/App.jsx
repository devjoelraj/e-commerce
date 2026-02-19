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
import OrdersPage from "./screens/adminScreen/adminDashboard/ordersPage";
import AllProducts from "./screens/adminScreen/adminDashboard/allProducts";
import DashboardSilders from "./screens/adminScreen/adminDashboard/addProduct/dashboardSilders/DashboardSilders";
import OfferProducts from "./screens/adminScreen/adminDashboard/addProduct/offerProducts/OfferProducts";
import UploadPants from "./screens/adminScreen/adminDashboard/addProduct/UploadProduct/products/pants/UploadPants";
import UploadAccessiors from "./screens/adminScreen/adminDashboard/addProduct/UploadProduct/products/accessiors/UploadAccessiors";
import FootWears from "./screens/adminScreen/adminDashboard/addProduct/UploadProduct/products/footwears/UploadFootwears";
import UploadShirts from "./screens/adminScreen/adminDashboard/addProduct/UploadProduct/products/shirts/UploadShirts";
import UploadProducts from "./screens/adminScreen/adminDashboard/addProduct/UploadProduct/products/Products";

const Login = lazy(() => import("./screens/authScreens/login/Login"));
const Otp = lazy(() => import("./screens/authScreens/otp/Otp"));
const ForgetPassword = lazy(
  () =>
    import("./screens/authScreens/passwordScreens/forgetPasswords/ForgetPasswords"),
);
const CreatePassword = lazy(
  () => import("./screens/authScreens/passwordScreens/CreatePassword"),
);

const AdminDashboard = lazy(
  () => import("./screens/adminScreen/adminDashboard/AdminDashboard"),
);
const UserDashboard = lazy(
  () => import("./screens/userScreens/userDashBoard/UserDashBoard"),
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
            <Route path="DashboardSilders" element={<DashboardSilders />} />
            <Route path="add-offer-product" element={<OfferProducts />} />
            <Route path="sel-upload-products" element={<UploadProducts />} />

            <Route path="upload-product-shirts" element={<UploadShirts />} />
            <Route path="upload-product-pants" element={<UploadPants />} />
            <Route
              path="upload-product-accessiors"
              element={<UploadAccessiors />}
            />
            <Route path="upload-product-footWears" element={<FootWears />} />

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
