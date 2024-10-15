
var productsList = "";

function sortArticles(option, products) {
  if (option == "bestMatch") {
    products.sort((a, b) => a.id - b.id);
  }
  else if (option == "high") {
    products.sort((a, b) => b.precio_despues_descuento - a.precio_despues_descuento);
  }
  else if (option == "low") {
    products.sort((a, b) => a.precio_despues_descuento - b.precio_despues_descuento);
  }
  document.getElementById("aquiVanLosProductos").innerHTML = "";
  renderProducts(products);
}

// Función para obtener el código o nombre del producto desde la URL
function getProductCodeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.toString();
  if (code) {
    return code;
  } else {
    window.location.href = "404.html"
  }
}

// Obtener el código o nombre del producto desde la URL
const productCode = getProductCodeFromURL();


// Verificar si existe un código de producto
if (productCode) {
  // Enviar una solicitud POST a la API con el código de producto
  fetch('https://don-baraton-api-f9bu.vercel.app/get_list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search_term: productCode })
  })
    .then(response => response.json())
    .then(products => {
      productsList = products;
      if (products.length === 0) {
        window.location.href = "404.html";
      }
      sortArticles(document.getElementById("selectornator").value, productsList)  // Llamar a la función que renderiza los productos
    });
}

// Función para renderizar los productos en el HTML
function renderProducts(products) {
  console.log(products);
  let productCounter = 1;
  const lista = document.getElementById("aquiVanLosProductos");
  var index = -1;
  products.forEach((product) => {
    if (product.stock_disponible == 0) {
      return;
    } else {
      index++;
    }
    if (index % 5 == 0) {
      if (index == 0 || (index / 5) % 2 == 0) {
        lista.insertAdjacentHTML('beforeend',
          `<section class="u-clearfix u-section-2" id="sec-6c08">
    <div class="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xl u-sheet-1">
      <div class="data-layout-selected u-clearfix u-expanded-width u-gutter-18 u-layout-custom-sm u-layout-custom-xs u-layout-wrap u-layout-wrap-1">
        <div class="u-gutter-0 u-layout">
          <div class="u-layout-row" id="row-${index}">
          </div>
        </div>
      </div>
    </div>
  </section>`
        );
      } else {
        lista.insertAdjacentHTML('beforeend',
          `<section class="u-clearfix u-section-2 u-palette-1-light-3" id="sec-5350">
    <div class="u-clearfix u-sheet u-valign-middle-xs u-sheet-1">
      <div class="data-layout-selected u-clearfix u-expanded-width u-gutter-18 u-layout-custom-sm u-layout-custom-xs u-layout-wrap u-layout-wrap-1">
        <div class="u-gutter-0 u-layout">
          <div class="u-layout-row" id="row-${index}">  
          </div>
        </div>
      </div>
    </div>
  </section>`
        );
      }
    }

    // Siempre agregar los productos a la última sección abierta
    let agregar = lista.querySelector(`#row-${Math.floor(index / 5) * 5}`);

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

document.getElementById('selectornator').addEventListener('change', function () {
  const selectedOption = this.value;
  sortArticles(selectedOption, productsList);
});


// Obtener todos los enlaces de "Agregar al carrito"
//const addToCartLinks = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cart-counter'); // Elemento donde se muestra el número de artículos

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para agregar al carrito
function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Si ya está en el carrito, incrementa la cantidad
  } else {
    cart.push({ ...product, quantity: 1 }); // Si no está en el carrito, agrégalo
  }
  //alert('Product added to cart!');
  saveCart();
  updateCartCounter(); // Actualizar el contador de artículos
}

// Guardar el carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Actualizar el número de artículos en el carrito
function updateCartCounter() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Sumar las cantidades de todos los productos
  console.log(totalItems);
  if (totalItems > 9) {
    cartCounter.textContent = '9+'; // Si hay más de 9 artículos, mostrar "9+"
  } else {
    cartCounter.innerHTML = totalItems + "&nbsp;"; // Mostrar el número real de artículos
  }
}

// Actualizar el contador de artículos al cargar la página
updateCartCounter();


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
