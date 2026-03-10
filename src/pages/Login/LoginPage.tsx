import { useEffect } from "react";
import LoginForm from "@/components/organisms/LoginForm/Login";

const LoginPage = () => {
  
  useEffect(() => {
    // Esto se ejecuta cuando el componente se monta
    fetch("http://localhost:5000/api/usuarios")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []); // [] asegura que se ejecute solo una vez

  return <LoginForm />;
};

export default LoginPage;