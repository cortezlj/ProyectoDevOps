import { useState, useEffect } from "react";
import styles from "./ChangeRequests.module.css";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface ChangeRequest {
  id?: string; // id de Firestore
  descripcion: string;
  proyecto: string;
  estado: string;
  comentarios?: string;
  consultor?: string;
}

const ChangeRequests = () => {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    descripcion: "",
    proyecto: "",
    comentarios: "",
    consultor: "",
  });

  useEffect(() => {
    cargarRequests();
  }, []);

  // Cargar solicitudes desde Firestore
  const cargarRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "changeRequests"));
    const lista: ChangeRequest[] = [];
    querySnapshot.forEach((docSnap) => {
      lista.push({ id: docSnap.id, ...docSnap.data() } as ChangeRequest);
    });
    setRequests(lista);
  };

  // Abrir modal para nueva solicitud o edición
  const openModal = (request?: ChangeRequest) => {
    if (request) {
      setSelectedRequest(request);
      setFormData({
        id: request.id || "",
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
  const handleSave = async (estado: string) => {
    if (!formData.id || !formData.proyecto || !formData.consultor) {
      alert("Debe completar ID, Proyecto y Consultor Asignado");
      return;
    }

    const nuevoData: ChangeRequest = { ...formData, estado };

    // Excluir 'id' antes de enviar a Firestore
    const { id, ...dataToSave } = nuevoData;

    if (selectedRequest && selectedRequest.id) {
      // Actualizar solicitud existente
      const reqRef = doc(db, "changeRequests", selectedRequest.id);
      await updateDoc(reqRef, dataToSave);
    } else {
      // Crear nueva solicitud
      await addDoc(collection(db, "changeRequests"), dataToSave);
    }

    // Recargar datos y cerrar modal
    await cargarRequests();
    setModalOpen(false);
    setSelectedRequest(null);
    setFormData({ id: "", descripcion: "", proyecto: "", comentarios: "", consultor: "" });
  };

  // Eliminar solicitud
  const handleDelete = async (id?: string) => {
    if (id && window.confirm("¿Desea eliminar esta solicitud?")) {
      await deleteDoc(doc(db, "changeRequests", id));
      cargarRequests();
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