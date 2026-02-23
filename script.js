// 🔑 CONFIGURA QUI
const supabaseUrl = "https://ftgtvpkmuucjccjxhfxs.supabase.co";
const supabaseKey = "sb_publishable_h5_zYHOK6BrqrSSaHQlcDg_JEiqYgZK";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let cart = [];
let selectedProduct = null;

// 🔎 RICERCA LIVE
async function searchProducts() {
  const input = document.getElementById("barcodeInput").value.trim();
  const resultsDiv = document.getElementById("searchResults");

  if (!input || input.includes("\n")) {
    resultsDiv.innerHTML = "";
    return;
  }

  const { data } = await supabase
    .from("products")
    .select("*")
    .or(`barcode.ilike.%${input}%,name.ilike.%${input}%`)
    .limit(5);

  resultsDiv.innerHTML = "";

  data?.forEach(product => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${product.name}</strong><br>
      ${product.barcode} - €${product.price}
    `;
    div.onclick = () => selectProduct(product);
    resultsDiv.appendChild(div);
  });
}

function selectProduct(product) {
  selectedProduct = product;
  document.getElementById("barcodeInput").value = product.name;
  document.getElementById("searchResults").innerHTML = "";
}

// ➕ AGGIUNTA
async function addSelectedProduct() {
  const input = document.getElementById("barcodeInput").value.trim();
  const quantity = parseInt(document.getElementById("quantityInput").value);

  if (!input) return;

  if (input.includes("\n")) {
    const barcodes = input.split("\n").map(b => b.trim()).filter(b => b);
    for (let code of barcodes) {
      await addByBarcode(code, 1);
    }
    resetInput();
    return;
  }

  if (selectedProduct) {
    addToCart(selectedProduct, quantity);
    resetInput();
    return;
  }

  await addByBarcode(input, quantity);
  resetInput();
}

async function addByBarcode(barcode, quantity) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("barcode", barcode)
    .single();

  if (data) addToCart(data, quantity);
}

function addToCart(product, quantity) {
  const existing = cart.find(item => item.barcode === product.barcode);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      barcode: product.barcode,
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity
    });
  }

  updateCart();
}

function resetInput() {
  selectedProduct = null;
  document.getElementById("barcodeInput").value = "";
  document.getElementById("quantityInput").value = 1;
  document.getElementById("searchResults").innerHTML = "";
}

// 🗑 RIMOZIONE
function removeProduct(barcode) {
  cart = cart.filter(item => item.barcode !== barcode);
  updateCart();
}

// ✏️ MODIFICA QTA
function changeQuantity(barcode, newQty) {
  const product = cart.find(item => item.barcode === barcode);
  if (product) {
    product.quantity = parseInt(newQty);
    updateCart();
  }
}

// 🔄 AGGIORNA CARRELLO
function updateCart() {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  let totalItems = 0;
  let total = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    total += item.quantity * item.price;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.name}</strong><br>
      ${item.barcode}<br>
      Qta:
      <input type="number"
             value="${item.quantity}"
             min="1"
             onchange="changeQuantity('${item.barcode}', this.value)"
             style="width:60px;">
      - €${(item.price * item.quantity).toFixed(2)}
      <span class="remove-btn" onclick="removeProduct('${item.barcode}')">🗑</span>
    `;
    cartList.appendChild(li);
  });

  document.getElementById("totalItems").innerText = totalItems;
  document.getElementById("differentItems").innerText = cart.length;
  document.getElementById("totalPrice").innerText = total.toFixed(2);
}
