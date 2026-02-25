import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import styles from "../../components/organisms/LoginForm/Login.module.css";

const ForgotPass = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Correo enviado");
  };

  return (
    <section className={styles.card}>
      <h1 className={styles.title}>Recuperar contraseña</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input type="email" placeholder="Ingresa tu correo" required />

        <Button type="submit" label="Enviar instrucciones" />
      </form>
    </section>
  );
};

export default ForgotPass;
