import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  return (
    <header className={styles.navbar}>
      <h2 className={styles.logo}>IIPMCS</h2>

      <nav className={styles.actions}>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
    </header>
  );
};

export default Navbar;
