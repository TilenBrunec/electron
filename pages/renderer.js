const objave = [
  {
    avtor: "Ana Novak",
    vsebina: "Danes je bil lep dan na fakulteti!",
    datum: "2025-01-15",
    likes: 5,
    slika: null,
    kategorija: "Splošno",
  },
  {
    avtor: "Miha Horvat",
    vsebina: "Pravkar sem dokončal projekt za IČR",
    datum: "2025-02-03",
    likes: 12,
    slika: null,
    kategorija: "Tehnologija",
  },
  {
    avtor: "Sara Kovač",
    vsebina: "Kdo gre jutri na kavo?",
    datum: "2025-03-10",
    likes: 8,
    slika: null,
    kategorija: "Lifestyle",
  },
]

let trenutneObjave = []

function prikaziObjave(seznam) {
  const container = document.getElementById("posts-container")
  container.innerHTML = ""

  seznam.forEach((objava) => {
    const inicialka = objava.avtor ? objava.avtor.charAt(0).toUpperCase() : "?"
    const div = document.createElement("div")
    div.className = "objava"
    div.innerHTML = `
      <div class="objava-header">
        <div class="avatar">${inicialka}</div>
        <div class="objava-info">
          <span class="avtor">${objava.avtor}</span>
          <div class="meta">
            <span class="datum">${objava.datum}</span>
            <span class="kategorija">${objava.kategorija || ''}</span>
          </div>
        </div>
      </div>
      <p class="vsebina">${objava.vsebina}</p>
      <img class="objava-slika" src="app://images/post.jpg" alt="slika"/>
      <div class="objava-footer">
        <span class="likes-icon">❤</span>
        <span>${objava.likes || 0} likes</span>
      </div>
    `
    container.appendChild(div)
  })
}

function posodobiSortDir(atribut) {
  const sortDir = document.getElementById('sort-dir')
  sortDir.innerHTML = ''

  if (atribut === 'avtor' || atribut === 'kategorija') {
    sortDir.innerHTML = `
      <option value="asc">A → Ž</option>
      <option value="desc">Ž → A</option>
    `
  } else if (atribut === 'likes') {
    sortDir.innerHTML = `
      <option value="desc">Največ → Najmanj</option>
      <option value="asc">Najmanj → Največ</option>
    `
  } else if (atribut === 'vsebina') {
    sortDir.innerHTML = `
      <option value="asc">Kratka → Dolga</option>
      <option value="desc">Dolga → Kratka</option>
    `
  } else if (atribut === 'datum') {
    sortDir.innerHTML = `
      <option value="desc">Najnovejši → Najstarejši</option>
      <option value="asc">Najstarejši → Najnovejši</option>
    `
  } else {
    sortDir.innerHTML = `
      <option value="asc">Naraščajoče</option>
      <option value="desc">Padajoče</option>
    `
  }
}

function filtrirajInSortiraj() {
  const vzorec = document.getElementById('filter-input').value
  const atribut = document.getElementById('filter-attr').value
  const caseSensitive = document.getElementById('case-sensitive').checked
  const sortAttr = document.getElementById('sort-attr').value
  const sortDir = document.getElementById('sort-dir').value

  let rezultat = [...trenutneObjave]


  if (vzorec) {
    rezultat = rezultat.filter(o => {
      const vrednost = String(o[atribut] || '')
      const v = caseSensitive ? vrednost : vrednost.toLowerCase()
      const p = caseSensitive ? vzorec : vzorec.toLowerCase()
      return v.includes(p)
    })
  }


  if (sortAttr) {
    rezultat.sort((a, b) => {
      if (sortAttr === 'vsebina') {
        const av = String(a[sortAttr] || '').length
        const bv = String(b[sortAttr] || '').length
        return sortDir === 'asc' ? av - bv : bv - av
      }

      const av = a[sortAttr]
      const bv = b[sortAttr]

      if (!isNaN(av) && !isNaN(bv)) {
        return sortDir === 'asc' ? av - bv : bv - av
      }

      const cmp = String(av || '').localeCompare(String(bv || ''))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }

  prikaziObjave(rezultat)
}

document.getElementById('filter-input').addEventListener('input', filtrirajInSortiraj)
document.getElementById('filter-attr').addEventListener('change', filtrirajInSortiraj)
document.getElementById('case-sensitive').addEventListener('change', filtrirajInSortiraj)
document.getElementById('sort-attr').addEventListener('change', () => {
  const atribut = document.getElementById('sort-attr').value
  posodobiSortDir(atribut)
  filtrirajInSortiraj()
})
document.getElementById('sort-dir').addEventListener('change', filtrirajInSortiraj)

document.getElementById("btn-settings").addEventListener("click", () => {
  window.appAPI.openSettings()
})

window.appAPI.onThemeChanged((theme) => {
  document.body.className = theme
  document.getElementById("theme-css").href = `../styles/${theme}.css`
})

document.getElementById("btn-load").addEventListener("click", async () => {
  const filePath = await window.appAPI.openFileDialog()
  if (!filePath) return

  const data = await window.appAPI.loadJsonFile(filePath)
  if (!data || !Array.isArray(data) || !data[0].avtor) {
    alert("Napaka pri nalaganju podatkov")
    return
  }
  trenutneObjave = data
  window.appAPI.saveLastPath(filePath)
  filtrirajInSortiraj()
})

async function init() {
  posodobiSortDir(document.getElementById('sort-attr').value)
  const lastPath = await window.appAPI.getLastPath()
  if (lastPath) {
    const data = await window.appAPI.loadJsonFile(lastPath)
    if (data && Array.isArray(data) && data[0].avtor) {
      trenutneObjave = data
      prikaziObjave(data)
      return
    }
  }
  trenutneObjave = objave
  prikaziObjave(objave)
}

init()