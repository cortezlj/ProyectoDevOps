import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import styles from "./TimeTrackingPM.module.css";

import { db } from "../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

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
  horasEstimadas?: number; // Horas totales estimadas para el proyecto
}

interface RegistroHoras {
  id?: string;
  proyectoId: string;
  proyectoNombre: string;
  consultor: string;
  horas: number;
  fechaRegistro: string; // Fecha cuando se registró
  descripcion?: string;
}

const TimeTrackingPM: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [registrosHoras, setRegistrosHoras] = useState<RegistroHoras[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [horasARegistrar, setHorasARegistrar] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Obtener información del usuario actual
  const userName = localStorage.getItem("userName") || "";
  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (userName) {
      cargarDatos();
    }
  }, [userName]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        // Admin ve todos los proyectos y registros
        await cargarTodosLosProyectos();
        await cargarTodosLosRegistros();
      } else {
        // Consultor ve solo sus proyectos asignados
        await cargarProyectosAsignados();
        await cargarRegistrosConsultor();
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProyectosAsignados = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const proyectosData: Proyecto[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Proyecto;

      // Verificar si el consultor está asignado
      const isAssigned = (
        (typeof data.functionalConsultants === 'string' && data.functionalConsultants === userName) ||
        (Array.isArray(data.functionalConsultants) && data.functionalConsultants.includes(userName)) ||
        (typeof data.technicalConsultants === 'string' && data.technicalConsultants === userName) ||
        (Array.isArray(data.technicalConsultants) && data.technicalConsultants.includes(userName))
      );

      if (isAssigned) {
        proyectosData.push({ ...data, id: doc.id });
      }
    });

    setProyectos(proyectosData);
  };

  const cargarTodosLosProyectos = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const proyectosData: Proyecto[] = [];
    querySnapshot.forEach((doc) => {
      proyectosData.push({ id: doc.id, ...doc.data() } as Proyecto);
    });
    setProyectos(proyectosData);
  };

  const cargarRegistrosConsultor = async () => {
    const q = query(collection(db, "timeTracking"), where("consultor", "==", userName));
    const querySnapshot = await getDocs(q);
    const registros: RegistroHoras[] = [];
    querySnapshot.forEach((doc) => {
      registros.push({ id: doc.id, ...doc.data() } as RegistroHoras);
    });
    setRegistrosHoras(registros);
  };

  const cargarTodosLosRegistros = async () => {
    const querySnapshot = await getDocs(collection(db, "timeTracking"));
    const registros: RegistroHoras[] = [];
    querySnapshot.forEach((doc) => {
      registros.push({ id: doc.id, ...doc.data() } as RegistroHoras);
    });
    setRegistrosHoras(registros);
  };

  const handleRegistrarHoras = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProyecto || !horasARegistrar) {
      alert("Selecciona un proyecto e ingresa las horas");
      return;
    }

    const horas = parseFloat(horasARegistrar);
    if (horas <= 0) {
      alert("Las horas deben ser mayor a 0");
      return;
    }

    try {
      const nuevoRegistro = {
        proyectoId: selectedProyecto.id,
        proyectoNombre: selectedProyecto.name,
        consultor: userName,
        horas: horas,
        fechaRegistro: new Date().toISOString(),
        descripcion: descripcion || ""
      };

      await addDoc(collection(db, "timeTracking"), nuevoRegistro);

      // Recargar datos
      await cargarDatos();

      // Limpiar formulario
      setSelectedProyecto(null);
      setHorasARegistrar("");
      setDescripcion("");

      alert("Horas registradas exitosamente!");
    } catch (error) {
      console.error("Error registrando horas:", error);
      alert("Error al registrar las horas");
    }
  };

  const calcularHorasTotales = (proyectoId: string) => {
    return registrosHoras
      .filter(r => r.proyectoId === proyectoId)
      .reduce((total, r) => total + r.horas, 0);
  };

  const calcularHorasRestantes = (proyecto: Proyecto) => {
    const horasEstimadas = proyecto.horasEstimadas || 0;
    const horasRegistradas = calcularHorasTotales(proyecto.id);
    return Math.max(0, horasEstimadas - horasRegistradas);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        {isAdmin ? "Gestión de Registro de Horas" : "Registro de Horas - Consultor"}
      </h1>

      {!isAdmin && (
        <>
          {/* FORMULARIO PARA CONSULTOR */}
          <div className={styles.card}>
            <h3>Registrar Horas en Proyecto</h3>

            <form onSubmit={handleRegistrarHoras} className={styles.formRegistro}>
              <div className={styles.formGroup}>
                <label>Seleccionar Proyecto:</label>
                <select
                  value={selectedProyecto?.id || ""}
                  onChange={(e) => {
                    const proyecto = proyectos.find(p => p.id === e.target.value);
                    setSelectedProyecto(proyecto || null);
                  }}
                  className={styles.select}
                  required
                >
                  <option value="">Selecciona un proyecto</option>
                  {proyectos.map((proyecto) => (
                    <option key={proyecto.id} value={proyecto.id}>
                      {proyecto.name} - {proyecto.module}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProyecto && (
                <div className={styles.proyectoInfo}>
                  <h4>Información del Proyecto</h4>
                  <p><strong>Nombre:</strong> {selectedProyecto.name}</p>
                  <p><strong>Módulo:</strong> {selectedProyecto.module}</p>
                  <p><strong>País:</strong> {selectedProyecto.country}</p>
                  <p><strong>Estado:</strong> {selectedProyecto.estado || "En Progreso"}</p>
                  <p><strong>Avance:</strong> {selectedProyecto.avance || 0}%</p>
                  <p><strong>Horas Estimadas:</strong> {selectedProyecto.horasEstimadas || "No definidas"}</p>
                  <p><strong>Horas Registradas:</strong> {calcularHorasTotales(selectedProyecto.id)}</p>
                  <p><strong>Horas Restantes:</strong> {calcularHorasRestantes(selectedProyecto)}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Horas a Registrar:</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={horasARegistrar}
                  onChange={(e) => setHorasARegistrar(e.target.value)}
                  placeholder="Ej: 4.5"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descripción (opcional):</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe la tarea realizada..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.buttonContainer}>
                <Button type="submit" label="Registrar Horas" />
              </div>
            </form>
          </div>

          {/* LISTA DE PROYECTOS ASIGNADOS */}
          <div className={styles.card}>
            <h3>Mis Proyectos Asignados</h3>
            {proyectos.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Módulo</th>
                    <th>Estado</th>
                    <th>Horas Estimadas</th>
                    <th>Horas Registradas</th>
                    <th>Horas Restantes</th>
                    <th>Avance</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.map((proyecto) => (
                    <tr key={proyecto.id}>
                      <td>{proyecto.name}</td>
                      <td>{proyecto.module}</td>
                      <td>{proyecto.estado || "En Progreso"}</td>
                      <td>{proyecto.horasEstimadas || "N/A"}</td>
                      <td>{calcularHorasTotales(proyecto.id)}</td>
                      <td>{calcularHorasRestantes(proyecto)}</td>
                      <td>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progress}
                            style={{
                              width: proyecto.horasEstimadas
                                ? `${Math.min(100, (calcularHorasTotales(proyecto.id) / proyecto.horasEstimadas) * 100)}%`
                                : '0%'
                            }}
                          ></div>
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
        </>
      )}

      {/* REGISTROS DE HORAS */}
      <div className={styles.card}>
        <h3>{isAdmin ? "Todos los Registros de Horas" : "Mis Registros de Horas"}</h3>
        {registrosHoras.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Consultor</th>
                <th>Horas</th>
                <th>Fecha Registro</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {registrosHoras.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.proyectoNombre}</td>
                  <td>{registro.consultor}</td>
                  <td>{registro.horas}</td>
                  <td>{new Date(registro.fechaRegistro).toLocaleString()}</td>
                  <td>{registro.descripcion || "Sin descripción"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay registros de horas.</p>
        )}
      </div>
    </section>
  );
};

export default TimeTrackingPM;