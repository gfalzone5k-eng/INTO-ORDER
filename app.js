import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 🔹 METTI I TUOI DATI QUI
const supabaseUrl = 'https://ftgtvpkmuucjccjxhfxs.supabase.co'
const supabaseKey = 'https://ftgtvpkmuucjccjxhfxs.supabase.co'

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

document.getElementById('inviaOrdine').addEventListener('click', () => {

  if (carrello.length === 0) {
    alert("Carrello vuoto")
    return
  }

  let testo = "Ordine:\n\n"
  carrello.forEach(p => {
    testo += `${p.name} - Quantità: ${p.quantita}\n`
  })

  const mail = "tua@email.com"
  const subject = "Nuovo Ordine"
  const body = encodeURIComponent(testo)

  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`
})

caricaProdotti()
