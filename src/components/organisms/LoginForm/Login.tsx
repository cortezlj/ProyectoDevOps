import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("isAuth", "true");
    navigate("/home");
  };

  return (
    <section className={styles.card}>
      <h1 className={styles.title}>Bienvenido al IIPMCS</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input type="email" placeholder="Usuario" required />
        <Input type="password" placeholder="Contraseña" required />

        <Button type="submit" label="Iniciar Sesión" />

        <Link to="/forgot-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </section>
  );
};

export default Login;
