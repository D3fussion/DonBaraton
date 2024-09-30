document.getElementById('Buscar').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission
  var query = document.querySelector('#Buscar input[name="search"]').value;
  if (query) {
    window.location.href = "./product_list.html?" + encodeURIComponent(query.trim().replace(/\s+/g, '-'));
  }
});


document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1; // Si ya está en el carrito, incrementa la cantidad
    } else {
      cart.push({ ...product, quantity: 1 }); // Si no está en el carrito, agrégalo
    }
    // alert('Product added to cart!');
    saveCart();
    updateCartCounter(); // Actualizar el contador de artículos
  }

  // Guardar el carrito en localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

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

  function renderProducts(products) {
    var agregar = document.getElementById("aquiVanLosProductos");
    products.forEach((product, index) => {

      var clase = "";
      if (index % 5 == 3) {
        var clase = "u-container-style u-layout-cell u-shape-rectangle u-size-12-lg u-size-12-md u-size-12-xl u-size-30-sm u-size-30-xs u-layout-cell-4";
      } else if (index % 5 == 4) {
        var clase = "u-container-style u-layout-cell u-shape-rectangle u-size-12-lg u-size-12-md u-size-12-xl u-size-30-sm u-size-60-xs u-layout-cell-5";
      } else {
        var clase = "u-container-style u-layout-cell u-shape-rectangle u-size-12-lg u-size-12-md u-size-12-xl u-size-20-sm u-size-30-xs u-layout-cell-1";
      }

      agregar.innerHTML += `
          <div class="${clase}">
            <div class="u-container-layout u-container-layout-1">
              <img class="custom-expanded u-align-center u-image u-image-default u-preserve-proportions u-image-1" src="${product.link_imagen1}" alt="${product.nombre}" data-image-width="200" data-image-height="200" data-href="./artic.html?$codigo=${product.id}">
              <p class="u-align-center u-text u-text-default-xl u-text-1">
                <a class="u-active-none u-border-none u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-text-hover-custom-color-2 u-btn-1" data-href="./artic.html?$codigo=${product.id}">${product.nombre}<br></a>
              </p>
              <p class="u-align-center u-text u-text-default-xl u-text-2">
                <a class="u-active-none u-border-none u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-2" data-href="./artic.html?$codigo=${product.id}">
                  <span style="font-size: 0.875rem; text-decoration: line-through !important;">$${product.precio_antes_descuento}</span>
                  <span class="u-text-palette-2-base" style="font-weight: 700; font-size: 1.3125rem;">&nbsp; <span style="font-size: 1.1875rem;">$${product.precio_despues_descuento}</span>
                  </span>
                </a>
              </p>
              <a href="#sec-1960" class="add-to-cart u-align-center-lg u-align-center-md u-align-center-sm u-align-center-xs u-btn u-btn-round u-button-style u-custom-color-2 u-dialog-link u-radius u-btn-3" data-id="${product.id}" data-name="${product.nombre}" data-price="${product.precio_despues_descuento}">Agregar al carrito </a>
            </div>
          </div>
        `;
    });
    setupAddToCartEvents();
  }

  function setupAddToCartEvents() {
    const addToCartLinks = document.querySelectorAll('.add-to-cart');
    addToCartLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir que el enlace navegue
        const product = {
          id: link.getAttribute('data-id'),
          name: link.getAttribute('data-name'),
          price: parseFloat(link.getAttribute('data-price'))
        };
        addToCart(product); // Agregar al carrito
      });
    });
  }

  fetch('https://don-baraton-api-f9bu.vercel.app/get_list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search_term: "$First5" })
  })
    .then(response => response.json())
    .then(products => {
      renderProducts(products);
    });

});

