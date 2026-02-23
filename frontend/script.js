let cart = [];
let total = 0;

function addProduct() {
  const barcode = document.getElementById("barcodeInput").value;
  if (!barcode) return;

  // Simulazione prodotto
  quickAdd(barcode, "Prodotto generico", 1.00);

  document.getElementById("barcodeInput").value = "";
}

function quickAdd(barcode, name, price) {
  const existing = cart.find(item => item.barcode === barcode);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ barcode, name, price, quantity: 1 });
  }

  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  let totalItems = 0;
  total = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    total += item.quantity * item.price;

    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`;
    cartList.appendChild(li);
  });

  document.getElementById("totalItems").innerText = totalItems;
  document.getElementById("differentItems").innerText = cart.length;
  document.getElementById("totalPrice").innerText = total.toFixed(2);
}
