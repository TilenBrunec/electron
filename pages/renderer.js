
const objave = [
  {
    avtor: "Ana Novak",
    vsebina: "Danes je bil lep dan na fakulteti!",
    datum: "2025-01-15",
    slika: null,
    vidnost: "javno"
  },
  {
    avtor: "Miha Horvat",
    vsebina: "Pravkar sem dokončal projekt za IČR ",
    datum: "2025-02-03",
    slika: null,
    vidnost: "prijatelji"
  },
  {
    avtor: "Sara Kovač",
    vsebina: "Kdo gre jutri na kavo?",
    datum: "2025-03-10",
    slika: null,
    vidnost: "javno"
  }
]

function prikaziObjave(seznam) {
  const container = document.getElementById('posts-container')
  container.innerHTML = ''

  seznam.forEach(objava => {
    const div = document.createElement('div')
    div.className = 'objava'
    div.innerHTML = `
      <div class="objava-header">
        <span class="avtor">${objava.avtor}</span>
        <span class="datum">${objava.datum}</span>
        <span class="vidnost">${objava.vidnost}</span>
      </div>
      <p class="vsebina">${objava.vsebina}</p>
    `
    container.appendChild(div)
  })
}

document.getElementById('btn-settings').addEventListener('click', () => {
  window.appAPI.openSettings()
})

window.appAPI.onThemeChanged((theme) => {
  document.body.className = theme
  document.getElementById('theme-css').href = `../styles/${theme}.css`
})

prikaziObjave(objave)