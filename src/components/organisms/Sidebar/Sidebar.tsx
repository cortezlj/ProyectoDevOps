import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const userRole = localStorage.getItem("userRole") || "consultor";

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink
          to={userRole === "admin" ? "/home" : "/consultant-dashboard"}
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/time-tracking"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Registro de Horas
        </NavLink>

        {userRole === "admin" && (
          <>
            <NavLink
              to="/create-project"
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              Crear Proyecto
            </NavLink>

            <NavLink
              to="/change-requests"
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              Solicitudes de Cambio
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

