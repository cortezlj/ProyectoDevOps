import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/create-project"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Crear Proyecto
        </NavLink>

        <NavLink
          to="/time-tracking"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Registro de Horas de Consultores
        </NavLink>

                <NavLink
          to="/change-requests"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Solicitudes de Cambio
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

