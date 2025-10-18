document.addEventListener('DOMContentLoaded', () => {
  let cart = {};

  const cartBtn = document.getElementById('cart-btn');
  const cartBox = document.getElementById('cart-box');
  const cartCount = document.getElementById('cart-count');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBackdrop = document.getElementById('checkout-backdrop');
  const closeCheckoutBtn = document.getElementById('close-checkout');
  const checkoutItemsEl = document.getElementById('checkout-items');
  const checkoutTotalEl = document.getElementById('checkout-total');
  const custName = document.getElementById('cust-name');
  const custPhone = document.getElementById('cust-phone');
  const custEmail = document.getElementById('cust-email');
  const custAddress = document.getElementById('cust-address');
  const deliveryMethod = document.getElementById('delivery-method');
  const placeOrderBtn = document.getElementById('place-order');

  function updateCartCount() {
    const totalQty = Object.values(cart).reduce((a, i) => a + i.quantity, 0);
    cartCount.textContent = totalQty;
  }

  function updateCartDisplay() {
    if (Object.keys(cart).length === 0) {
      cartItemsEl.innerHTML = 'No items yet.';
      cartTotalEl.textContent = 'Total: R0.00';
      return;
    }

    cartItemsEl.innerHTML = '';
    let total = 0;
    for (const id in cart) {
      const item = cart[id];
      const div = document.createElement('div');
      div.textContent = `${item.name} x${item.quantity} — R${(item.price * item.quantity).toFixed(2)}`;
      cartItemsEl.appendChild(div);
      total += item.price * item.quantity;
    }
    cartTotalEl.textContent = `Total: R${total.toFixed(2)}`;
  }

  function updateCheckoutDisplay() {
    checkoutItemsEl.innerHTML = '';
    let total = 0;
    for (const id in cart) {
      const item = cart[id];
      const div = document.createElement('div');
      div.textContent = `${item.name} x${item.quantity} — R${(item.price * item.quantity).toFixed(2)}`;
      checkoutItemsEl.appendChild(div);
      total += item.price * item.quantity;
    }
    checkoutTotalEl.textContent = `Total: R${total.toFixed(2)}`;
  }

  document.querySelectorAll('.add-to-cart').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const name = el.dataset.name;
      const price = parseFloat(el.dataset.price);
      if (!cart[id]) cart[id] = { name, price, quantity: 1 };
      else cart[id].quantity++;
      updateCartCount();
      updateCartDisplay();
    });
  });

  cartBtn.addEventListener('click', () => cartBox.classList.toggle('visible'));
  clearCartBtn.addEventListener('click', () => { cart = {}; updateCartCount(); updateCartDisplay(); });

  checkoutBtn.addEventListener('click', () => {
    checkoutBackdrop.style.display = 'block';
    updateCheckoutDisplay();
  });

  closeCheckoutBtn.addEventListener('click', () => {
    checkoutBackdrop.style.display = 'none';
  });

  placeOrderBtn.addEventListener('click', async () => {
    if (!custName.value || !custPhone.value || !custAddress.value) {
      alert('Please fill in your name, phone, and address.');
      return;
    }

    const selectedPay = document.querySelector('input[name="payment-method"]:checked').value;
    const orderItems = Object.values(cart);
    const total = orderItems.reduce((a, i) => a + i.price * i.quantity, 0);

    const orderData = {
      customer: {
        name: custName.value,
        phone: custPhone.value,
        email: custEmail.value,
        address: custAddress.value
      },
      delivery: deliveryMethod.value,
      payMethod: selectedPay,
      items: orderItems,
      total: total,
      createdAt: new Date().toISOString(),
      status: selectedPay === 'cash' ? 'Pending (Cash on Delivery)' : 'Awaiting Bank Transfer'
    };

    try {
         const res = await fetch('https://aquapurified.onrender.com/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});



      const data = await res.json();
      if (res.ok) {
        alert(`✅ Order placed successfully! Your Order ID: ${data.id}`);
        cart = {};
        updateCartCount();
        updateCartDisplay();
        checkoutBackdrop.style.display = 'none';
      } else {
        alert('❌ Error placing order: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network or server error.');
    }
  });
});















