
// lecture d'un fichier quelconque en mode ASYNCHRONE
const filesystem = require('fs')
const data = filesystem.readFileSync("data.txt", function(err,data){ 
console.log(data.toString())

})