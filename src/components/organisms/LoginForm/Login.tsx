

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));

      let loginCorrecto = false;
      let userData: any = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.email === email && data.password === password) {
          loginCorrecto = true;
          userData = data;
        }
      });

      if (loginCorrecto && userData) {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", userData.admin ? "admin" : "consultor");
        localStorage.setItem("userId", email); // Usar email como identificador único
        localStorage.setItem("userName", userData.name || userData.nombre || email.split('@')[0]); // Usar name, nombre o parte del email

        // Redirigir basado en el rol
        const dashboardRoute = userData.admin ? "/home" : "/consultant-dashboard";
        navigate(dashboardRoute);
      } else {
        alert("Usuario o contraseña incorrectos");
      }

    } catch (error) {
      console.error("Error consultando Firestore:", error);
    }
  };

  return (
    <section className={styles.card}>
      <h1 className={styles.title}>Bienvenido al IIPMCS</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          placeholder="Usuario"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />

        <Button type="submit" label="Iniciar Sesión" />

        <Link to="/forgot-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </section>
  );
};

export default Login;