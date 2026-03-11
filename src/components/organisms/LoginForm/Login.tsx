

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

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.email === email && data.password === password) {
          loginCorrecto = true;
        }
      });

      if (loginCorrecto) {
        localStorage.setItem("isAuth", "true");
        navigate("/home");
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