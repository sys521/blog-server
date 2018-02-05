const fs = require('fs')

function readFile(path) {
  return new Promise((resolve,reject) => {
    fs.readFile(path, 'utf-8', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = readFile
