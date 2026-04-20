import { useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import Loading from "./components/Loading";
import { AuthContext } from "./context/AuthContext";

function AppShell() {
  const { loading } = useContext(AuthContext);

  return (
    <>
      <Loading forceVisible={loading} />
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
