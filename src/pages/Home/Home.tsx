import StatCard from "@/components/molecules/StatCard/StatCard";
import styles from "./Home.module.css";

const Home = () => {
  const proyectos = [
    { nombre: "Proyecto A", modulo: "ERP", estado: "En Progreso", avance: 75 },
    { nombre: "Proyecto B", modulo: "SCM", estado: "En Progreso", avance: 60 },
    { nombre: "Proyecto C", modulo: "HCM", estado: "Planeación", avance: 30 },
  ];

  const consultores = [
    { nombre: "Ana López", rol: "Functional", estado: "⚠️" },
    { nombre: "Carlos Ruiz", rol: "Técnico", estado: "✅" },
    { nombre: "Maria Gómez", rol: "Functional", estado: "⚠️" },
    { nombre: "Luis Herrera", rol: "Técnico", estado: "✅" },
  ];

  const tareasPendientes = [
    { tarea: "Configuración ERP", prioridad: "Alta" },
    { tarea: "Reunión con Cliente", prioridad: "Media" },
    { tarea: "Pruebas HCM", prioridad: "Baja" },
    { tarea: "Entrega Informe", prioridad: "Media" },
  ];

  const notificaciones = [
    "Nueva Solicitud de Cambio - hace 2 hrs",
    "Tarea Reasignada: Proyecto A - hace 4 hrs",
    "Reporte Mensual Disponible - hace 2 hrs",
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard Administrador</h1>
        <button className={styles.createBtn}>Crear Proyecto</button>
      </div>

      {/* Estadísticas principales */}
      <div className={styles.grid}>
        <StatCard title="Proyectos Activos" value={12} />
        <StatCard title="Presupuesto" value={85000} />
        <StatCard title="Tareas Pendientes" value={18} />
        <StatCard title="Consultores Conectados" value={24} />
      </div>

      {/* Proyectos en Curso y Consultores Asignados */}
      <div className={styles.flexSection}>
        <div className={styles.card}>
          <h3>Proyectos en Curso</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Módulo</th>
                <th>Estado</th>
                <th>Avance</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.nombre}>
                  <td>{p.nombre}</td>
                  <td>{p.modulo}</td>
                  <td>{p.estado}</td>
                  <td>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progress}
                        style={{ width: `${p.avance}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <h3>Consultores Asignados</h3>
          <ul className={styles.consultoresList}>
            {consultores.map((c) => (
              <li key={c.nombre}>
                {c.nombre} - {c.rol} <span className={styles.status}>{c.estado}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tareas Pendientes y Notificaciones */}
      <div className={styles.flexSection}>
        <div className={styles.card}>
          <h3>Tareas Pendientes</h3>
          <ul>
            {tareasPendientes.map((t) => (
              <li key={t.tarea}>
                {t.tarea} - <span className={styles[t.prioridad.toLowerCase()]}>{t.prioridad}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3>Notificaciones</h3>
          <ul>
            {notificaciones.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Home;
