// import "./styles/app.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/home/Header";
import Home from "./components/home/Home";
import Cart from "./components/cart/Cart";
import "../src/styles/App.scss";
import NotFound from "./components/layoutes/NotFound";
import Contact from "./components/contact/Contact";
import About from "./components/About/About";
import Shipping from "./components/shipping/Shipping";
import ConfirmOrders from "./components/oreder/ConfirmOrders";
import PaymentSuccess from "./components/pyment/PaymentSuccess";
import MyOrders from "./components/oreder/MyOrders";
import Login from "./components/login/Login";
import Profile from "./components/user/Profile";
import OrderDetails from "./components/oreder/OrderDetails";
import Dashboard from "./components/admin/DashBoard";
import Users from "./components/user/Users";
import Orders from "./components/oreder/Orders";
import MainBackground from "./components/layoutes/MainBackground";
import AfterOrderPage from "./CustomThings/AfterOrderPage.jsx";
import AfterMessagePage from "./CustomThings/AfterMessagePage.jsx";
import Loading from "./components/loader/Loading.jsx";

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const calculateLoadTime = () => {
      const perfTiming = performance.timing;
      const loadTime = perfTiming.loadEventEnd - perfTiming.navigationStart;
      const timeoutDuration = loadTime > 0 ? loadTime : 5000; // Minimum timeout of 5 seconds if loadTime is not available

      const timer = setTimeout(() => {
        setLoaded(true);
      }, timeoutDuration);

      return () => clearTimeout(timer);
    };

    if (performance && performance.timing) {
      calculateLoadTime();
    } else {
      // Fallback: Set a default timeout of 5 seconds if performance timing isn't available
      const timer = setTimeout(() => {
        setLoaded(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="app">
      <Router>
        {!loaded && <Loading />}
        {/* Show the content once loaded */}
        {loaded && (
          <>
            <Header isAuthenticated={true} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/confirmorder" element={<ConfirmOrders />} />
              <Route path="/paymentsuccess" element={<PaymentSuccess />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/me" element={<Profile />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/bg" element={<MainBackground />} />
              <Route path="/order" element={<AfterOrderPage />} />
              <Route path="/msg" element={<AfterMessagePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
