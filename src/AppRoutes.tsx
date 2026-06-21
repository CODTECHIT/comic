import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import PublicApp from "./app/App";
import { AdminLayout } from "./admin/layout/AdminLayout";
import { AdminLogin } from "./admin/pages/AdminLogin";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { ManageComics } from "./admin/pages/ManageComics";
import { AddEditComic } from "./admin/pages/AddEditComic";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Site */}
        <Route path="/*" element={<PublicApp />} />

        {/* Admin Site */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="comics" element={<ManageComics />} />
          <Route path="comics/new" element={<AddEditComic />} />
          <Route path="comics/:id/edit" element={<AddEditComic />} />
          {/* Placeholders for other routes */}
          <Route path="categories" element={<div className="p-8">Manage Categories Placeholder</div>} />
          <Route path="subscriptions" element={<div className="p-8">Manage Subscriptions Placeholder</div>} />
          <Route path="orders" element={<div className="p-8">Orders & Sales Placeholder</div>} />
          <Route path="homepage" element={<div className="p-8">Homepage Manager Placeholder</div>} />
          <Route path="settings" element={<div className="p-8">Site Settings Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
