// Aspetta che la pagina sia completamente caricata
document.addEventListener("DOMContentLoaded", async () => {

  const supabaseUrl = 'https://TUO-PROGETTO.supabase.co'
  const supabaseKey = 'TUA_ANON_PUBLIC_KEY'

  // Crea client Supabase
  const { createClient } = window.supabase
  const supabase = createClient(supabaseUrl, supabaseKey)

  async function caricaDati() {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error) {
      console.error("Errore Supabase:", error)
      return
    }

    console.log("Dati ricevuti:", data)

    const lista = document.getElementById('lista')
    lista.innerHTML = ''

    if (!data || data.length === 0) {
      lista.innerHTML = '<li>Nessun prodotto trovato</li>'
      return
    }

    data.forEach(prod => {
      const li = document.createElement('li')
      li.innerHTML = `
        <strong>${prod.name}</strong><br>
        Prezzo: €${Number(prod.price).toFixed(2)}<br>
        Barcode: ${prod.barcode}
      `
      lista.appendChild(li)
    })
  }

  caricaDati()
})
