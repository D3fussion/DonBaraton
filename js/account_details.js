document.addEventListener('DOMContentLoaded', function () {
  // Check if the user is already logged in on page load
  fetch('https://don-baraton-api-f9bu.vercel.app/is_logged_in', {
    method: 'GET',
    credentials: 'include',  // Include cookies with request
  })
    .then(response => response.json())
    .then(data => {
      console.log(document.cookie);
      console.log("hola");
      console.log(data);
      if (!data.logged_in) {
        window.location.href = 'login.html';  // Redirect if logged in
      }
    })
    .catch(error => console.error('Error checking session:', error));
});

document.addEventListener('DOMContentLoaded', function () {
  // Check if the user is already logged in on page load
  fetch('https://don-baraton-api-f9bu.vercel.app/get_account', {
    method: 'GET',
    credentials: 'include',  // Include cookies with request
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Account not found') {
        window.location.href = 'login.html';  // Redirect if logged in
      }
      console.log(document.cookie);
      console.log(data);
      console.log("hola");
      document.getElementById('firstName').value = data.first_name || "";
      document.getElementById('lastName').value = data.last_name || "";
      document.getElementById('address').value = data.address || "";
      document.getElementById('addInfo').value = data.addinfo || "";
      document.getElementById('phoneNumber').value = data.phone_number || "";
      document.getElementById('email').value = "";
    })
    .catch(error => console.error('Error checking session:', error));
});

var listaBotones = [
  document.getElementById('firstNameB'),
  document.getElementById('lastNameB'),
  document.getElementById('addressB'),
  document.getElementById('addInfoB'),
  document.getElementById('phoneNumberB'),
  document.getElementById('emailB')
];

listaBotones.forEach(function (boton) {
  boton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default behavior
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const addInfo = document.getElementById('addInfo');
    const phoneNumber = document.getElementById('phoneNumber');
    const password = document.getElementById('email');

    // Clear previous border styles
    [firstName, lastName, address, phoneNumber].forEach(input => {
      input.style.border = '';
    });

    // Validate fields
    let formValid = true;

    if (!phoneNumber.value.trim() || !/^[0-9]{10}$/.test(phoneNumber.value)) {
      phoneNumber.style.border = '2px solid red';
      formValid = false;
    }

    if (!formValid) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    fetch('https://don-baraton-api-f9bu.vercel.app/update_account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name: firstName.value, last_name: lastName.value, address: address.value, addInfo: addInfo.value, phone_number: phoneNumber.value, password: password.value }),
      credentials: 'include', // Ensures cookies are sent with the request
    })
      .then(response => response.json())
      .then(data => {
        console.log(document.cookie);
        console.log(data);
        if (data.message === 'Account updated successfully') {
          location.reload();
        } else {
          alert('Failed to update data');
        }
      })
      .catch(error => console.error('Error:', error));
  });
});

document.getElementById('logOut').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default form submission
  fetch('https://don-baraton-api-f9bu.vercel.app/log_out', {
    method: 'GET',
    credentials: 'include',  // Include cookies with request
  })
    .then(response => response.json())
    .then(data => {
      console.log(document.cookie);
      console.log("hola");
      console.log(data);
      location.reload();
    })
    .catch(error => console.error('Error logging out session:', error));
});

var buttonHasBeenClicked = false;

document.getElementById('MyOrders').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default form submission
  if (buttonHasBeenClicked) {
    return;
  }
  fetch('https://don-baraton-api-f9bu.vercel.app/get_orders', {
    method: 'GET',
    credentials: 'include',  // Include cookies with request
  })
    .then(response => response.json())
    .then(data => {

      buttonHasBeenClicked = true;
      console.log(document.cookie);
      console.log("my orders data");
      console.log(data);
      var tabla = "";

      const data2 = data.reduce((acc, item) => {
        const { codigo_trackeo, id, producto, nombre, cantidad } = item;
      
        // Verifica si ya existe una entrada para este código de trackeo
        const existingEntry = acc.find(entry => entry.codigo_trackeo === codigo_trackeo);
      
        const productEntry = { id: producto, nombre, cantidad };
      
        if (existingEntry) {
          // Si ya existe, añade el producto a la lista de productos
          existingEntry.productos.push(productEntry);
        } else {
          // Si no existe, crea una nueva entrada
          acc.push({
            codigo_trackeo: codigo_trackeo,
            email_usuario: item.email_usuario,
            fecha_compra: item.fecha_compra,
            productos: [productEntry]
          });
        }
      
        return acc;
      }, []);

      console.log(data2);

      data2.forEach(function (order) {
        var date = new Date(order.fecha_compra);
        var formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
          date.getDate().toString().padStart(2, '0') + '/' +
          date.getFullYear();

        // Crear la representación de los productos con el formato solicitado
        var productosFormatted = "";
        var productos = (order.productos);  // Parsear la cadena a objeto JSON
        productos.forEach(function (producto) {
          productosFormatted += `"<a data-href='./artic.html?$codigo=${producto.id}' style='color: inherit; text-decoration: underline;'>${producto.nombre}</a>" x ${producto.cantidad}<br>`;
        });

        tabla += '<tr style="height: 62px;">';
        tabla += '<td class="u-table-cell">' + formattedDate + '</td>';
        tabla += '<td class="u-table-cell">' + productosFormatted + '</td>';
        tabla += '<td class="u-table-cell">' + `<a href="https://t.17track.net/en#nums=${order.codigo_trackeo}" style='color: inherit; text-decoration: underline;' target='_blank'>` + order.codigo_trackeo + `</a>` + '</td>';
        tabla += '</tr>';
      });

      document.getElementById('orders_table').innerHTML = tabla;

    })
    .catch(error => console.error('Error logging out session:', error));
});



document.getElementById('Buscar').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission
  var query = document.querySelector('#Buscar input[name="search"]').value;
  if (query) {
    window.location.href = "./product_list.html?" + encodeURIComponent(query.trim().replace(/\s+/g, '-'));
  }
});


document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log("cart");
  console.log(cart);
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
