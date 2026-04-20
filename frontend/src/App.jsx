import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import Loading from "./components/Loading";
import { AuthContext } from "./context/AuthContext";

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
      <Loading forceVisible={loading || booting} />
      <AppRoutes />
    </>
  );
}

function App(){
  return (
      <AuthProvider>
        <AppShell />
      </AuthProvider>
  )

}

export default App;
