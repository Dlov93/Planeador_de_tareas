
// Inicializamos clases
const administradorDeTareas = new TaskManager();

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
// FUNCIÓN REUTILIZABLE: Dibuja una tarjeta en el DOM
// =========================================================================
function renderizarTarea(tarea) {
    let colorPrioridad = '#ffffff';
    let colorAcento = 'var(--ColorSeleccion--Gris)';

    if (tarea.estado === "Baja") {
        colorPrioridad = 'var(--ColorSeleccion--Verde)';
        colorAcento = 'var(--ColorBotones--Azul)';
    } else if (tarea.estado === "Media") {
        colorPrioridad = 'var(--ColorSeleccion--Amarillo)';
        colorAcento = 'var(--ColorBotones--Naranja)';
    } else if (tarea.estado === "Alta") {
        colorPrioridad = 'var(--ColorSeleccion--Rojo)';
        colorAcento = 'var(--ColorBotones--Rosa)';
    }

    let colorActual = tarea.completada ? 'var(--ColorSeleccion--Gris)' : colorPrioridad;
    let atributoChecked = tarea.completada ? 'checked' : '';
    let fechaLegible = tarea.fechaDeEntrega.replace('T', ' • ');

    let stickerHTML = `
    <div class="sticker-tarea d-flex flex-column justify-content-between" data-id="${tarea.id}" data-fecha="${tarea.fechaDeEntrega}" data-color-original="${colorPrioridad}" style="background-color: ${colorActual};">
        <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge-id">#${tarea.id}</span>
                <span class="badge-prioridad" style="background-color: ${colorAcento};">${tarea.estado}</span>
            </div>
            <h5 class="titulo-tarjeta mb-2">${tarea.nombre}</h5>
            <p class="descripcion-tarjeta mb-3">${tarea.descripcion}</p>
        </div>

        <div>
            <div class="meta-tarjeta mb-3">
                <div class="mb-1"><strong>Asignado a:</strong> ${tarea.asignadoA}</div>
                <div><strong>Entrega:</strong> ${fechaLegible}</div>
            </div>

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
// 1. AL CARGAR LA PÁGINA: Trae las tareas desde Spring Boot (GET)
// =========================================================================
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const tareasGuardadas = await administradorDeTareas.loadTasksFromAPI();
        tareasGuardadas.forEach(tarea => {
            renderizarTarea(tarea);
        });
        actualizarContadores();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Sin conexión al servidor',
            text: 'No se pudieron cargar las tareas. Verifica que Spring Boot esté ejecutándose en el puerto 8080.',
            confirmButtonColor: '#4397f1'
        });
    }
});

// =========================================================================
// 2. AL GUARDAR LA TAREA: Envía los datos al Backend (POST)
// =========================================================================
boton.addEventListener('click', async function () {
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
            try {
                // Esperamos a que MySQL guarde y devuelva la tarea con su ID
                const tareaCreada = await administradorDeTareas.addTask(
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
                    title: '¡Tarea guardada en base de datos!',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });

                LNombre.value = '';
                LDescripcion.value = '';
                LAsignado.value = '';
                LBarra.value = 'Choose one…';
                LBarra.style.backgroundColor = '#ffffff';
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: 'El servidor rechazó la tarea o está apagado.',
                    confirmButtonColor: '#d33'
                });
            }
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

// =========================================================================
// 3. AL ELIMINAR LA TAREA: Borra en el Backend (DELETE)
// =========================================================================
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-eliminar')) {
        const taskId = parseInt(event.target.getAttribute('data-id'));
        const tarjeta = event.target.closest('.sticker-tarea');

        Swal.fire({
            title: '¿Eliminar esta tarea?',
            text: "Se borrará permanentemente de la base de datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await administradorDeTareas.deleteTask(taskId);
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
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar',
                        text: 'No se pudo eliminar la tarea en el servidor.',
                        confirmButtonColor: '#d33'
                    });
                }
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

// =========================================================================
// 4. AL COMPLETAR / DESMARCAR: Actualiza en el Backend (PUT)
// =========================================================================
document.addEventListener('change', async function (event) {
    if (event.target.classList.contains('check-completada')) {
        const checkbox = event.target;
        const tarjeta = checkbox.closest('.sticker-tarea');
        const taskId = parseInt(tarjeta.dataset.id);
        const estaCompletada = checkbox.checked;

        try {
            await administradorDeTareas.toggleTaskCompletion(taskId, estaCompletada);

            if (estaCompletada) {
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
                tarjeta.style.backgroundColor = tarjeta.dataset.colorOriginal || '#ffffff';
                Contenedor_tareas.appendChild(tarjeta);
                ordenarTareasPorFecha(Contenedor_tareas);
            }
            actualizarContadores();
        } catch (error) {
            console.error(error);
            // Si el servidor falla, revertimos el checkbox visualmente
            checkbox.checked = !estaCompletada;
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: 'No se pudo guardar el cambio de estado en el servidor.',
                confirmButtonColor: '#d33'
            });
        }
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

// Botones de cambio de tema visual
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-tema')) {
        const tema = event.target.dataset.color;

        if (tema === 'rosa') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Rosa)';
            tarjetaFormulario.style.borderColor = 'var(--ColorBotones--Rosa)';
            boton.style.backgroundColor = 'var(--ColorBotones--Rosa)';
            document.body.style.backgroundColor = 'var(--ColorBody--Rosa)';
        } else if (tema === 'lila') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Lila)';
            tarjetaFormulario.style.borderColor = 'var(--ColorSeleccion--Lila)';
            boton.style.backgroundColor = 'var(--ColorBotones--Lila)';
            document.body.style.backgroundColor = 'var(--ColorBody--Lila)';
        } else if (tema === 'azul') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Azul)';
            tarjetaFormulario.style.borderColor = 'var(--ColorBotones--Azul)';
            boton.style.backgroundColor = 'var(--ColorBotones--Azul)';
            document.body.style.backgroundColor = 'var(--ColorBody--Azul)';
        } else if (tema === 'defecto') {
            tarjetaFormulario.style.backgroundColor = 'var(--ColorBody--Naranja)';
            tarjetaFormulario.style.borderColor = 'var(--ColorSeleccion--Gris)';
            boton.style.backgroundColor = 'var(--ColorBotones--Naranja)';
            document.body.style.backgroundColor = 'var(--ColorBody--Naranja)';
        }
    }
});