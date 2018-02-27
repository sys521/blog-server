const fs = require('fs')
const path = require('path')

function heihei () {
  return new Promise ((resolve,reject) => {
    setTimeout(() => {
      console.log('1')
      resolve()
    }, 1000)
  })
}
async function lala () {
  console.log('2')
  await heihei()
  heihei().then(() => {
    console.log('3')
  })
  console.log('4')
}
lala()
console.log('5')