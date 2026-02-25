import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 🔹 METTI I TUOI DATI QUI
const supabaseUrl = 'https://ftgtvpkmuucjccjxhfxs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Z3R2cGttdXVjamNjanhoZnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTQ1NDMsImV4cCI6MjA4NzQzMDU0M30.78OFQ0tfqvVvBcMhZ3rFAsO-oar3o4yAVKZrzc3zldk'

const supabase = createClient(supabaseUrl, supabaseKey)

let prodotti = []
let carrello = []

async function caricaProdotti() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  prodotti = data
  mostraProdotti(prodotti)
}

function mostraProdotti(lista) {
  const container = document.getElementById('prodotti')
  container.innerHTML = ''

  lista.forEach(prod => {
    const div = document.createElement('div')
    div.className = 'product-card'
    div.innerHTML = `
      <strong>${prod.name}</strong><br>
      € ${Number(prod.price).toFixed(2)}<br>
      Barcode: ${prod.barcode}<br><br>
      <input type="number" min="1" value="1" class="qty-input" id="q-${prod.id}">
      <button onclick="aggiungi(${prod.id})">Aggiungi</button>
    `
    container.appendChild(div)
  })
}

document.getElementById('search').addEventListener('input', (e) => {
  const valore = e.target.value.toLowerCase()
  const filtrati = prodotti.filter(p =>
    p.name.toLowerCase().includes(valore) ||
    p.barcode.includes(valore)
  )
  mostraProdotti(filtrati)
})

window.aggiungi = function(id) {
  const prodotto = prodotti.find(p => p.id === id)
  const quantita = parseInt(document.getElementById(`q-${id}`).value)

  const esistente = carrello.find(p => p.id === id)

  if (esistente) {
    esistente.quantita += quantita
  } else {
    carrello.push({ ...prodotto, quantita })
  }

  aggiornaCarrello()
}

function aggiornaCarrello() {
  const div = document.getElementById('carrello')
  const totaleDiv = document.getElementById('totale')

  div.innerHTML = ''
  let totale = 0

  carrello.forEach(p => {
    totale += p.price * p.quantita

    div.innerHTML += `
      <div class="cart-item">
        ${p.name} x ${p.quantita}
        <button onclick="rimuovi(${p.id})">❌</button>
      </div>
    `
  })

  totaleDiv.innerHTML = `Totale: € ${totale.toFixed(2)}`
}

window.rimuovi = function(id) {
  carrello = carrello.filter(p => p.id !== id)
  aggiornaCarrello()
}

document.getElementById('inviaOrdine').addEventListener('click', function() {

  const sede = document.getElementById('sede').value.trim()

  if (sede === "") {
    alert("Inserisci la sede prima di inviare l'ordine")
    return
  }

  if (carrello.length === 0) {
    alert("Carrello vuoto")
    return
  }

  let testo = ""
  let totale = 0

  carrello.forEach(p => {
    testo += `${p.name} - Quantità: ${p.quantita}\n`
    totale += p.price * p.quantita
  })

  const templateParams = {
    message: testo,
    totale: totale.toFixed(2),
    sede: sede
  }

  emailjs.send(
    "service_utzs75y",
    "template_1joanb4",
    templateParams
  )
  .then(function() {
    alert("Ordine inviato con successo ✅")
    carrello = []
    document.getElementById('sede').value = ""
    aggiornaCarrello()
  })
  .catch(function(error) {
    alert("Errore invio ordine ❌")
    console.log(error)
  })

})

caricaProdotti()
