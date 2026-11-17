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

const Contenedor_tareas = document.getElementById('Contenedor-tareas');
const Contenedor_tareas_finalizadas = document.getElementById('Contenedor-tareas-finalizadas');

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


//Fecha actula
const fechaActual = new Date();
const stiker = document.querySelector('.sticker-tarea');
const tarjetaFormulario = document.getElementById('Trajeta_Formulario');

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
        // Extraemos año, mes y día de la tarea
        let fecha = LFecha.value.split('T')[0];
        const partesFecha = fecha.split('-');
        const anioTarea = parseInt(partesFecha[0]);
        const mesTareaNum = parseInt(partesFecha[1]);
        const diaTareaNum = parseInt(partesFecha[2]);

        // Extraemos año, mes y día actuales
        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1; // Sumamos 1 porque getMonth() va de 0 a 11
        const diaActual = fechaActual.getDate();

        let prioridad = LBarra.value; // Obtener el valor de la barra de prioridad

        if (prioridad === "Baja") {
            colorFondo = 'var(--ColorSeleccion--Verde)';
        } else if (prioridad === "Media") {
            colorFondo = 'var(--ColorSeleccion--Amarillo)';
        } else if (prioridad === "Alta") {
            colorFondo = 'var(--ColorSeleccion--Rojo)';
        }

        //creamos el elemento del contenedor donde ira nuestra tarea con todos sus atributos tipo stiker
        let stickerHTML = `<div class="sticker-tarea" data-fecha="${LFecha.value}" style="background-color: ${colorFondo};">
            <h5 class="fw-bold"> Nota del Planeador</h5>
            <p class="mb-0"><strong>ID:</strong> ${tareaCreada.id}</p>
            <p class="mb-0"><strong>Tarea:</strong> ${tareaCreada.nombre}</p>
            <p class="mb-0"><strong>Detalle:</strong> ${tareaCreada.descripcion}</p>
            <p class="mb-0"><strong>Asignado a:</strong> ${tareaCreada.asignadoA}</p>
            <p class="mb-0"><strong>Fecha:</strong> ${tareaCreada.fechaDeEntrega}</p>
            <p class="mb-0"><strong>Prioridad:</strong> ${tareaCreada.estado}</p>
            <button class="btn btn-danger btn-sm mt-2 btn-eliminar" data-id="${tareaCreada.id}">Eliminar</button>
            <div class="form-field">
                <input type="checkbox" id="completada-${tareaCreada.id}" class="checkbox theme-accent check-completada">
                <label for="completada-${tareaCreada.id}">Completada</label>
            </div> 
        </div>`;
        //ecogemos en que mes queremos que se ponga la tarea

        // Evaluamos las 3 posibilidades válidas:
        const esAnioFuturo = anioTarea > anioActual;
        const esMismoAnioMesFuturo = (anioTarea === anioActual) && (mesTareaNum > mesActual);
        const esMismoMesDiaValido = (anioTarea === anioActual) && (mesTareaNum === mesActual) && (diaTareaNum >= diaActual);

        if (esAnioFuturo || esMismoAnioMesFuturo || esMismoMesDiaValido) {
                       
            Contenedor_tareas.insertAdjacentHTML('beforeend', stickerHTML);
            ordenarTareasPorFecha(Contenedor_tareas);
            
        } else {
            alert("No puedes asignar una tarea a un mes o dia que ya paso, selecciona un mes y dia valido");

        }
        //Lipiamos los campos del formulario 
        LNombre.value = '';
        LDescripcion.value = '';
        LAsignado.value = '';
        LBarra.value = 'Choose one…';
    }
});

//Funcnionalidad del boton eliminar que se creo dentro de la tarjeta del stiker para eliminar esa tarea
document.addEventListener('click', function (event) {
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

// Evento para detectar cuando se marca o desmarca el checkbox de "Completada"
document.addEventListener('change', function (event) {
    // Verificamos que el cambio venga de nuestro checkbox de completada
    if (event.target.classList.contains('check-completada')) {
        
        // Buscamos la tarjeta padre (.sticker-tarea) a la que pertenece este checkbox
        const tarjeta = event.target.closest('.sticker-tarea');

        if (event.target.checked) {
            // 1. Guardamos el color original
            tarjeta.dataset.colorOriginal = tarjeta.style.backgroundColor;
            
            // 2. Cambiamos el fondo a azul
            tarjeta.style.backgroundColor = 'var(--ColorBotones--blue)';
            
            // 3. Movemos la tarjeta al contenedor de finalizadas y ordenamos
            Contenedor_tareas_finalizadas.appendChild(tarjeta);
            ordenarTareasPorFecha(Contenedor_tareas_finalizadas);
            
            // 4. Mostramos la alerta
            alert("Tarea completada");
        } else {
            // 1. Devolvemos su color de prioridad original
            tarjeta.style.backgroundColor = tarjeta.dataset.colorOriginal || '#ffffff';
            
            // 2. Devolvemos la tarjeta al contenedor principal de pendientes y reordenamos
            Contenedor_tareas.appendChild(tarjeta);
            ordenarTareasPorFecha(Contenedor_tareas);
        }
    }
});

function ordenarTareasPorFecha(contenedor) {
    const tarjetas = Array.from(contenedor.querySelectorAll('.sticker-tarea'));

    tarjetas.sort((a, b) => {
        const fechaA = new Date(a.dataset.fecha);
        const fechaB = new Date(b.dataset.fecha);
        return fechaA - fechaB; // La más cercana a hoy siempre queda arriba/primero
    });

    tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-tema')) {
        const tema = event.target.dataset.color;

        if (tema === 'rosa') {
            tarjetaFormulario.style.backgroundColor = 'rgb(252, 224, 247)';
            tarjetaFormulario.style.borderColor = 'rgb(248, 196, 239)';
        } else if (tema === 'lila') {
            tarjetaFormulario.style.backgroundColor = 'rgb(218, 210, 244)';
            tarjetaFormulario.style.borderColor = 'var(--ColorSeleccion--Lila)';
        } else if (tema === 'azul') {
            tarjetaFormulario.style.backgroundColor = 'rgb(195, 229, 250)';
            tarjetaFormulario.style.borderColor = 'var(--ColorBotones--blue)';
        }
    }
});
