document.getElementById('btn-light').addEventListener('click', () => {
  window.appAPI.changeTheme('light')
  document.getElementById('theme-css').href = '../styles/light.css'
  document.body.className = 'light'
})

document.getElementById('btn-dark').addEventListener('click', () => {
  window.appAPI.changeTheme('dark')
  document.getElementById('theme-css').href = '../styles/dark.css'
  document.body.className = 'dark'
})