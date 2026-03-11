import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import styles from "./TimeTrackingPM.module.css";

import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface Registro {
  id?: string; // id de Firestore
  proyecto: string;
  modulo: string;
  tarea: string;
  consultor: string;
  fecha: string;
  horas: number;
}

const TimeTrackingPM: React.FC = () => {

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [resultados, setResultados] = useState<Registro[]>([]);
  const [form, setForm] = useState({
    proyecto: "",
    modulo: "",
    tarea: "",
    consultor: "",
    fecha: "",
    horas: ""
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [proyectoFiltro, setProyectoFiltro] = useState("");
  const [consultorFiltro, setConsultorFiltro] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  // Cargar registros desde Firestore
  const cargarRegistros = async () => {
    const querySnapshot = await getDocs(collection(db, "timeTracking"));
    const lista: Registro[] = [];
    querySnapshot.forEach((docSnap) => {
      lista.push({ id: docSnap.id, ...docSnap.data() } as Registro);
    });
    setRegistros(lista);
    setResultados(lista);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoRegistro = {
      proyecto: form.proyecto,
      modulo: form.modulo,
      tarea: form.tarea,
      consultor: form.consultor,
      fecha: form.fecha,
      horas: Number(form.horas)
    };

    if (editIndex !== null) {
      // Actualizar registro existente
      const registroAEditar = resultados[editIndex];
      if (registroAEditar.id) {
        const registroRef = doc(db, "timeTracking", registroAEditar.id);
        await updateDoc(registroRef, nuevoRegistro);

        const nuevos = [...registros];
        nuevos[editIndex] = { id: registroAEditar.id, ...nuevoRegistro };
        setRegistros(nuevos);
        setResultados(nuevos);
        setEditIndex(null);
      }
    } else {
      // Crear nuevo registro
      await addDoc(collection(db, "timeTracking"), nuevoRegistro);
      cargarRegistros();
    }

    // Limpiar formulario
    setForm({
      proyecto: "",
      modulo: "",
      tarea: "",
      consultor: "",
      fecha: "",
      horas: ""
    });
  };

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    const filtrados = registros.filter((h) => {
      const proyectoOk = proyectoFiltro ? h.proyecto === proyectoFiltro : true;
      const consultorOk = consultorFiltro ? h.consultor === consultorFiltro : true;
      return proyectoOk && consultorOk;
    });
    setResultados(filtrados);
  };

  const handleEliminar = async (index: number) => {
    const registroAEliminar = resultados[index];
    if (registroAEliminar.id) {
      await deleteDoc(doc(db, "timeTracking", registroAEliminar.id));
      cargarRegistros();
    }
  };

  const handleEditar = (index: number) => {
    const registro = resultados[index];
    setForm({
      proyecto: registro.proyecto,
      modulo: registro.modulo,
      tarea: registro.tarea,
      consultor: registro.consultor,
      fecha: registro.fecha,
      horas: registro.horas.toString()
    });
    setEditIndex(index);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Registro de Horas</h1>

      {/* FORMULARIO REGISTRO */}
      <form className={styles.formRegistro} onSubmit={handleAgregar}>
        <input name="proyecto" placeholder="Proyecto" value={form.proyecto} onChange={handleChange} className={styles.input}/>
        <input name="modulo" placeholder="Módulo" value={form.modulo} onChange={handleChange} className={styles.input}/>
        <input name="tarea" placeholder="Tarea" value={form.tarea} onChange={handleChange} className={styles.input}/>
        <input name="consultor" placeholder="Consultor" value={form.consultor} onChange={handleChange} className={styles.input}/>
        <input name="fecha" type="date" value={form.fecha} onChange={handleChange} className={styles.input}/>
        <input name="horas" type="number" placeholder="Horas" value={form.horas} onChange={handleChange} className={styles.input}/>

        <div className={styles.buttonContainer}>
          <Button type="submit" label={editIndex !== null ? "Actualizar Registro" : "Guardar Registro"} />
        </div>
      </form>

      {/* FILTROS */}
      <form onSubmit={handleFiltrar} className={styles.form}>
        <select className={styles.select} value={proyectoFiltro} onChange={(e) => setProyectoFiltro(e.target.value)}>
          <option value="">Todos los Proyectos</option>
          <option value="ERP">ERP</option>
          <option value="SCM">SCM</option>
        </select>

        <select className={styles.select} value={consultorFiltro} onChange={(e) => setConsultorFiltro(e.target.value)}>
          <option value="">Todos los Consultores</option>
          <option value="Ana">Ana</option>
          <option value="Juan">Juan</option>
          <option value="Carlos">Carlos</option>
        </select>

        <Button type="submit" label="Filtrar" />
      </form>

      {/* TABLA */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Módulo</th>
            <th>Tarea</th>
            <th>Consultor</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {resultados.map((h, index) => (
            <tr key={h.id || index}>
              <td>{h.proyecto}</td>
              <td>{h.modulo}</td>
              <td>{h.tarea}</td>
              <td>{h.consultor}</td>
              <td>{h.fecha}</td>
              <td>{h.horas}</td>
              <td className={styles.actions}>
                <Button type="button" label="Editar" onClick={() => handleEditar(index)} />
                <Button type="button" label="Eliminar" onClick={() => handleEliminar(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </section>
  );
};

export default TimeTrackingPM;
