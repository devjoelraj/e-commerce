import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProductDetails from "./components/productDetails/ProductDetails";
import ProductLists from "./components/productLists/ProductLists";
import WatchList from "./screens/userScreens/WatchList/WatchList";
import AddToCart from "./screens/userScreens/addToCart/AddToCart";
import Profile from "./screens/userScreens/profile/Profile";
import AdminDashBoardHome from "./screens/adminScreen/adminDashboard/AdminDashboard";
import AdminLayout from "./screens/adminScreen/layout";
import AddProduct from "./screens/adminScreen/addProduct/AddProduct";
import OrdersPage from "./screens/adminScreen/ordersPage";
import DashboardSilders from "./screens/adminScreen/addProduct/dashboardSilders/DashboardSilders";
import OfferProducts from "./screens/adminScreen/addProduct/offerProducts/OfferProducts";
import UploadPants from "./screens/adminScreen/addProduct/UploadProduct/products/pants/UploadPants";
import UploadAccessiors from "./screens/adminScreen/addProduct/UploadProduct/products/accessiors/UploadAccessiors";
import FootWears from "./screens/adminScreen/addProduct/UploadProduct/products/footwears/UploadFootwears";
import UploadShirts from "./screens/adminScreen/addProduct/UploadProduct/products/shirts/UploadShirts";
import UploadProducts from "./screens/adminScreen/addProduct/UploadProduct/products/Products";
import AllProducts from "./screens/adminScreen/allProducts";
import Login from "./screens/authScreens/login";
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import ProtectedAdminRoute from "./routes/ProtectAdminRoute";
import { AuthProvider } from "./context/AuthContext";

// Lazy-loaded components
const UserDashboard = lazy(
  () => import("./screens/userScreens/userDashBoard/UserDashBoard"),
);
import myIcon from "./assets/loader.svg";
import ReduceStock from "./screens/salePageScreen/SalePage";
import ImportantLink from "./screens/userScreens/importantLinks";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <img src={myIcon} alt="description" className="my-icon" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<UserDashboard />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/product/pants/:id" element={<ProductDetails />} />
            <Route path="/product/shirts/:id" element={<ProductDetails />} />
            <Route path="/product/footwear/:id" element={<ProductDetails />} />
            <Route
              path="/product/accessories/:id"
              element={<ProductDetails />}
            /> */}
            <Route path="/important/:type" element={<ImportantLink />} />

            <Route path="/product/:category/:id" element={<ProductDetails />} />
            <Route path="/ProductLists" element={<ProductLists />} />

            {/* Protected User Routes */}
            <Route
              path="/WatchList"
              element={
                <ProtectedUserRoute>
                  <WatchList />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/AddToCart"
              element={
                <ProtectedUserRoute>
                  <AddToCart />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/Profile"
              element={
                <ProtectedUserRoute>
                  <Profile />
                </ProtectedUserRoute>
              }
            />
            <Route path="reduce-stock" element={<ReduceStock />} />
            {/* Protected Admin Routes (using layout) */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
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
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
