var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');
const themeIcon = document.querySelector('.theme-icon');

// Open cart tab
cartIcon.addEventListener('click', () => {
  cartTab.classList.add('cart-tab-active');
});

// Close cart tab
closeBtn.addEventListener('click', () => {
  cartTab.classList.remove('cart-tab-active');
});

// Toggle dark / light theme (It changes the theme of the website)
const themeIconEl = themeIcon.querySelector('i');

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeIconEl.classList.replace('fa-moon', 'fa-sun');
}

themeIcon.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeIconEl.classList.toggle('fa-moon', !isDark);
  themeIconEl.classList.toggle('fa-sun', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('mobile-menu-active');
});
// clicking hamburger icon changes it to close icon and vice versa
hamburger.addEventListener('click', () => {
  bars.classList.toggle('fa-bars');
  bars.classList.toggle('fa-xmark');
});

let productList = [];
let cartProducts = [];

// Update total price and quantity in cart
const updateTotal = () => {

  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll('.item').forEach((item) => {
    const quantity = parseInt(item.querySelector('.quantity-value').textContent);
    const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));
    totalPrice += price;
    totalQuantity += quantity;
  });
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
}

// Display product cards
const showCards = () => {
  productList.forEach((product) => {

    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');

    orderCard.innerHTML = `
            <img src="${product.image}" alt="">
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn card-btn">Add to Cart</a>`;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector('.card-btn');
    cardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product);
    });

  });
}

// Add product to cart
const addToCart = (product) => {

  const existingProduct = cartProducts.find((item) => item.id === product.id);
  if (existingProduct) {
    alert('Product already in cart');
    return;
  }
  cartProducts.push(product); // Add product to cart array

  let quantity = 1;
  let price = parseFloat(product.price.replace('$', ''));

  const cartItem = document.createElement('div');
  cartItem.classList.add('item');

  cartItem.innerHTML = `
      <div class="item-image">
          <img src="${product.image}">
      </div>
      <div class="detail">
          <h4>${product.name}</h4>
          <h4 class="item-total">${product.price}</h4>
      </div>
      <div class="flex">
          <a href="#" class="quantity-btn minus">
              <i class="fa-solid fa-minus"></i>
          </a>
          <h4 class="quantity-value">${quantity}</h4>
          <a href="#" class="quantity-btn plus">
              <i class="fa-solid fa-plus"></i>
          </a>
      </div>
    `;
  cartList.appendChild(cartItem);
  updateTotal();

  const plusBtn = cartItem.querySelector('.plus');
  const minusBtn = cartItem.querySelector('.minus');
  const quantityValue = cartItem.querySelector('.quantity-value');
  const itemTotal = cartItem.querySelector('.item-total');

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    const totalPrice = (price * quantity).toFixed(2);
    itemTotal.textContent = `$${totalPrice}`;
    updateTotal();
  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      const totalPrice = (price * quantity).toFixed(2);
      itemTotal.textContent = `$${totalPrice}`;
      updateTotal();
    }
    else {
      cartItem.classList.add('slide-out');
      setTimeout(() => {
        cartItem.remove();
        cartProducts = cartProducts.filter((item) => item.id !== product.id);
        updateTotal();
      }, 300);
    }
  });

}

// Initialize app by fetching product data and displaying cards
const initApp = () => {
  fetch("products.json").then
    (response => response.json()).then
    (data => {
      productList = data;
      console.log(productList);
      showCards();
    })
}

initApp();