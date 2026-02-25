import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://ftgtvpkmuucjccjxhfxs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Z3R2cGttdXVjamNjanhoZnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTQ1NDMsImV4cCI6MjA4NzQzMDU0M30.78OFQ0tfqvVvBcMhZ3rFAsO-oar3o4yAVKZrzc3zldk'

const supabase = createClient(supabaseUrl, supabaseKey)

let prodotti = []
let carrello = []

// ----------------------
// CARICA ARTICOLI
// ----------------------
async function caricaProdotti() {
  const { data, error } = await supabase
    .from('ARTICOLI')
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  prodotti = data
  mostraProdotti(prodotti)
}

// ----------------------
// MOSTRA PRODOTTI
// ----------------------
function mostraProdotti(lista) {
  const container = document.getElementById('prodotti')
  container.innerHTML = ''

  lista.forEach(prod => {
    const div = document.createElement('div')
    div.className = 'product-card'
    div.innerHTML = `
      <strong>${prod.codice_articolo}</strong><br>
      ${prod.descrizione}<br><br>
      <input type="number" min="1" value="1" class="qty-input" id="q-${prod.codice_articolo}">
      <button onclick="aggiungi('${prod.codice_articolo}')">Aggiungi</button>
    `
    container.appendChild(div)
  })
}

// ----------------------
// RICERCA
// ----------------------
document.getElementById('search').addEventListener('input', (e) => {
  const valore = e.target.value.toLowerCase()

  const filtrati = prodotti.filter(p =>
    p.codice_articolo.toLowerCase().includes(valore) ||
    p.descrizione.toLowerCase().includes(valore)
  )

  mostraProdotti(filtrati)
})

// ----------------------
// AGGIUNGI AL CARRELLO
// ----------------------
window.aggiungi = function(codice) {

  const prodotto = prodotti.find(p => p.codice_articolo === codice)
  const quantita = parseInt(document.getElementById(`q-${codice}`).value)

  const esistente = carrello.find(p => p.codice_articolo === codice)

  if (esistente) {
    esistente.quantita += quantita
  } else {
    carrello.push({ ...prodotto, quantita })
  }

  aggiornaCarrello()
}

// ----------------------
// AGGIORNA CARRELLO
// ----------------------
function aggiornaCarrello() {
  const div = document.getElementById('carrello')
  div.innerHTML = ''

  carrello.forEach(p => {
    div.innerHTML += `
      <div class="cart-item">
        ${p.codice_articolo} - ${p.descrizione} x ${p.quantita}
        <button onclick="rimuovi('${p.codice_articolo}')">❌</button>
      </div>
    `
  })
}

// ----------------------
// RIMUOVI DAL CARRELLO
// ----------------------
window.rimuovi = function(codice) {
  carrello = carrello.filter(p => p.codice_articolo !== codice)
  aggiornaCarrello()
}

// ----------------------
// INVIA ORDINE
// ----------------------
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

  carrello.forEach(p => {
    testo += `${p.codice_articolo} - ${p.descrizione} - Quantità: ${p.quantita}\n`
  })

  const templateParams = {
    message: testo,
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

// ----------------------
// BLOCCO CONTROLLO SEDE
// ----------------------
const sedeInput = document.getElementById('sede')
const bottoneInvia = document.getElementById('inviaOrdine')

bottoneInvia.disabled = true

sedeInput.addEventListener('input', function() {
  bottoneInvia.disabled = sedeInput.value.trim() === ""
})

// ----------------------
caricaProdotti()
