import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
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
  startDate: string;
  estado?: string;
  avance?: number;
}

const ConsultantDashboard = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";

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

    if (userName) {
      fetchProyectos();
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
        <StatCard title="Tareas Pendientes" value={proyectos.reduce((acc, p) => acc + ((p.avance || 0) < 100 ? 1 : 0), 0)} />
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
                  <td>{p.startDate}</td>
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
    </section>
  );
};

export default ConsultantDashboard;