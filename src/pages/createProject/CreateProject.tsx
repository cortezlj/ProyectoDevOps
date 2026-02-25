import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import styles from "./CreateProject.module.css";

const CreateProject = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Proyecto creado");
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Crear Proyecto</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input placeholder="Nombre del Proyecto" required />
        <Input placeholder="Descripción" required />

        <select className={styles.select}>
          <option>ERP</option>
          <option>SCM</option>
          <option>HCM</option>
        </select>

        <select className={styles.select}>
          <option>Consultores Funcionales</option>
        </select>

        <select className={styles.select}>
          <option>Consultores Técnicos</option>
        </select>

        <Button type="submit" label="Guardar Proyecto" />
      </form>
    </section>
  );
};

export default CreateProject;
