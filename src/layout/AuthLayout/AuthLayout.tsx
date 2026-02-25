import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
