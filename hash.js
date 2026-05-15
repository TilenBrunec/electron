const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const setupFile = path.join(__dirname, 'out', 'make', 'squirrel.windows', 'x64', 'socialno-omrezje-1.0.0 Setup.exe')
const file = fs.readFileSync(setupFile)
const hash = crypto.createHash('sha256').update(file).digest('hex')

console.log('SHA-256:', hash)
fs.writeFileSync('ElectronAppHash.txt', hash)
console.log('Hash shranjen v ElectronAppHash.txt')