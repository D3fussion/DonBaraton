
document.addEventListener("DOMContentLoaded", async () => {
    // URL de tu API Flask
    const apiURL = "https://don-baraton-api-f9bu.vercel.app/get_products"; // Cambia a la URL de tu API si es necesario

    // Obtener el carrito guardado en localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verifica si el carrito está vacío
    if (cart.length === 0) {
        alert("Your cart is empty. Please add some products before proceeding to checkout.");
        window.location.href = 'cart.html';
    }

    // Función para obtener los detalles de los productos desde la API
    async function fetchProductDetails(cartItems) {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: cartItems })
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error al obtener los detalles de los productos.");
            return [];
        }
    }

    function quantityChange(productsDict) {
        for (let i = 0; i < productsDict.length; i++) {
            if (productsDict[i].quantity > productsDict[i].stock_disponible) {
                alert("Some products aren't available in the quantity you selected. Please update the quantity of the products in your cart.");
                window.location.href = 'cart.html';
            }
        }
    }

    // Llama a la API para obtener los detalles de los productos
    const products = await fetchProductDetails(cart.map(item => ({ id: item.id, quantity: item.quantity })));

    // Calcular el total, IVA y subtotal
    const total = products.reduce((sum, product) => sum + product.precio_despues_descuento * product.quantity, 0);  // Total
    const iva = (total * 0.16).toFixed(2);  // IVA del 16%
    const subtotal = (total - iva).toFixed(2);  // Subtotal sin IVA

    // Actualizar los valores en la tabla
    document.getElementById('subtotal').textContent = `$${subtotal}`;
    document.getElementById('iva').textContent = `$${iva}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    quantityChange(products);
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is already logged in on page load
    fetch('https://don-baraton-api-f9bu.vercel.app/get_account', {
        method: 'GET',
        credentials: 'include',  // Include cookies with request
    })
        .then(response => response.json())
        .then(data => {
            console.log(document.cookie);
            console.log(data);
            if (Object.keys(data).length <= 1) {
                document.getElementById('email').readOnly = false;
                return;
            }
            document.getElementById('first_name').value = data.first_name || "";
            document.getElementById('last_name').value = data.last_name || "";
            document.getElementById('email').value = data.email || "";
            document.getElementById('phone').value = data.phone_number || "";
            document.getElementById('address').value = data.address || "";
            document.getElementById('add_info').value = data.addinfo || "";
        })
        .catch(error => console.error('Error checking session:', error));

});



document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar el botón "Place Order"
    const placeOrderButton = document.querySelector('.u-btn-1');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Añadir el evento de clic al botón
    placeOrderButton.addEventListener('click', async (e) => {
        e.preventDefault();

        // Obtener los campos del formulario
        const firstName = document.getElementById('first_name');
        const lastName = document.getElementById('last_name');
        const address = document.getElementById('address');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');

        // Resetear los bordes
        [firstName, lastName, address, phone, email].forEach(input => {
            input.style.border = '';
        });

        // Validar si los campos están vacíos
        let formValid = true;

        if (!firstName.value.trim()) {
            firstName.style.border = '2px solid red';
            formValid = false;
        }

        if (!lastName.value.trim()) {
            lastName.style.border = '2px solid red';
            formValid = false;
        }

        if (!address.value.trim()) {
            address.style.border = '2px solid red';
            formValid = false;
        }

        if (!phone.value.trim() || !/^[0-9]{10}$/.test(phone.value)) {
            phone.style.border = '2px solid red';
            formValid = false;
        }

        if (!email.value.trim() || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
            email.style.border = '2px solid red';
            formValid = false;
        }

        // Si el formulario no es válido, mostrar alerta
        if (!formValid) {
            alert("Please, fill out all the form correctly");
            return;
        }

        // Ahora mismo ni siquiera envia los datos del formulario xd

        var track_code = "";


        async function processOrder() {
            try {
                // Obtener el código de seguimiento
                const trackCodeResponse = await fetch('https://don-baraton-api-f9bu.vercel.app/set_order_code', {
                    method: 'GET',
                    credentials: 'include',  // Incluir cookies con la solicitud
                });

                const trackCodeData = await trackCodeResponse.json();
                const track_code = trackCodeData.code;

                console.log("Este es mi trackCode: " + track_code);

                // Crear los datos de la orden
                const orderData = {
                    email_usuario: email.value.trim(),
                    codigo_trackeo: track_code,
                    productos: JSON.stringify(cart.map(item => ({ id: item.id, cantidad: item.quantity, nombre: item.name }))),
                };

                // Enviar los datos a la API usando fetch
                const response = await fetch('https://don-baraton-api-f9bu.vercel.app/place_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    // Limpiar el carrito del localStorage después de completar el pedido
                    localStorage.removeItem('cart');

                    // Redirigir a end.html
                    window.location.href = 'end.html';
                } else {
                    alert("Error al procesar la orden. Inténtalo de nuevo.");
                }
            } catch (error) {
                console.error("Error en la solicitud a la API:", error);
                alert("Error al conectar con la API.");
            }
        }

        // Llamar a la función de procesamiento de la orden
        processOrder();
    });
});


function eliminarDiacriticosEs(texto) {
  return texto
         .normalize('NFD')
         .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
         .normalize();
}

document.getElementById('Buscar').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission
  var query = document.querySelector('#Buscar input[name="search"]').value;
  query = eliminarDiacriticosEs(query);
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
