import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import PolaroidEditor from './pages/PolaroidEditor';
import CollageBuilder from './pages/CollageBuilder';
import TrackOrder from './pages/TrackOrder';
import Admin from './pages/Admin';
import Login   from './pages/Login';
import Account from './pages/Account';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/shop"       element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart"       element={<Cart />} />
          <Route path="/checkout"   element={<Checkout />} />
          <Route path="/success"    element={<OrderSuccess />} />
          <Route path="/editor"     element={<PolaroidEditor />} />
          <Route path="/collage"    element={<CollageBuilder />} />
          <Route path="/track"      element={<TrackOrder />} />
          <Route path="/admin"      element={<Admin />} />
          <Route path="/login"   element={<Login />} />
<Route path="/account" element={<Account />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}