import { useState } from "react";
import styles from "./ChangeRequests.module.css";

interface ChangeRequest {
  id: string;
  descripcion: string;
  proyecto: string;
  estado: string;
  comentarios?: string;
  consultor?: string;
}

const initialRequests: ChangeRequest[] = [
  { id: "#15", descripcion: "Actualización Reportes", proyecto: "ERP", estado: "Aprobado", consultor: "Juan Pérez" },
  { id: "#22", descripcion: "Nuevo Flujo Compras", proyecto: "SCM", estado: "En Revisión", consultor: "María López" },
  { id: "#30", descripcion: "Ajuste Useraries", proyecto: "HCM", estado: "Pendiente", consultor: "Pedro García" },
];

const ChangeRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    descripcion: "",
    proyecto: "",
    comentarios: "",
    consultor: "",
  });

  // Abrir modal para nueva solicitud o edición
  const openModal = (request?: ChangeRequest) => {
    if (request) {
      setSelectedRequest(request);
      setFormData({
        id: request.id,
        descripcion: request.descripcion,
        proyecto: request.proyecto,
        comentarios: request.comentarios || "",
        consultor: request.consultor || "",
      });
    } else {
      setSelectedRequest(null);
      setFormData({ id: "", descripcion: "", proyecto: "", comentarios: "", consultor: "" });
    }
    setModalOpen(true);
  };

  // Guardar cambios
  const handleSave = (estado: string) => {
    if (!formData.id || !formData.proyecto || !formData.consultor) {
      alert("Debe completar ID, Proyecto y Consultor Asignado");
      return;
    }

    if (selectedRequest) {
      // Actualizar solicitud existente
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id ? { ...r, estado, ...formData } : r
        )
      );
    } else {
      // Crear nueva solicitud
      const newRequest: ChangeRequest = {
        ...formData,
        estado,
      };
      setRequests((prev) => [...prev, newRequest]);
    }
    setModalOpen(false);
  };

  // Eliminar solicitud
  const handleDelete = (id: string) => {
    if (window.confirm("¿Desea eliminar esta solicitud?")) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <section className={styles.container}>
      <h1>Solicitudes de Cambio</h1>
      <button className={styles.newRequestBtn} onClick={() => openModal()}>
        + Nueva Solicitud
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Proyecto</th>
            <th>Estado</th>
            <th>Consultor Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.descripcion}</td>
              <td>{r.proyecto}</td>
              <td>{r.estado}</td>
              <td>{r.consultor}</td>
              <td>
                <button onClick={() => openModal(r)} className={styles.revisarBtn}>
                  Revisar
                </button>
                <button onClick={() => handleDelete(r.id)} className={styles.deleteBtn}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{selectedRequest ? "Revisar Solicitud" : "Nueva Solicitud"}</h2>

            <label>
              ID
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              />
            </label>

            <label>
              Proyecto
              <input
                type="text"
                value={formData.proyecto}
                onChange={(e) => setFormData({ ...formData, proyecto: e.target.value })}
              />
            </label>

            <label>
              Descripción
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </label>

            <label>
              Comentarios
              <textarea
                value={formData.comentarios}
                onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
              />
            </label>

<label>
  Consultor Asignado
  <input
    type="text"
    placeholder="Nombre del consultor"
    value={formData.consultor}
    onChange={(e) => setFormData({ ...formData, consultor: e.target.value })}
  />
</label>

            {/* Botones de estado */}
            <div className={styles.modalActions}>
              <button className={styles.approveBtn} onClick={() => handleSave("Aprobado")}>
                Aprobar
              </button>
              <button className={styles.rejectBtn} onClick={() => handleSave("Rechazado")}>
                Rechazar
              </button>
              <button className={styles.inProgressBtn} onClick={() => handleSave("En Proceso")}>
                En Proceso
              </button>
              <button className={styles.inReviewBtn} onClick={() => handleSave("En Revisión")}>
                En Revisión
              </button>
              <button className={styles.closeBtn} onClick={() => setModalOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChangeRequests;