import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/home" className={styles.link}>
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
