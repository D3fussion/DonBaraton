

function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.getElementById('cart-counter');
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    if (itemCount > 9) {
        cartCounter.textContent = '9+';
    } else {
        cartCounter.innerHTML = itemCount + "&nbsp;";
    }
}

// Función para obtener el código de producto desde la URL
function getCodigoProducto() {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    // Verificar si existe el parámetro '$codigo'
    const codigo = params.get('$codigo');

    // Si no existe o está vacío, redirigir a la página de error
    if (!codigo) {
        window.location.href = "404.html";
    } else {
        return codigo;
    }
}


// Obtener el código del producto
const codigo = getCodigoProducto();
let productoSeleccionado = {};

// Verificar si existe un código
if (codigo) {
    // Hacer la solicitud a la API con el código de producto
    fetch('https://don-baraton-api-f9bu.vercel.app/get_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search_term: codigo })
    })
        .then(response => response.json())
        .then(productos => {
            productoSeleccionado = productos[0];  // Guardar el producto seleccionado
            document.getElementById('nombre').textContent = productoSeleccionado.nombre;
            document.getElementById('precio_antes_descuento').textContent = `$${productoSeleccionado.precio_antes_descuento}`;
            document.getElementById('precio_despues_descuento').textContent = `$${productoSeleccionado.precio_despues_descuento}`;
            document.getElementById('Overview').textContent = productoSeleccionado.overview;
            document.getElementById('imagen1').src = productoSeleccionado.link_imagen1;
            document.getElementById('imagen2').src = productoSeleccionado.link_imagen2;
            document.getElementById('imagen3').src = productoSeleccionado.link_imagen3;
            document.getElementById('imagenC1').src = productoSeleccionado.link_imagen1;
            document.getElementById('imagenC2').src = productoSeleccionado.link_imagen2;
            document.getElementById('imagenC3').src = productoSeleccionado.link_imagen3;
            document.getElementById('texto').textContent = productoSeleccionado.descripcion;
            document.getElementById('categoria').textContent = productoSeleccionado.nombre_categoria;
            document.getElementById('categoria').setAttribute('data-href', `./product_list.html?$Categoria${productoSeleccionado.categorias}`);
        });
}

// Función para agregar el producto al carrito
function addToCart(product, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += quantity; // Si ya existe, incrementa la cantidad
    } else {
        cart.push({ ...product, quantity }); // Agrega el nuevo producto con la cantidad seleccionada
    }

    // Guardar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    //alert(`Added ${quantity} ${product.nombre} to the cart!`);
}

// Evento para el botón "Add to Cart"
document.getElementById('add-to-cart').addEventListener('click', function (event) {
    event.preventDefault();  // Evitar la navegación predeterminada

    // Obtener la cantidad seleccionada
    const cantidad = parseInt(document.querySelector('.u-input').value, 10) || 1;

    if (cantidad > productoSeleccionado.stock_disponible) {
        document.getElementById('textAdded').textContent = 'Not enough stock!';
        document.getElementById('imgAdded').src = 'images/sad-face.png';
        return;
    } else {
        document.getElementById('textAdded').textContent = 'Product added to cart!';
        document.getElementById('imgAdded').src = 'images/1023656.png';
    }

    let productoss = {
        id: productoSeleccionado.id,
        name: productoSeleccionado.nombre,
        price: productoSeleccionado.precio_despues_descuento,
    };

    // Agregar el producto al carrito con la cantidad seleccionada
    addToCart(productoss, cantidad);
    updateCartCounter();
});

// Funciones para cambiar el contenido de "texto"
document.getElementById('descripcion').addEventListener('click', function (event) {
    event.preventDefault();
    cambiarTexto('descripcion');
});

document.getElementById('datos_adicionales').addEventListener('click', function (event) {
    event.preventDefault();
    cambiarTexto('datos_adicionales');
});

document.getElementById('reviews').addEventListener('click', function (event) {
    event.preventDefault();
    cambiarTexto('reviews');
});

// Función para cambiar el contenido y las clases
function cambiarTexto(opcion) {
    let texto = "";
    // Cambiar el texto dependiendo del botón presionado
    if (opcion === 'descripcion') {
        texto = productoSeleccionado.descripcion;
    } else if (opcion === 'datos_adicionales') {
        texto = "<strong>Stock: " + productoSeleccionado.stock_disponible + "</strong><br>" +
            productoSeleccionado.datos_adicionales;
    } else if (opcion === 'reviews') {
        texto = "This system is still under development.";
    }

    // Actualizar el contenido del texto
    document.getElementById('texto').innerHTML = texto;

    // Cambiar las clases de los botones
    cambiarClaseBoton(opcion);
}

// Función para cambiar las clases de los botones
function cambiarClaseBoton(opcionActivo) {
    const botones = ['descripcion', 'datos_adicionales', 'reviews'];
    botones.forEach(function (boton) {
        const element = document.getElementById(boton);
        let clase = element.className;
        let ultimaLetra = clase[clase.length - 1];
        if (boton === opcionActivo) {
            element.className = `u-active-black u-border-5 u-border-custom-color-2 u-border-no-left u-border-no-right u-border-no-top u-btn u-button-style u-hover-custom-color-2 u-white u-btn-${ultimaLetra}`;
        } else {
            element.className = `u-active-black u-border-5 u-border-no-left u-border-no-right u-border-no-top u-border-palette-1-light-3 u-btn u-button-style u-hover-custom-color-2 u-white u-btn-${ultimaLetra}`;
        }
    });
}


document.getElementById('Buscar').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    var query = document.querySelector('#Buscar input[name="search"]').value;
    if (query) {
        window.location.href = "./product_list.html?" + encodeURIComponent(query.trim().replace(/\s+/g, '-'));
    }
});


document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Actualizar el contador del carrito
    function updateCartCounter() {
        const cartCounter = document.getElementById('cart-counter');
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

        if (itemCount > 9) {
            cartCounter.textContent = '9+';
        } else {
            cartCounter.innerHTML = itemCount + "&nbsp;";
        }
    }
    updateCartCounter();
});
