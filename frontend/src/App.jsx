import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import MarketingLayout from './components/marketing/MarketingLayout';
import AppLayout from './components/layout/AppLayout';
import InventoryHistory from "./pages/InventoryHistory";
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import BarcodeScanner from './pages/BarcodeScanner';
import Analytics from './pages/Analytics';
import POSBilling from './pages/POSBilling';


const Home = lazy(() => import('./pages/marketing/Home'));
const About = lazy(() => import('./pages/marketing/About'));
const Features = lazy(() => import('./pages/marketing/Features'));
const Pricing = lazy(() => import('./pages/marketing/Pricing'));
const Contact = lazy(() => import('./pages/marketing/Contact'));
const FAQ = lazy(() => import('./pages/marketing/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Payments = lazy(() => import('./pages/Payments'));



const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <p className="text-sm text-slate-500">Loading...</p>
  </div>
);

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-900 dark:text-white border dark:border-slate-800' }} />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MarketingLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="features" element={<Features />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
              </Route>

              <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
              <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<ProtectedRoute page="dashboard"><Dashboard /></ProtectedRoute>} />
                <Route path="products" element={<ProtectedRoute page="products"><Products /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute page="orders"><Orders /></ProtectedRoute>} />
                <Route path="invoices" element={<ProtectedRoute page="invoices"><Invoices /></ProtectedRoute>} />
                <Route path="payments" element={<ProtectedRoute page="payments"><Payments /></ProtectedRoute>} />
                <Route path="analytics" element={<ProtectedRoute page="analytics"><Analytics /></ProtectedRoute>} />
                <Route path="inventory-history" element={<ProtectedRoute page="inventory-history"><InventoryHistory /></ProtectedRoute>} />
                <Route path="suppliers" element={<ProtectedRoute page="suppliers"><Suppliers /></ProtectedRoute>} />
                <Route path="purchase-orders" element={<ProtectedRoute page="purchase-orders"><PurchaseOrders /></ProtectedRoute>} />
                <Route path="barcodes" element={<ProtectedRoute page="barcodes"><BarcodeScanner /></ProtectedRoute>} />
                <Route path="pos" element={<POSBilling />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
