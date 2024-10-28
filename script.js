// Get elements for cart count and orders list
const cartCountElement = document.getElementById("cartCount");
const ordersList = document.getElementById("ordersList");
const totalPriceElement = document.getElementById("totalPrice");

// Function to get the cart from local storage or initialize it
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Function to save the cart to local storage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to update the notification count based on the cart content
function updateCartCount() {
    const cart = getCart();
    cartCountElement.textContent = cart.length; // Update count to number of items in cart
}

// Function to add an item to the cart and update the cart count
function addToCart(itemName, itemPrice) {
    const cart = getCart();
    cart.push({ name: itemName, price: itemPrice });
    saveCart(cart);
    updateCartCount();
}

// Function to handle button click events on the "add to cart" buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function() {
            const itemElement = this.closest(".menu-item");
            const itemName = itemElement.querySelector("h3").textContent;
            const itemPrice = parseFloat(itemElement.querySelector("p").textContent.replace("$", ""));
            addToCart(itemName, itemPrice);
        });
    });
}

// Initialize cart count on page load
updateCartCount();

// Set up event listeners for "add to cart" buttons on both pages
setupAddToCartButtons();

// Load items and populate orders page if on orders.html
document.addEventListener("DOMContentLoaded", () => {
    if (ordersList) {
        populateOrdersPage();
    }
});

// Function to populate the orders list on orders.html
function populateOrdersPage() {
    const cartItems = getCart();
    let totalPrice = 0;

    // Display each item in the orders list
    cartItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.className = "order-item";
        listItem.innerHTML = `
            <span class="order-name">${item.name}</span>
            <span class="order-price">$${item.price.toFixed(2)}</span>
            <span class="remove-item" data-index="${index}">✖</span>
        `;
        ordersList.appendChild(listItem);

        // Calculate total price
        totalPrice += item.price;
    });

    // Display total price
    totalPriceElement.textContent = totalPrice.toFixed(2);

    // Attach event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", (event) => {
            const itemIndex = event.target.getAttribute("data-index");
            removeItemFromCart(itemIndex);
        });
    });
}

// Function to remove item from cart and update orders list
function removeItemFromCart(index) {
    const cartItems = getCart();
    cartItems.splice(index, 1); // Remove item from cart
    saveCart(cartItems); // Update localStorage

    // Clear and re-populate orders list
    ordersList.innerHTML = "";
    populateOrdersPage(); // Refresh list
    updateCartCount(); // Update notification count
}

// Setup for Checkout Button
function setupCheckoutButton() {
    const checkoutButton = document.getElementById("checkoutButton");
    
    checkoutButton.addEventListener("click", function() {
        const cart = getCart(); // Get current cart items

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to your cart before checking out.");
            return; // Prevent further actions if the cart is empty
        }

        // Clear the cart from local storage
        localStorage.removeItem("cart");
        updateCartCount(); // Update the cart count in the UI

        // Clear the orders list on the page
        ordersList.innerHTML = ""; // Clear the orders displayed on the page
        totalPriceElement.textContent = "0.00"; // Reset total price

        // Display thank you message
        alert("Thank you for your purchase!");
        
        // Optionally, redirect to a confirmation page or reset the orders page
        // window.location.href = "confirmation.html"; // Uncomment if you want to redirect
    });
}

// Call setupCheckoutButton function to attach event listener
setupCheckoutButton();
