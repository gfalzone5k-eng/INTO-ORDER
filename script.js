let cart = [];
let total = 0;

function handleEnter(event) {
  if (event.key === "Enter") {
    addProduct();
  }
}

async function addProduct() {
  const barcode = document.getElementById("barcodeInput").value.trim();
  if (!barcode) return;

  // 🔍 Cerca prodotto nel database
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("barcode", barcode)
    .single();

  if (error || !product) {
    alert("Prodotto non trovato nel database");
    return;
  }

  const existing = cart.find(item => item.barcode === barcode);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      barcode: product.barcode,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1
    });
  }

  updateCart();
  document.getElementById("barcodeInput").value = "";
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

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="empty">Scansiona un prodotto per iniziare</p>';
  }

  document.getElementById("totalItems").innerText = totalItems;
  document.getElementById("differentItems").innerText = cart.length;
  document.getElementById("totalPrice").innerText = total.toFixed(2);
}

function confirmOrder() {
  if (cart.length === 0) {
    alert("Il carrello è vuoto");
    return;
  }

  alert("Ordine confermato da " + localStorage.getItem("store"));
  cart = [];
  updateCart();
}

let scannerActive = false;
let html5QrCode;

function startScanner() {
  const reader = document.getElementById("reader");

  if (!scannerActive) {
    reader.style.display = "block";
    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        document.getElementById("barcodeInput").value = decodedText;
        addProduct();
        stopScanner();
      }
    );

    scannerActive = true;
  } else {
    stopScanner();
  }
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      document.getElementById("reader").style.display = "none";
      scannerActive = false;
    });
  }
}
