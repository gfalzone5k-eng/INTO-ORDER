const supabaseUrl = 'https://TUO-PROGETTO.supabase.co'
const supabaseKey = 'TUA_ANON_KEY'

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

async function caricaDati() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  console.log(data) // 👈 guarda qui nella console

  const lista = document.getElementById('lista')
  lista.innerHTML = ''

  data.forEach(prod => {
    const li = document.createElement('li')
    li.innerHTML = `
      <strong>${prod.name}</strong> - €${prod.price}
    `
    lista.appendChild(li)
  })
}

caricaDati()
