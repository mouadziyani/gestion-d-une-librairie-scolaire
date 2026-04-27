import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "@/app/routes";
import AuthProvider from "@/features/auth/AuthProvider";
import { AuthContext } from "@/features/auth/authContext";
import Loading from "@/components/ui/Loading";

function applyResponsiveTableLabels() {
  document.querySelectorAll("table").forEach((table) => {
    const headers = Array.from(table.querySelectorAll("thead th")).map((header) =>
      header.textContent.trim().replace(/\s+/g, " "),
    );

    if (!headers.length) {
      return;
    }

    table.classList.add("responsive-table");

    table.querySelectorAll("tbody tr").forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (cell.tagName.toLowerCase() !== "td" || cell.hasAttribute("colspan")) {
          return;
        }

        const label = headers[index] || "";
        if (label) {
          cell.setAttribute("data-label", label);
        }
      });
    });
  });
}

function AppShell() {
  const { loading } = useContext(AuthContext);
  const location = useLocation();
  const [booting, setBooting] = useState(true);
  const pathname = location.pathname.toLowerCase();
  const isPublicRoute = [
    "/",
    "/home",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/products",
    "/categories",
    "/pages",
    "/productdetail",
    "/special-order",
    "/about",
    "/contact",
    "/faq",
    "/notfound",
    "/servererror",
    "/unauthorized",
  ].some((route) => pathname === route || pathname.startsWith("/password-reset/"));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooting(false);
    }, 850);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let frameId = window.requestAnimationFrame(applyResponsiveTableLabels);

    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(applyResponsiveTableLabels);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  return (
    <>
      <Loading forceVisible={booting || (!isPublicRoute && loading)} />
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
