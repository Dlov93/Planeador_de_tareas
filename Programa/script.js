// CLASE TASKMANAGER
class TaskManager {
  tasks = [];     
  currentId = 0;  

  addTask(nombre, descripcion, asignadoA, fechaDeEntrega, estado) {
    this.currentId++;       
    const nuevaTarea = {
      id: this.currentId,   
      nombre: nombre,       
      descripcion: descripcion, 
      asignadoA: asignadoA,  
      fechaDeEntrega: fechaDeEntrega, 
      estado: estado   
    };
    this.tasks.push(nuevaTarea);   
    return nuevaTarea;    
  }
  //metodo para obtener tareas todas
  getAllTasks() {
    console.log(this.tasks);
    return this.tasks;
  }
  //metodo para borrar tareas
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(tarea => tarea.id !== taskId);
  }
}

//validacion formulario 
function validateTaskForm(nombre, descripcion, asignadoA, fecha, estado) {
  //validacionnombre de la tarea
  if (nombre.trim() === "" || nombre.trim().length <= 8) {
    alert("Error: El nombre de la tarea no puede estar vacío y debe tener MÁS de 8 caracteres.");
    return false;
  }
  //validacion Descripcion de la tarea 
  if (descripcion.trim() === "" || descripcion.trim().length <= 15) {
    alert("Error: La descripción no puede estar vacía y debe tener MÁS de 15 caracteres.");
    return false;
  }
  //validacion a quien se asigan la tarea
  if (asignadoA.trim() === "" || asignadoA.trim().length <= 8) {
    alert("Error: El campo 'Asignado a' no puede estar vacío y debe tener MÁS de 8 caracteres.");
    return false;
  }
  //validacion fecha
  if (fecha.trim() === "") {
    alert("Error: Debe seleccionar una fecha de finalización.");
    return false;
  }
  //validacion opcion lista desplegable
  if (estado.trim() === "" || estado.trim() === "Choose one…") {
    alert("Error: Debe seleccionar una Prioridad válida.");
    return false;
  }
  return true; 
}