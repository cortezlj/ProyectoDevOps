import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import styles from "./CreateProject.module.css";

import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const CreateProject = () => {

  const emptyProject = {
    name: "",
    description: "",
    module: "",
    country: "",
    startDate: "",
    functionalConsultants: "",
    technicalConsultants: ""
  };

  const [project, setProject] = useState(emptyProject);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList: any[] = [];

    querySnapshot.forEach((doc) => {
      projectList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setProjects(projectList);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProject({
      ...project,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingIndex !== null) {
      // Obtener id del proyecto que se está editando
      const projectId = projects[editingIndex].id;
      const projectRef = doc(db, "projects", projectId);

      // Actualizar en Firestore
      await updateDoc(projectRef, project);

      // Actualizar localmente la lista de proyectos
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = { id: projectId, ...project };
      setProjects(updatedProjects);
      setEditingIndex(null);

    } else {
      // Crear nuevo proyecto
      await addDoc(collection(db, "projects"), project);
      loadProjects();
    }

    // Limpiar formulario
    setProject(emptyProject);
  };

  const editProject = (index: number) => {
    setProject(projects[index]);
    setEditingIndex(index);
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
    loadProjects();
  };

  return (
    <section className={styles.container}>

      <h1 className={styles.title}>Gestión de Proyectos</h1>

      <form onSubmit={handleSubmit} className={styles.form}>

        <Input
          name="name"
          placeholder="Nombre del Proyecto"
          value={project.name}
          onChange={handleChange}
          required
        />

        <Input
          name="description"
          placeholder="Descripción"
          value={project.description}
          onChange={handleChange}
          required
        />

        <Input
          type="date"
          name="startDate"
          value={project.startDate}
          onChange={handleChange}
        />

        <Input
          name="functionalConsultants"
          placeholder="Consultores Funcionales (Ej: Juan, María)"
          value={project.functionalConsultants}
          onChange={handleChange}
        />

        <Input
          name="technicalConsultants"
          placeholder="Consultores Técnicos (Ej: Pedro, Ana)"
          value={project.technicalConsultants}
          onChange={handleChange}
        />

        <div className={styles.selectRow}>
          <select
            name="module"
            value={project.module}
            onChange={handleChange}
          >
            <option value="">Seleccione módulo</option>
            <option value="ERP">ERP</option>
            <option value="SCM">SCM</option>
            <option value="HCM">HCM</option>
          </select>

          <select
            name="country"
            value={project.country}
            onChange={handleChange}
          >
            <option value="">Seleccione país</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            label={editingIndex !== null ? "Actualizar Proyecto" : "Guardar Proyecto"}
          />
        </div>

      </form>

      <h2 className={styles.subtitle}>Proyectos creados</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Descripción</th>
            <th>País</th>
            <th>Módulo</th>
            <th>Inicio</th>
            <th>Funcionales</th>
            <th>Técnicos</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p, index) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.country}</td>
              <td>{p.module}</td>
              <td>{p.startDate}</td>
              <td>{p.functionalConsultants}</td>
              <td>{p.technicalConsultants}</td>

              <td>
                <button type="button" onClick={() => editProject(index)}>
                  Editar
                </button>

                <button type="button" onClick={() => deleteProject(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </section>
  );
};

export default CreateProject;
