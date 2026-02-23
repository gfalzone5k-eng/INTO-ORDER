// 🔑 Connessione Supabase
const supabaseUrl = "https://ftgtvpkmuucjccjxhfxs.supabase.co";
const supabaseKey = "sb_publishable_h5_zYHOK6BrqrSSaHQlcDg_JEiqYgZK";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
let cart = [];
let total = 0;

function handleEnter(event) {
  if (event.key === "Enter") {
    addProduct();
  }
}

async function addProduct() {
  const input = document.getElementById("barcodeInput").value.trim();
  if (!input) return;

  let product = null;

  // Se è tutto numero → cerca per barcode
  if (/^\d+$/.test(input)) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", input)
      .single();

    if (!error) product = data;
  } else {
    // Altrimenti cerca per nome (contiene testo)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${input}%`)
      .limit(1);

    if (!error && data.length > 0) product = data[0];
  }

  if (!product) {
    alert("Prodotto non trovato");
    return;
  }

  const existing = cart.find(item => item.barcode === product.barcode);

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
  let total = 0;

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
