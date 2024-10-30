
// Update cart display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});

// Add to cart event listeners
document.querySelectorAll('.addCart').forEach(button => {
    button.addEventListener('click', function() {
        const productElement = button.closest('.product');
        const productId = productElement.getAttribute('data-id');
        const productName = productElement.querySelector('h2').innerText;
        const productPrice = parseInt(productElement.querySelector('.price').innerText.replace('₹', '').replace(' per kg', ''));
        const productImage = productElement.querySelector('img').src; // Get image source

        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = {
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage // Store image source in cart
            };
        }

        totalAmount += productPrice;
        saveCart();
        updateCart();
    });
});

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', totalAmount.toString());
}



document.addEventListener('DOMContentLoaded', function () {
    updateCart();
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    document.querySelectorAll('.addCart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Attach proceedToPayment to the "Proceed to Payment" button
    const proceedButton = document.getElementById('proceed-button');
    if (proceedButton) {
        proceedButton.addEventListener('click', proceedToPayment);
    }
});

// Load cart data from localStorage or initialize empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

// Function to update the cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return; // Exit if cart display is not found

    cartItems.innerHTML = ''; // Clear previous items
    let cartCount = 0;

    for (const id in cart) {
        const item = cart[id];
        cartItems.innerHTML += `
            <tr>
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-secondary me-2" onclick="changeQuantity('${id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary ms-2" onclick="changeQuantity('${id}', 1)">+</button>
                    </div>
                </td>
                <td class="align-middle">₹${item.price}</td>
                <td class="align-middle">₹${item.price * item.quantity}</td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-danger" onclick="removeItem('${id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        cartCount += item.quantity;
    }

    // Display empty cart message if no items in cart
    if (cartCount === 0) {
        cartItems.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <p class="text-muted">Your cart is empty</p>
                </td>
            </tr>
        `;
    }

    // Calculate delivery charges
    let deliveryCharge = totalAmount < 1000 ? 50 : 0;
    const finalAmount = totalAmount + deliveryCharge;

    // Update HTML elements with totals
    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('cart-total').innerText = `₹${totalAmount}`;
    document.getElementById('delivery-charge').innerText = `₹${deliveryCharge}`;
    document.getElementById('final-amount').innerText = `₹${finalAmount}`;
}

// Function to handle adding to cart
function addToCart(event) {
    const productElement = event.target.closest('.product');
    const productId = productElement.getAttribute('data-id');
    const productName = productElement.querySelector('h2').innerText;
    const productPrice = parseInt(productElement.querySelector('.price').innerText.replace('₹', '').replace(' per kg', ''));
    const productImage = productElement.querySelector('img').src;

    if (cart[productId]) {
        cart[productId].quantity++;
    } else {
        cart[productId] = {
            name: productName,
            price: productPrice,
            quantity: 1,
            image: productImage
        };
    }

    totalAmount += productPrice;
    saveCart();
    updateCart();
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', totalAmount.toString());
}

// Function to change item quantity
function changeQuantity(productId, change) {
    const item = cart[productId];
    if (item) {
        if (change === 1) {
            item.quantity++;
            totalAmount += item.price;
        } else if (change === -1 && item.quantity > 1) {
            item.quantity--;
            totalAmount -= item.price;
        } else if (change === -1 && item.quantity === 1) {
            removeItem(productId);
            return;
        }
        saveCart();
        updateCart();
    }
}

// Function to remove item from cart
function removeItem(productId) {
    if (cart[productId]) {
        totalAmount -= cart[productId].price * cart[productId].quantity;
        delete cart[productId];
        saveCart();
        updateCart();
    }
}

// Function to handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const name = document.getElementById('name').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
    }

    alert(`Thank you, ${name}! Your order has been placed successfully using ${paymentMethod.value}.`);

    // Clear cart data and redirect
    localStorage.removeItem('cart');
    localStorage.removeItem('totalAmount');
    window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('proceed-button').addEventListener('click', proceedToPayment);
});

// Form validation
function validateForm() {
    let isValid = true;

    const name = document.getElementById('name');
    if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
    } else {
        clearError(name);
    }

    const mobile = document.getElementById('mobile');
    if (!/^[0-9]{10}$/.test(mobile.value)) {
        showError(mobile, 'Please enter a valid 10-digit mobile number');
        isValid = false;
    } else {
        clearError(mobile);
    }

    const pincode = document.getElementById('pincode');
    if (!/^[0-9]{6}$/.test(pincode.value)) {
        showError(pincode, 'Please enter a valid 6-digit pincode');
        isValid = false;
    } else {
        clearError(pincode);
    }

    const address = document.getElementById('address');
    if (address.value.trim() === '') {
        showError(address, 'Address is required');
        isValid = false;
    } else {
        clearError(address);
    }

    const area = document.getElementById('area');
    if (area.value.trim() === '') {
        showError(area, 'Area is required');
        isValid = false;
    } else {
        clearError(area);
    }

    const town = document.getElementById('town');
    if (town.value.trim() === '') {
        showError(town, 'Town is required');
        isValid = false;
    } else {
        clearError(town);
    }

    const state = document.getElementById('state');
    if (state.value.trim() === '') {
        showError(state, 'State is required');
        isValid = false;
    } else {
        clearError(state);
    }

    return isValid;
}


function proceedToPayment() {
    if (validateForm()) {
        // Hide checkout form section
        const checkoutLayout = document.querySelector('.checkout-layout');
        if (checkoutLayout) {
            checkoutLayout.style.display = 'none';
        }

        // Show payment methods section
        const paymentMethods = document.getElementById('payment-methods');
        if (paymentMethods) {
            paymentMethods.style.display = 'block';
        }

        // Update progress steps
        const steps = document.querySelectorAll('.checkout-progress .step');
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.remove('active');
            }
            if (index === 1) {
                step.classList.add('active');
            }
        });
    } else {
        alert('Please fill in all required fields correctly.');
    }
}

// Add event listener to the proceed button
document.addEventListener('DOMContentLoaded', function() {
    const proceedButton = document.getElementById('proceed-button');
    if (proceedButton) {
        proceedButton.addEventListener('click', proceedToPayment);
    }
});


function makePayment() {
    // Verify payment method is selected
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return;
    }

    // Hide payment methods section
    const paymentMethods = document.getElementById('payment-methods');
    if (paymentMethods) {
        paymentMethods.style.display = 'none';
    }

    // Show review section
    const reviewSection = document.getElementById('review-section');
    if (reviewSection) {
        reviewSection.style.display = 'block';
    }

    // Populate order summary with images
    const orderSummaryItems = document.getElementById('order-summary-items');
    orderSummaryItems.innerHTML = ''; // Clear previous items

    let subtotal = 0;
    for (const id in cart) {
        const item = cart[id];
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        orderSummaryItems.innerHTML += `
            <tr>
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" 
                             style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td class="align-middle">₹${item.price}</td>
                <td class="align-middle">${item.quantity}</td>
                <td class="align-middle">₹${itemTotal}</td>
            </tr>
        `;
    }

    // Calculate delivery charge
    const deliveryCharge = subtotal < 1000 ? 50 : 0;

    // Calculate final amount
    const finalAmount = subtotal + deliveryCharge;

    

    // Set delivery date (3 days from today)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    document.getElementById('delivery-date').innerText = deliveryDate.toDateString();

    // Update total amount in review
    document.getElementById('final-amount-review').innerText = `₹${finalAmount}`;



    // Update progress steps
    const steps = document.querySelectorAll('.checkout-progress .step');
        steps.forEach((step, index) => {
            if (index === 1) {
                step.classList.remove('active');
            }
            if (index === 2) {
                step.classList.add('active');
            }
        });
}


// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const proceedButton = document.getElementById('proceed-button');
    if (proceedButton) {
        proceedButton.addEventListener('click', proceedToPayment);
    }

    const makePaymentButton = document.getElementById('proceed-payment');
    if (makePaymentButton) {
        makePaymentButton.addEventListener('click', makePayment);
    }

    // Add confirm order button listener
    const confirmOrderButton = document.getElementById('confirm-order');
    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', function() {
            alert('Thank you for your order! Your items will be delivered soon.');
            // Clear cart and redirect to home page
            localStorage.removeItem('cart');
            localStorage.removeItem('totalAmount');
            window.location.href = 'home.html';
        });
    }
});


// Function to show error messages
function showError(input, message) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message') || document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerText = message;
    if (!formControl.querySelector('.error-message')) {
        formControl.appendChild(errorElement);
    }
    input.className = 'form-control is-invalid';
}

// Function to clear error messages
function clearError(input) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message');
    if (errorElement) {
        formControl.removeChild(errorElement);
    }
    input.className = 'form-control';
}

// Navigate to checkout
function checkout() {
    if (Object.keys(cart).length === 0) {
        alert('Your cart is empty!');
        return;
    }

    window.location.href = "check.html"; // Redirect to checkout page
}

// Clear the cart
function clearCart() {
    cart = {};
    totalAmount = 0;
    saveCart();
    updateCart();
}

// Initialize cart on load
updateCart();
