document.addEventListener("DOMContentLoaded", function () {
    var partidas = JSON.parse(localStorage.getItem("partidas")) || [];

    // HISTORIAL COMPLETO
    var tablaHistorial = document.querySelector("#tabla-historial tbody");
    tablaHistorial.innerHTML = "";
    partidas.forEach(function (p) {
        var fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.puntaje}</td>
            <td>${p.fecha}</td>
            <td>${p.hora}</td>
            <td>${p.duracion}</td>
            <td class="estado-${p.estado}">${p.estado}</td>
        `;
        tablaHistorial.appendChild(fila);
    });

    // RANKING TOP 10: ganadas, mayor puntaje, menor tiempo
    var ranking = partidas
        .filter(p => p.estado === "ganado")
        .sort(function (a, b) {
            if (b.puntaje !== a.puntaje) {
                return b.puntaje - a.puntaje;
            }
            return a.duracion - b.duracion;
        })
        .slice(0, 10);

    var tablaRanking = document.querySelector("#tabla-ranking tbody");
    tablaRanking.innerHTML = "";
    ranking.forEach(function (p) {
        var fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.puntaje}</td>
            <td>${p.duracion}</td>
        `;
        tablaRanking.appendChild(fila);
    });

    // Orden dinámico por fecha o puntaje (opcional)
    var ordenActual = "puntaje";
    var encabezadoPuntaje = document.querySelector("#tabla-ranking thead th:nth-child(2)");
    var encabezadoFecha = document.createElement("th");
    encabezadoFecha.textContent = "Fecha";
    tablaRanking.parentElement.querySelector("thead tr").appendChild(encabezadoFecha);

    encabezadoPuntaje.addEventListener("click", function () {
        ordenActual = "puntaje";
        location.reload(); // Podés reemplazar esto por una función para reordenar sin recargar
    });

    encabezadoFecha.addEventListener("click", function () {
        ordenActual = "fecha";
        ranking.sort(function (a, b) {
            return new Date(b.fecha + " " + b.hora) - new Date(a.fecha + " " + a.hora);
        });
        tablaRanking.innerHTML = "";
        ranking.forEach(function (p) {
            var fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.nombre}</td>
                <td>${p.puntaje}</td>
                <td>${p.duracion}</td>
            `;
            tablaRanking.appendChild(fila);
        });
    });
});
