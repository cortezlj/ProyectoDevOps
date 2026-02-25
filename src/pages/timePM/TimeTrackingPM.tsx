import React, { useState } from "react"; // Importar React y useState
import Button from "@/components/atoms/Button";
import styles from "./TimeTrackingPM.module.css";

const TimeTrackingPM: React.FC = () => {
  // Datos quemados
  const horasRegistradas = [
    { proyecto: "ERP", tarea: "Configuración Finanzas", consultor: "Ana", fecha: "10/02/2026", horas: 4 },
    { proyecto: "SCM", tarea: "Setup Inventario", consultor: "Juan", fecha: "11/02/2026", horas: 3 },
    { proyecto: "ERP", tarea: "Configuración Activos", consultor: "Carlos", fecha: "12/02/2026", horas: 5 }
  ];

  // Estados para filtros
  const [proyectoFiltro, setProyectoFiltro] = useState<string>("");
  const [consultorFiltro, setConsultorFiltro] = useState<string>("");
  const [resultados, setResultados] = useState(horasRegistradas);

  // Función para filtrar
  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();

    const filtrados = horasRegistradas.filter((h) => {
      const proyectoOk = proyectoFiltro ? h.proyecto === proyectoFiltro : true;
      const consultorOk = consultorFiltro ? h.consultor === consultorFiltro : true;
      return proyectoOk && consultorOk;
    });

    setResultados(filtrados);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Horas Registradas por Consultores</h1>

      {/* Formulario de filtros */}
      <form onSubmit={handleFiltrar} className={styles.form}>
        <select
          className={styles.select}
          value={proyectoFiltro}
          onChange={(e) => setProyectoFiltro(e.target.value)}
        >
          <option value="">Todos los Proyectos</option>
          <option value="ERP">ERP</option>
          <option value="SCM">SCM</option>
          <option value="HCM">HCM</option>
        </select>

        <select
          className={styles.select}
          value={consultorFiltro}
          onChange={(e) => setConsultorFiltro(e.target.value)}
        >
          <option value="">Todos los Consultores</option>
          <option value="Ana">Ana</option>
          <option value="Juan">Juan</option>
          <option value="Carlos">Carlos</option>
        </select>

        <Button type="submit" label="Filtrar" />
      </form>

      {/* Tabla de resultados */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Tarea</th>
            <th>Consultor</th>
            <th>Fecha</th>
            <th>Horas</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((h, index) => (
            <tr key={index}>
              <td>{h.proyecto}</td>
              <td>{h.tarea}</td>
              <td>{h.consultor}</td>
              <td>{h.fecha}</td>
              <td>{h.horas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TimeTrackingPM;
