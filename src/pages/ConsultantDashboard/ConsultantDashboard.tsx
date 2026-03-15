/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore"; //Cristell actualizacion: updateDoc para actualizar el estado de las tareas
import StatCard from "@/components/molecules/StatCard/StatCard";
import styles from "./ConsultantDashboard.module.css";

interface Proyecto {
  id: string;
  name: string;
  module: string;
  country: string;
  description: string;
  functionalConsultants: string | string[];
  technicalConsultants: string | string[];
  startDate: string | Timestamp;
  estado?: string;
  avance?: number;
}

// Cristell: interfaz tareas
interface Tarea {
  id: string;
  nombre: string;
  proyecto: string;
  consultor: string;
  estado: string;
  fechaLimite: string;
}
// Fin interfaz tareas
const ConsultantDashboard = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]); // Cristell: ver tareas del consultor
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";

   // Cristell: actualizar estado de tarea
  const updateTaskState = async (id: string, nuevoEstado: string) => {
    try {

      const tareaRef = doc(db, "tasks", id);

      await updateDoc(tareaRef, {
        estado: nuevoEstado
      });

      // actualizar estado localmente en el dashboard
      setTareas((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, estado: nuevoEstado } : t
        )
      );

    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };
  // Fin función actualizar estado de tarea

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        console.log("Total projects in database:", querySnapshot.size);
        const proyectosData: Proyecto[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Proyecto;

          // Simplificar el filtrado
          let isAssigned = false;

          if (data.functionalConsultants) {
            if (typeof data.functionalConsultants === 'string') {
              isAssigned = data.functionalConsultants === userName;
            } else if (Array.isArray(data.functionalConsultants)) {
              isAssigned = data.functionalConsultants.includes(userName);
            }
          }

          if (!isAssigned && data.technicalConsultants) {
            if (typeof data.technicalConsultants === 'string') {
              isAssigned = data.technicalConsultants === userName;
            } else if (Array.isArray(data.technicalConsultants)) {
              isAssigned = data.technicalConsultants.includes(userName);
            }
          }

          if (isAssigned) {
            proyectosData.push({ ...data, id: doc.id });
          }
        });

        console.log("Projects fetched:", proyectosData);

        setProyectos(proyectosData);
      } catch (error) {
        console.error("Error fetching proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    // Cristell: función para obtener tareas del consultor
    const fetchTareas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tareasData: Tarea[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Tarea;

          if (data.consultor === userName || data.consultor === userEmail) {
            tareasData.push({ ...data, id: doc.id });
          }
        });

        setTareas(tareasData);

      } catch (error) {
        console.error("Error fetching tareas:", error);
      }
    };
// Fin función para obtener tareas del consultor

if (userName) {
  fetchProyectos();
  fetchTareas(); // Cristell: llamar a la función para obtener tareas
} else {
  setLoading(false);
}
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard Consultor</h1>
      </div>

      <div className={styles.grid}>
        <StatCard title="Mis Proyectos" value={proyectos.length} />
        <StatCard title="Proyectos Activos" value={proyectos.filter(p => (p.estado || "En Progreso") === "En Progreso").length} />
       
       {/* Cristell: cálculo basado en tareas reales */}
        <StatCard
          title="Tareas Pendientes"
          value={tareas.filter((t) => t.estado !== "Completada").length}
        />
      </div>

      <div className={styles.card}>
        <h3>Mis Proyectos Asignados</h3>
        {proyectos.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Módulo</th>
                <th>País</th>
                <th>Fecha Inicio</th>
                <th>Estado</th>
                <th>Avance</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.module}</td>
                  <td>{p.country}</td>
                  <td>{p.startDate instanceof Timestamp ? p.startDate.toDate().toLocaleDateString() : new Date(p.startDate).toLocaleDateString()}</td>
                  <td>{p.estado || "En Progreso"}</td>
                  <td>
                    <div className={styles.progressBar}>
                      <div className={styles.progress} style={{ width: `${p.avance || 0}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tienes proyectos asignados actualmente.</p>
        )}
      </div>

       {/* Cristell: Consultar tareas */}

      <div className={styles.card}>

        <h3>Mis Tareas</h3>

        {tareas.length > 0 ? (

          <table className={styles.table}>

            <thead>
              <tr>
                <th>Tarea</th>
                <th>Proyecto</th>
                <th>Estado</th>
                <th>Fecha Límite</th>
              </tr>
            </thead>

            <tbody>
              {tareas.map((t) => (
                <tr key={t.id}>
                  <td>{t.nombre}</td>
                  <td>{t.proyecto}</td>
                  <td>
                    <select
                      value={t.estado}
                      onChange={(e) =>
                        updateTaskState(t.id, e.target.value)
                      }
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </td>
                  <td>{(typeof t.fechaLimite === "object" && t.fechaLimite && "toDate" in t.fechaLimite)
                      ? (t.fechaLimite as Timestamp).toDate().toLocaleDateString()
                      : new Date(t.fechaLimite as string).toLocaleDateString()
                  }</td>
                </tr>
              ))}
            </tbody>

          </table>

        ) : (
          <p>No tienes tareas asignadas.</p>
        )}

      </div>
        {/* FIN NUEVA SECCION PARA CONSULTAR TAREAS */}
    </section>
  );
};

export default ConsultantDashboard;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    