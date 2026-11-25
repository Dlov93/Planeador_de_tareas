

const API_URL = "https://tu-url-del-backend.com/api/tasks";

// CLASE TASKMANAGER 
class TaskManager {
  tasks = [];
  totalGeneradas = 0;
  totalEliminadas = 0;

  // 1. GET: Obtener todas las tareas desde MySQL
  async loadTasksFromAPI() {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener las tareas del servidor");
    }
    const data = await response.json();

    // Traducimos los campos del Backend (inglés) a tu Frontend (español)
    this.tasks = data.map(t => ({
      id: t.id,
      nombre: t.name,
      descripcion: t.description,
      asignadoA: t.assignedTo,
      fechaDeEntrega: t.dueDate,
      estado: t.status,
      completada: t.completed
    }));

    // Sincronizamos el contador de generadas con las existentes
    if (this.totalGeneradas < this.tasks.length) {
      this.totalGeneradas = this.tasks.length;
    }

    return this.tasks;
  }

  getAllTasks() {
    return this.tasks;
  }

  // 2. POST: Crear una nueva tarea en el Backend
  async addTask(nombre, descripcion, asignadoA, fechaDeEntrega, estado) {
    // Preparamos el JSON con los nombres exactos que espera Spring Boot
    const payload = {
      name: nombre,
      description: descripcion,
      assignedTo: asignadoA,
      dueDate: fechaDeEntrega,
      status: estado,
      completed: false
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar la tarea en el servidor");
    }

    const t = await response.json(); // Recibimos la tarea con el ID generado por MySQL

    const nuevaTarea = {
      id: t.id,
      nombre: t.name,
      descripcion: t.description,
      asignadoA: t.assignedTo,
      fechaDeEntrega: t.dueDate,
      estado: t.status,
      completada: t.completed
    };

    this.tasks.push(nuevaTarea);
    this.totalGeneradas++;
    return nuevaTarea;
  }

  // 3. PUT: Actualizar el estado completada en el Backend
  async toggleTaskCompletion(taskId, isCompleted) {
    const tarea = this.tasks.find(t => t.id === taskId);
    if (!tarea) return;

    const payload = {
      name: tarea.nombre,
      description: tarea.descripcion,
      assignedTo: tarea.asignadoA,
      dueDate: tarea.fechaDeEntrega,
      status: tarea.estado,
      completed: isCompleted
    };

    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el estado de la tarea");
    }

    tarea.completada = isCompleted;
  }

  // 4. DELETE: Eliminar una tarea por ID en el Backend
  async deleteTask(taskId) {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la tarea en el servidor");
    }

    const cantidadAntes = this.tasks.length;
    this.tasks = this.tasks.filter(tarea => tarea.id !== taskId);
    if (this.tasks.length < cantidadAntes) {
      this.totalEliminadas++;
    }
  }

  // Resumen estadístico para los contadores del header
  getEstadisticas() {
    return {
      generadas: this.totalGeneradas,
      eliminadas: this.totalEliminadas,
      baja: this.tasks.filter(t => t.estado === 'Baja').length,
      media: this.tasks.filter(t => t.estado === 'Media').length,
      alta: this.tasks.filter(t => t.estado === 'Alta').length,
      completadas: this.tasks.filter(t => t.completada === true).length
    };
  }
}

// Validación del formulario (Se mantiene igual)
function validateTaskForm(nombre, descripcion, asignadoA, fecha, estado) {
  if (nombre.trim() === "" || nombre.trim().length <= 8) {
    Swal.fire({
      icon: 'error',
      title: 'Nombre muy corto',
      text: 'El nombre de la tarea no puede estar vacío y debe tener MÁS de 8 caracteres.',
      confirmButtonColor: '#f39c12'
    });
    return false;
  }
  if (descripcion.trim() === "" || descripcion.trim().length <= 15) {
    Swal.fire({
      icon: 'error',
      title: 'Descripción insuficiente',
      text: 'La descripción no puede estar vacía y debe tener MÁS de 15 caracteres.',
      confirmButtonColor: '#f39c12'
    });
    return false;
  }
  if (asignadoA.trim() === "" || asignadoA.trim().length <= 8) {
    Swal.fire({
      icon: 'error',
      title: 'Responsable inválido',
      text: 'El campo "Asignado a" no puede estar vacío y debe tener MÁS de 8 caracteres.',
      confirmButtonColor: '#f39c12'
    });
    return false;
  }
  if (fecha.trim() === "") {
    Swal.fire({
      icon: 'warning',
      title: 'Falta la fecha',
      text: 'Debe seleccionar una fecha de finalización.',
      confirmButtonColor: '#f39c12'
    });
    return false;
  }
  if (estado.trim() === "" || estado.trim() === "Choose one…") {
    Swal.fire({
      icon: 'warning',
      title: 'Sin prioridad',
      text: 'Debe seleccionar una Prioridad válida.',
      confirmButtonColor: '#f39c12'
    });
    return false;
  }
  return true;
}