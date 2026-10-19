

//caragr calendarios
document.addEventListener("DOMContentLoaded", function () {
  const misDatos = {};
  const contenedoresCalendario = document.querySelectorAll('[data-bs-toggle="datepicker"]');

  contenedoresCalendario.forEach(function (contenedor) {
    const fechaManual = contenedor.getAttribute('data-mes');

    new Datepicker(contenedor, {
      defaultViewDate: fechaManual,
      beforeShowDay: function (fecha) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const fechaString = `${año}-${mes}-${dia}`;

        let contenidoHtml = `<div class="numero-dia">${fecha.getDate()}</div>`;

        if (misDatos[fechaString]) {
          contenidoHtml += `<div class="dato-dia">${misDatos[fechaString]}</div>`;
        }

        return {
          content: contenidoHtml
        };
      }
    });
  });
});