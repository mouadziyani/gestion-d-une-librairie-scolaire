import RoleRoute from "./RoleRoute";

function PrivateRoute({ children }) {
  return <RoleRoute>{children}</RoleRoute>;
}

export default PrivateRoute;
