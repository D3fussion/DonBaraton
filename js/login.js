

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
            if (data.logged_in) {
                window.location.href = 'account_details.html';  // Redirect if logged in
            }
        })
        .catch(error => console.error('Error checking session:', error));
});

document.querySelector('.u-form-submit a').addEventListener('click', function (event) {
    event.preventDefault();  // Prevent default form action

    // Get email and password values
    const email = document.getElementById('email-d781').value;
    const password = document.getElementById('text-2148').value;

    // Send a POST request to the backend login API
    fetch('https://don-baraton-api-f9bu.vercel.app/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
        credentials: 'include', // Ensures cookies are sent with the request
    })
        .then(response => response.json())
        .then(data => {
            console.log(document.cookie);
            console.log(data);
            if (data.message === 'Login successful') {
                // Redirect to account details page on successful login
                console.log(data);
                window.location.href = 'account_details.html';
            } else {
                alert('Invalid email or password');
            }
        })
        .catch(error => console.error('Error:', error));
});

// Check if the user is already logged in and redirect



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
