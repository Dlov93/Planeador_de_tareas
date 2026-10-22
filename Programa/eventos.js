//inicializamos clases
const administradorDeTareas = new TaskManager(); // Instancia de la clase creada en funciones.js

//inicializamos variables
const selector = document.querySelector('#Barra_selectora');
const boton = document.getElementById('BotonGuardar');
const LNombre = document.getElementById('input_nombre_tarea');
const LDescripcion = document.getElementById('input_Descripcion');
const LAsignado = document.getElementById('input_campo_AsignadoA');
const LFecha = document.getElementById('Fecha');
const LBarra = document.getElementById('Barra_selectora');

//traemos los contenedores de los meses
const contenedorEnero = document.querySelector('#Contenedor-tareas-Enero');
const contenedorFebrero = document.querySelector('#Contenedor-tareas-feb');
const contenedorMarzo = document.querySelector('#Contenedor-tareas-MArz');
const contenedorAbril = document.querySelector('#Contenedor-tareas-Abril');
const contenedorMayo = document.querySelector('#Contenedor-tareas-Mayo');
const contenedorJunio = document.querySelector('#Contenedor-tareas-junio');
const contenedorJulio = document.querySelector('#Contenedor-tareas-julio');
const contenedorAgosto = document.querySelector('#Contenedor-tareas-agosto');
const contenedorSeptiembre = document.querySelector('#Contenedor-tareas-sep');
const contenedorNoviembre = document.querySelector('#Contenedor-tareas-Nov');
const contenedorOctubre = document.querySelector('#Contenedor-tareas-Oct');
const contenedorDiciembre = document.querySelector('#Contenedor-tareas-Dic');


//evento para guardar la tarea.
boton.addEventListener('click', function () {
  //usamos la funcion de validacion de campos para validar los campos los atributos son los valores el form 
  const esValido = validateTaskForm(
    LNombre.value,
    LDescripcion.value,
    LAsignado.value,
    LFecha.value,
    LBarra.value
  );
  //la funcion de validacion envia false o tue si es true  etra a este if
  if (esValido) {
    //Pasamos el valor de la salida de la funcion de crear tarea a una constante 
    const tareaCreada = administradorDeTareas.addTask(
        LNombre.value,
        LDescripcion.value,
        LAsignado.value,
        LFecha.value,
        LBarra.value
    );
    //tomamos el valor de la fehca y sacamos el mes en numeros de ahi
    let fecha = LFecha.value;
    let mesTarea = fecha.split('-')[1]; 
    //creamos el elemento del contenedor donde ira nuestra tarea con todos sus atributos tipo stiker
    let stickerHTML = `<div class="sticker-tarea">
            <h5 class="fw-bold"> Nota del Planeador</h5>
            <p class="mb-0"><strong>ID:</strong> ${tareaCreada.id}</p>
            <p class="mb-0"><strong>Tarea:</strong> ${tareaCreada.nombre}</p>
            <p class="mb-0"><strong>Detalle:</strong> ${tareaCreada.descripcion}</p>
            <p class="mb-0"><strong>Asignado a:</strong> ${tareaCreada.asignadoA}</p>
            <p class="mb-0"><strong>Fecha:</strong> ${tareaCreada.fechaDeEntrega}</p>
            <p class="mb-0"><strong>Prioridad:</strong> ${tareaCreada.estado}</p>
            <button class="btn btn-danger btn-sm mt-2 btn-eliminar" data-id="${tareaCreada.id}">Eliminar</button>
        </div>`;
    //ecogemos en que mes queremos que se ponga la tarea
    if (mesTarea === "10") {
        contenedorOctubre.innerHTML += stickerHTML;
    } else if (mesTarea === "02") {
        contenedorFebrero.innerHTML += stickerHTML;
    } else if (mesTarea === "01") {
        contenedorEnero.innerHTML += stickerHTML;
    }else if (mesTarea === "03") {
        contenedorMarzo.innerHTML += stickerHTML;
    }
    else if (mesTarea === "04") {
        contenedorAbril.innerHTML += stickerHTML;
    }
    else if (mesTarea === "05") {
        contenedorMayo.innerHTML += stickerHTML;
    }
    else if (mesTarea === "06") {
        contenedorJunio.innerHTML += stickerHTML;
    }
    else if (mesTarea === "07") {
        contenedorJulio.innerHTML += stickerHTML;
    }
    else if (mesTarea === "08") {
        contenedorAgosto.innerHTML += stickerHTML;
    }
    else if (mesTarea === "09") {
        contenedorSeptiembre.innerHTML += stickerHTML;
    }
    else if (mesTarea === "11") {
        contenedorNoviembre.innerHTML += stickerHTML;
    }
    else if (mesTarea === "12") {
        contenedorDiciembre.innerHTML += stickerHTML;
    }

    else {
        alert("selecciones un mes valido");
    }
    //Lipiamos los campos del formulario 
    LNombre.value = '';
    LDescripcion.value = '';
    LAsignado.value = '';
    LBarra.value = 'Choose one…';
  }
});

//Funcnionalidad del boton eliminar que se creo dentro de la tarjeta del stiker para eliminar esa tarea
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const taskId = parseInt(event.target.getAttribute('data-id'));
        administradorDeTareas.deleteTask(taskId);
        
        const tarjeta = event.target.closest('.sticker-tarea');
        tarjeta.remove();
        
        console.log("Tarea eliminada. Tareas restantes en memoria:", administradorDeTareas.getAllTasks());
    }
});

//colores en la seccion de prioridad
selector.addEventListener('change', function () {
  const valor = selector.value;
  if (valor === 'Baja') {
    selector.style.backgroundColor = 'var(--ColorSeleccion--Verde)';
  } else if (valor === 'Media') {
    selector.style.backgroundColor = 'var(--ColorSeleccion--Amarillo)';
  } else if (valor === 'Alta') {
    selector.style.backgroundColor = 'var(--ColorSeleccion--Rojo)';
  } else {
    selector.style.backgroundColor = '#ffffff';
  }
});


