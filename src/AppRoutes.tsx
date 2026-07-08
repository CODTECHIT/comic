import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import PublicApp from "./app/App";
import { AdminLayout } from "./admin/layout/AdminLayout";
import { AdminLogin } from "./admin/pages/AdminLogin";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { ManageComics } from "./admin/pages/ManageComics";
import { AddEditComic } from "./admin/pages/AddEditComic";
import { ManageCategories } from "./admin/pages/ManageCategories";
import { ManageSubscriptions } from "./admin/pages/ManageSubscriptions";
import { ManageOrders } from "./admin/pages/ManageOrders";
import { ManageHomepage } from "./admin/pages/ManageHomepage";
import { ManageComments } from "./admin/pages/ManageComments";
import { ManageContacts } from "./admin/pages/ManageContacts";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Site */}
        <Route path="/*" element={<PublicApp />} />

        {/* Admin Site */}
        <Route path="/admin/comic/login" element={<AdminLogin />} />
        <Route path="/admin/comic" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/comic/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="comics" element={<ManageComics />} />
          <Route path="comics/new" element={<AddEditComic />} />
          <Route path="comics/:id/edit" element={<AddEditComic />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="subscriptions" element={<ManageSubscriptions />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="comments" element={<ManageComments />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="homepage" element={<ManageHomepage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
