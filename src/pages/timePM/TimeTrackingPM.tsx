import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import styles from "./TimeTrackingPM.module.css";

const TimeTrackingPM: React.FC = () => {

  const datosIniciales = [
    { proyecto: "ERP", modulo: "Finanzas", tarea: "Configuración Finanzas", consultor: "Ana", fecha: "2026-02-10", horas: 4 },
    { proyecto: "SCM", modulo: "Inventario", tarea: "Setup Inventario", consultor: "Juan", fecha: "2026-02-11", horas: 3 },
    { proyecto: "ERP", modulo: "Activos", tarea: "Configuración Activos", consultor: "Carlos", fecha: "2026-02-12", horas: 5 }
  ];

  const [registros, setRegistros] = useState(datosIniciales);
  const [resultados, setResultados] = useState(datosIniciales);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoRegistro = {
      ...form,
      horas: Number(form.horas)
    };

    let nuevos;

    if (editIndex !== null) {
      nuevos = [...registros];
      nuevos[editIndex] = nuevoRegistro;
      setEditIndex(null);
    } else {
      nuevos = [...registros, nuevoRegistro];
    }

    setRegistros(nuevos);
    setResultados(nuevos);

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

  const handleEliminar = (index: number) => {
    const nuevos = registros.filter((_, i) => i !== index);
    setRegistros(nuevos);
    setResultados(nuevos);
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

        <input
          className={styles.input}
          name="proyecto"
          placeholder="Proyecto"
          value={form.proyecto}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="modulo"
          placeholder="Módulo"
          value={form.modulo}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="tarea"
          placeholder="Tarea"
          value={form.tarea}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          name="consultor"
          placeholder="Consultor"
          value={form.consultor}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
        />

        <input
          className={styles.input}
          type="number"
          name="horas"
          placeholder="Horas"
          value={form.horas}
          onChange={handleChange}
        />

        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            label={editIndex !== null ? "Actualizar Registro" : "Guardar Registro"}
          />
        </div>

      </form>

      {/* FILTROS */}

      <form onSubmit={handleFiltrar} className={styles.form}>

        <select
          className={styles.select}
          value={proyectoFiltro}
          onChange={(e) => setProyectoFiltro(e.target.value)}
        >
          <option value="">Todos los Proyectos</option>
          <option value="ERP">ERP</option>
          <option value="SCM">SCM</option>
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
            <tr key={index}>

              <td>{h.proyecto}</td>
              <td>{h.modulo}</td>
              <td>{h.tarea}</td>
              <td>{h.consultor}</td>
              <td>{h.fecha}</td>
              <td>{h.horas}</td>

              <td className={styles.actions}>

                <Button
                  type="button"
                  label="Editar"
                  onClick={() => handleEditar(index)}
                />

                <Button
                  type="button"
                  label="Eliminar"
                  onClick={() => handleEliminar(index)}
                />

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </section>
  );
};

export default TimeTrackingPM;