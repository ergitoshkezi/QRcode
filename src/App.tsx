import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';
import { LandingPage } from '@/pages/LandingPage';
import { MenuPage } from '@/pages/MenuPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { OrdersPage } from '@/pages/OrdersPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { DrinkManager } from '@/pages/DrinkManager';
import { QrManager } from '@/pages/QrManager';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/q/:qrId" element={<MenuPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<OrdersPage />} />
          <Route path="drinks" element={<DrinkManager />} />
            <Route path="qr" element={<QrManager />} />
          </Route>
        </Routes>
        <ToastContainer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
