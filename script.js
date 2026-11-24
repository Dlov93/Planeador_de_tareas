/// CLASE TASKMANAGER
class TaskManager {
  tasks = JSON.parse(localStorage.getItem('misTareas')) || [];     
  currentId = Number(localStorage.getItem('ultimoId')) || 0;
  
  // Contadores históricos guardados en localStorage
  totalGeneradas = Number(localStorage.getItem('totalGeneradas')) || 0;
  totalEliminadas = Number(localStorage.getItem('totalEliminadas')) || 0;

  saveToLocalStorage() {
    localStorage.setItem('misTareas', JSON.stringify(this.tasks));
    localStorage.setItem('ultimoId', this.currentId.toString());
    localStorage.setItem('totalGeneradas', this.totalGeneradas.toString());
    localStorage.setItem('totalEliminadas', this.totalEliminadas.toString());
  }

  addTask(nombre, descripcion, asignadoA, fechaDeEntrega, estado) {
    this.currentId++;
    this.totalGeneradas++; // Sumamos al historial de creadas
    
    const nuevaTarea = {
      id: this.currentId,   
      nombre: nombre,       
      descripcion: descripcion, 
      asignadoA: asignadoA,  
      fechaDeEntrega: fechaDeEntrega, 
      estado: estado,
      completada: false
    };
    this.tasks.push(nuevaTarea);   
    this.saveToLocalStorage();
    return nuevaTarea;    
  }

  getAllTasks() {
    return this.tasks;
  }

  deleteTask(taskId) {
    const cantidadAntes = this.tasks.length;
    this.tasks = this.tasks.filter(tarea => tarea.id !== taskId);
    
    // Si efectivamente se borró una tarea, incrementamos el contador de eliminadas
    if (this.tasks.length < cantidadAntes) {
      this.totalEliminadas++;
    }
    this.saveToLocalStorage();
  }

  toggleTaskCompletion(taskId, isCompleted) {
    const tarea = this.tasks.find(t => t.id === taskId);
    if (tarea) {
      tarea.completada = isCompleted;
      this.saveToLocalStorage();
    }
  }

  // Método que devuelve el resumen completo para el header
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

// Validación formulario (Se mantiene exactamente igual)
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