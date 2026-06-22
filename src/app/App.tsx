import React, { useEffect } from "react";
import { Routes, Route } from "react-router";
import { AppProvider, useAppContext } from "../context/AppContext";
import { API_URL } from "../config/api";
import { NavBar } from "../components/layout/NavBar";
import { CartDrawer } from "../components/layout/CartDrawer";
import { LoginPage } from "../pages/LoginPage";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { fetchApi } from "../lib/apiClient";

import { HomePage } from "../pages/HomePage";
import { BrowsePage } from "../pages/BrowsePage";
import { ComicDetailPage } from "../pages/ComicDetailPage";
import { ReaderPage } from "../pages/ReaderPage";
import { UserDashboardPage } from "../pages/UserDashboardPage";
import { PlansPage } from "../pages/PlansPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { SimplePage } from "../pages/SimplePage";
import { ScrollToTop } from "../components/layout/ScrollToTop";
import { useNetwork } from "../lib/useNetwork";

function AppContent() {
  const { setComics, setCategories, setPlans, setLoadingStoreData } = useAppContext();
  const isOnline = useNetwork();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cRes, catRes, subRes] = await Promise.all([
          fetchApi(`${API_URL}/comics`).catch(() => null),
          fetchApi(`${API_URL}/categories`).catch(() => null),
          fetchApi(`${API_URL}/subscriptions`).catch(() => null),
        ]);

        if (cRes && cRes.ok) {
          const data = await cRes.json();
          if (data.length > 0) {
            const mappedComics = data.map((c: any) => ({
              id: c._id, _id: c._id, title: c.title, tagline: c.subtitle || "War for Justice", genre: c.category || "Action-Adventure",
              price: c.price, badge: c.badge || null, accentColor: "#C8181E", img: c.coverImage || "/images/comic-1.jpeg", issues: 1,
              synopsis: c.synopsis, creator: c.creator, issuesInfo: c.issuesInfo, pageCount: c.pageCount
            }));
            setComics(mappedComics);
          }
        }

        if (catRes && catRes.ok) {
          const data = await catRes.json();
          if (data.length > 0) setCategories(data);
        }

        if (subRes && subRes.ok) {
          const data = await subRes.json();
          if (data.length > 0) setPlans(data);
        }
      } catch (err) {
        console.error("Failed to load real data.", err);
      } finally {
        setLoadingStoreData(false);
      }
    };
    loadData();
  }, [setComics, setCategories, setPlans, setLoadingStoreData]);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {!isOnline && (
        <div className="bg-[#C8181E] text-white text-center py-2 font-bold text-sm" style={{ fontFamily: "Bangers, cursive", letterSpacing: "0.05em" }}>
          NO INTERNET CONNECTION. PLEASE CHECK YOUR NETWORK AND TRY AGAIN.
        </div>
      )}
      <NavBar />
      <ScrollToTop />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/comic/:id" element={<ComicDetailPage />} />
          <Route path="/reader/:id" element={<ReaderPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/terms" element={<SimplePage title="Terms & Conditions" />} />
          <Route path="/privacy" element={<SimplePage title="Privacy Policy" />} />
          <Route path="/contact" element={<SimplePage title="Contact Us" />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
