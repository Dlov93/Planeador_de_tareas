// Inicializamos clases
const administradorDeTareas = new TaskManager(); // Instancia de la clase creada en funciones.js

//cabecera y pie de pagina
const cabecera = document.getElementById('cabecera');
const pie = document.getElementById('pie');

// Inicializamos variables
const selector = document.querySelector('#Barra_selectora');
const boton = document.getElementById('BotonGuardar');
const LNombre = document.getElementById('input_nombre_tarea');
const LDescripcion = document.getElementById('input_Descripcion');
const LAsignado = document.getElementById('input_campo_AsignadoA');
const LFecha = document.getElementById('Fecha');
const LBarra = document.getElementById('Barra_selectora');

const Contenedor_tareas = document.getElementById('Contenedor-tareas');
const Contenedor_tareas_finalizadas = document.getElementById('Contenedor-tareas-finalizadas');

// Fecha actual
const fechaActual = new Date();
const tarjetaFormulario = document.getElementById('Trajeta_Formulario');

function actualizarContadores() {
    const stats = administradorDeTareas.getEstadisticas();
    
    document.getElementById('stat-generadas').textContent = stats.generadas;
    document.getElementById('stat-baja').textContent = stats.baja;
    document.getElementById('stat-media').textContent = stats.media;
    document.getElementById('stat-alta').textContent = stats.alta;
    document.getElementById('stat-completadas').textContent = stats.completadas;
    document.getElementById('stat-eliminadas').textContent = stats.eliminadas;
}

// =========================================================================
// FUNCIÓN REUTILIZABLE: Dibuja una tarjeta con tus variables existentes
// =========================================================================
function renderizarTarea(tarea) {
    let colorPrioridad = '#ffffff';
    let colorAcento = 'var(--ColorSeleccion--Gris)';

    // Usamos únicamente tus variables ya definidas en :root
    if (tarea.estado === "Baja") {
        colorPrioridad = 'var(--ColorSeleccion--Verde)';
        colorAcento = 'var(--ColorBotones--verde)';
    } else if (tarea.estado === "Media") {
        colorPrioridad = 'var(--ColorSeleccion--Amarillo)';
        colorAcento = 'var(--ColorBotones--amarillo)';
    } else if (tarea.estado === "Alta") {
        colorPrioridad = 'var(--ColorSeleccion--Rojo)';
        colorAcento = 'var(--ColorBotones--rojo)';
    }

    let colorActual = tarea.completada ? 'var(--ColorSeleccion--Gris)' : colorPrioridad;
    let atributoChecked = tarea.completada ? 'checked' : '';
    let fechaLegible = tarea.fechaDeEntrega.replace('T', ' • ');

    let stickerHTML = `
    <div class="sticker-tarea d-flex flex-column justify-content-between" data-id="${tarea.id}" data-fecha="${tarea.fechaDeEntrega}" data-color-original="${colorPrioridad}" style="background-color: ${colorActual};">
        
        <div>
            <!-- Cabecera: ID discreto + Etiqueta de Prioridad -->
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge-id">#${tarea.id}</span>
                <span class="badge-prioridad" style="background-color: ${colorAcento};">${tarea.estado}</span>
            </div>

            <!-- Título principal de la tarea -->
            <h5 class="titulo-tarjeta mb-2">${tarea.nombre}</h5>

            <!-- Recuadro limpio para la descripción -->
            <p class="descripcion-tarjeta mb-3">${tarea.descripcion}</p>
        </div>

        <div>
            <!-- Datos de asignación y entrega -->
            <div class="meta-tarjeta mb-3">
                <div class="mb-1"><strong>Asignado a:</strong> ${tarea.asignadoA}</div>
                <div><strong>Entrega:</strong> ${fechaLegible}</div>
            </div>

            <!-- Pie de tarjeta alineado -->
            <div class="pie-tarjeta d-flex justify-content-between align-items-center pt-2">
                <div class="form-check m-0">
                    <input type="checkbox" id="completada-${tarea.id}" class="form-check-input check-completada" ${atributoChecked}>
                    <label class="form-check-label fw-semibold" for="completada-${tarea.id}">Completada</label>
                </div>
                <button class="btn btn-sm btn-eliminar px-3" data-id="${tarea.id}" style="background-color: ${colorAcento};">Eliminar</button>
            </div>
        </div>

    </div>`;

    if (tarea.completada) {
        Contenedor_tareas_finalizadas.insertAdjacentHTML('beforeend', stickerHTML);
        ordenarTareasPorFecha(Contenedor_tareas_finalizadas);
    } else {
        Contenedor_tareas.insertAdjacentHTML('beforeend', stickerHTML);
        ordenarTareasPorFecha(Contenedor_tareas);
    }
}

// =========================================================================
// EVENTO AL CARGAR LA PÁGINA: Recupera todo del localStorage
// =========================================================================
document.addEventListener('DOMContentLoaded', function () {
    const tareasGuardadas = administradorDeTareas.getAllTasks();
    tareasGuardadas.forEach(tarea => {
        renderizarTarea(tarea);
    });
    actualizarContadores();
});

// =========================================================================
// EVENTO PARA GUARDAR LA TAREA
// =========================================================================
boton.addEventListener('click', function () {
    const esValido = validateTaskForm(
        LNombre.value,
        LDescripcion.value,
        LAsignado.value,
        LFecha.value,
        LBarra.value
    );

    if (esValido) {
        let fecha = LFecha.value.split('T')[0];
        const partesFecha = fecha.split('-');
        const anioTarea = parseInt(partesFecha[0]);
        const mesTareaNum = parseInt(partesFecha[1]);
        const diaTareaNum = parseInt(partesFecha[2]);

        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1; 
        const diaActual = fechaActual.getDate();

        const esAnioFuturo = anioTarea > anioActual;
        const esMismoAnioMesFuturo = (anioTarea === anioActual) && (mesTareaNum > mesActual);
        const esMismoMesDiaValido = (anioTarea === anioActual) && (mesTareaNum === mesActual) && (diaTareaNum >= diaActual);

        if (esAnioFuturo || esMismoAnioMesFuturo || esMismoMesDiaValido) {
            const tareaCreada = administradorDeTareas.addTask(
                LNombre.value,
                LDescripcion.value,
                LAsignado.value,
                LFecha.value,
                LBarra.value
            );
            
            renderizarTarea(tareaCreada);
            actualizarContadores();

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: '¡Tarea agregada con éxito!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });

            LNombre.value = '';
            LDescripcion.value = '';
            LAsignado.value = '';
            LBarra.value = 'Choose one…';
            LBarra.style.backgroundColor = '#ffffff';
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha no válida',
                text: 'No puedes asignar una tarea a un mes o día que ya pasó. Selecciona una fecha actual o futura.',
                confirmButtonColor: '#4397f1'
            });
        }
    }
});

// Funcionalidad del botón eliminar
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const taskId = parseInt(event.target.getAttribute('data-id'));
        const tarjeta = event.target.closest('.sticker-tarea');

        Swal.fire({
            title: '¿Eliminar esta tarea?',
            text: "No podrás recuperarla después de borrarla.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                administradorDeTareas.deleteTask(taskId);
                tarjeta.remove();
                actualizarContadores();
                
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'info',
                    title: 'Tarea eliminada',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }
});

// Colores en la sección de prioridad
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
    if (event.target.classList.contains('check-completada')) {
        const tarjeta = event.target.closest('.sticker-tarea');
        const taskId = parseInt(tarjeta.dataset.id);

        if (event.target.checked) {
            administradorDeTareas.toggleTaskCompletion(taskId, true);
            tarjeta.style.backgroundColor = 'var(--ColorSeleccion--Gris)';
            Contenedor_tareas_finalizadas.appendChild(tarjeta);
            ordenarTareasPorFecha(Contenedor_tareas_finalizadas);
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: '¡Tarea completada!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            administradorDeTareas.toggleTaskCompletion(taskId, false);
            tarjeta.style.backgroundColor = tarjeta.dataset.colorOriginal || '#ffffff';
            Contenedor_tareas.appendChild(tarjeta);
            ordenarTareasPorFecha(Contenedor_tareas);
        }
        actualizarContadores();
    }
});

function ordenarTareasPorFecha(contenedor) {
    const tarjetas = Array.from(contenedor.querySelectorAll('.sticker-tarea'));

    tarjetas.sort((a, b) => {
        const fechaA = new Date(a.dataset.fecha);
        const fechaB = new Date(b.dataset.fecha);
        return fechaA - fechaB;
    });

    tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

// Botones de cambio de tema visual (Formulario + Fondo + Header + Footer)
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-tema')) {
        const tema = event.target.dataset.color;

        if (tema === 'rosa') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Rosa)';
            tarjetaFormulario.style.borderColor = 'var(--ColorBotones--Rosa)';
            boton.style.backgroundColor = 'var(--ColorBotones--Rosa)';
            document.body.style.backgroundColor = 'var(--ColorBody--Rosa)';
            cabecera.style.backgroundColor = 'var(--ColorBotones--Rosa)';
            cabecera.style.borderColor = 'var(--ColorBotones--Rosa)';
            pie.style.backgroundColor = 'var(--ColorBotones--Rosa)';
            pie.style.borderColor = 'var(--ColorBotones--Rosa)';
            
        } else if (tema === 'lila') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Lila)';
            tarjetaFormulario.style.borderColor = 'var(--ColorSeleccion--Lila)';
            boton.style.backgroundColor = 'var(--ColorBotones--Lila)';
            document.body.style.backgroundColor = 'var(--ColorBody--Lila)';
            cabecera.style.backgroundColor = 'var(--ColorBotones--Lila)';
            cabecera.style.borderColor = 'var(--ColorBotones--Lila)';
            pie.style.backgroundColor = 'var(--ColorBotones--Lila)';
            pie.style.borderColor = 'var(--ColorSeleccion--Lila)';
            
        } else if (tema === 'azul') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Azul)';
            tarjetaFormulario.style.borderColor = 'var(--ColorBotones--Azul)';
            boton.style.backgroundColor = 'var(--ColorBotones--Azul)';
            document.body.style.backgroundColor = 'var(--ColorBody--Azul)';
            cabecera.style.backgroundColor = 'var(--ColorBotones--Azul)';
            cabecera.style.borderColor = 'var(--ColorBotones--Azul)';
            pie.style.backgroundColor = 'var(--ColorBotones--Azul)';
            pie.style.borderColor = 'var(--ColorBotones--Azul)';
            
        } else if (tema === 'defecto') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Naranja)';
            tarjetaFormulario.style.borderColor = 'var(--ColorSeleccion--Gris)';
            boton.style.backgroundColor = 'var(--ColorBotones--Naranja)';
            document.body.style.backgroundColor = 'var(--ColorBody--Naranja)';
            cabecera.style.backgroundColor = 'var(--ColorBotones--Naranja)';
            cabecera.style.borderColor = 'var(--ColorBotones--Naranja)';
            pie.style.backgroundColor = 'var(--ColorBotones--Naranja)';
            pie.style.borderColor = 'var(--ColorSeleccion--Gris)';
        }
    }
});