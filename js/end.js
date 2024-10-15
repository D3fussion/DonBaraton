
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  fetch('https://don-baraton-api-f9bu.vercel.app/get_order_code', {
    method: 'GET',
    credentials: 'include',  // Include cookies with request
  })
    .then(response => response.json())
    .then(data => {
      console.log(document.cookie);
      console.log("hola");
      console.log(data);
      document.getElementById("code").textContent = data.code;
      document.getElementById("code").href = "https://t.17track.net/en#nums=" + data.code;
    })
    .catch(error => console.error('Error getting the code:', error));

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
