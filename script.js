document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y analizado");

    // Instancia del cliente WS
    onst cliente = new WSClient("https://t8-2021630736-a.azurewebsites.net/api", "XQzBQ-WJSmsbIDvOCLAv5vwFWZbDAWVErf_o6CHzdfVLAzFucXNS-Q=="); // Cambia a la URL real de tu backend en producción

    // Elementos de la interfaz
    const btnCaptura = document.getElementById("btnCaptura");
    const btnCompra = document.getElementById("btnCompra");
    const btnCarrito = document.getElementById("btnCarrito");
    const capturaArticulo = document.getElementById("capturaArticulo");
    const compraArticulo = document.getElementById("compraArticulo");
    const carritoCompra = document.getElementById("carritoCompra");
    const formCaptura = document.getElementById("formCaptura");
    const formBusqueda = document.getElementById("formBusqueda");
    const resultados = document.getElementById("resultados");
    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
    const btnRegresarCompra = document.getElementById("btnRegresarCompra");

    // Función para alternar secciones
    const mostrarSeccion = (seccion) => {
        [capturaArticulo, compraArticulo, carritoCompra].forEach((sec) => sec.classList.add("oculto"));
        seccion.classList.remove("oculto");
    };

    // Configuración de botones
    btnCaptura.addEventListener("click", () => mostrarSeccion(capturaArticulo));
    btnCompra.addEventListener("click", () => mostrarSeccion(compraArticulo));
    btnCarrito.addEventListener("click", async () => {
        mostrarSeccion(carritoCompra);
        await cargarCarrito();
    });

    // Captura de artículo
    formCaptura.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const cantidad = parseInt(document.getElementById("cantidad").value);
        const fotografia = document.getElementById("fotografia").files[0];

        if (!fotografia) {
            alert("Por favor, selecciona una fotografía.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const articulo = {
                Nombre: nombre,
                Descripcion: descripcion,
                Precio: precio,
                Cantidad: cantidad,
                Fotografia: reader.result.split(",")[1], // Convertir imagen a base64
            };

            try {
                const response = await cliente.postJson("alta_articulo", articulo);
                alert(response.message || "Artículo guardado exitosamente");
                formCaptura.reset();
            } catch (error) {
                console.error("Error al guardar el artículo:", error);
                alert("Error al guardar el artículo.");
            }
        };
        reader.readAsDataURL(fotografia);
    });

    // Búsqueda de artículos
    formBusqueda.addEventListener("submit", async (e) => {
        e.preventDefault();
        const clave = document.getElementById("busqueda").value;

        try {
            const articulos = await cliente.getJson(`buscar_articulos?clave=${encodeURIComponent(clave)}`);
            resultados.innerHTML = "";
            articulos.forEach((articulo) => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <img src="data:image/png;base64,${articulo.Fotografia}" alt="Foto" width="50">
                    <p>Nombre: ${articulo.Nombre}</p>
                    <p>Descripción: ${articulo.Descripcion}</p>
                    <p>Precio: $${articulo.Precio}</p>
                    <p>Cantidad en existencia: ${articulo.Cantidad}</p>
                    <input type="number" value="1" min="1" max="${articulo.Cantidad}" id="cantidad_${articulo.IdArticulo}">
                    <button onclick="comprarArticulo(${articulo.IdArticulo})">Comprar</button>
                `;
                resultados.appendChild(div);
            });
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            alert("Error al buscar artículos.");
        }
    });

    // Compra de artículo
    window.comprarArticulo = async (idArticulo) => {
        const cantidad = parseInt(document.getElementById(`cantidad_${idArticulo}`).value);

        try {
            const response = await cliente.postJson("comprar_articulo", { id_articulo: idArticulo, cantidad });
            alert(response.message || "Artículo comprado exitosamente");
        } catch (error) {
            console.error("Error al comprar el artículo:", error);
            alert("Error al comprar el artículo.");
        }
    };

    // Cargar carrito
    async function cargarCarrito() {
        try {
            const respuesta = await cliente.getJson("obtener_carrito");
            const { carrito, total } = respuesta;

            listaCarrito.innerHTML = "";
            carrito.forEach((item) => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <img src="data:image/png;base64,${item.Fotografia}" alt="Foto" width="50">
                    <p>Nombre: ${item.Nombre}</p>
                    <p>Cantidad: ${item.Cantidad}</p>
                    <p>Precio por unidad: $${item.Precio}</p>
                    <p>Total por este artículo: $${item.Total}</p>
                    <button onclick="eliminarArticuloCarrito(${item.IdArticulo})">Eliminar</button>
                `;
                listaCarrito.appendChild(div);
            });

            totalCarrito.textContent = `Total: $${total}`;
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            alert("Error al cargar el carrito.");
        }
    }

    // Eliminar artículo del carrito
    window.eliminarArticuloCarrito = async (idArticulo) => {
        try {
            const response = await cliente.postJson("eliminar_articulo_carrito", { id_articulo: idArticulo });
            alert(response.message || "Artículo eliminado del carrito.");
            await cargarCarrito();
        } catch (error) {
            console.error("Error al eliminar artículo del carrito:", error);
            alert("Error al eliminar el artículo del carrito.");
        }
    };

    // Vaciar carrito
    btnVaciarCarrito.addEventListener("click", async () => {
        try {
            const response = await cliente.postJson("vaciar_carrito", {});
            alert(response.message || "Carrito vaciado exitosamente");
            listaCarrito.innerHTML = "";
            totalCarrito.textContent = "Total: $0.00";
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            alert("Error al vaciar el carrito.");
        }
    });

    // Regresar a compra de artículos
    btnRegresarCompra.addEventListener("click", () => mostrarSeccion(compraArticulo));
});
