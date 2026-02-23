const supabaseUrl = 'https://ftgtvpkmuucjccjxhfxs.supabase.co'
const supabaseKey = 'sb_publishable_h5_zYHOK6BrqrSSaHQlcDg_JEiqYgZK'

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

async function caricaDati() {
  const { data, error } = await supabase
    .from('nome_tabella')
    .select('*')

  if (error) {
    console.error('Errore:', error)
    return
  }

  const lista = document.getElementById('lista')

  data.forEach(item => {
    const li = document.createElement('li')
    li.textContent = JSON.stringify(item)
    lista.appendChild(li)
  })
}

caricaDati()
