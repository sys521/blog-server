const fs = require('fs')

const deleteFile = function (filePath, name) {
  console.log(filePath)
  if (fs.existsSync(filePath)) {
    let files = fs.readdirSync(filePath)
    if (files.indexOf(name) !== -1) {
      let curPath = filePath + '/' + name
      fs.unlinkSync(curPath)
    }
  }
}

const success = {
  status: 'success',
  message: '',
  data: ''
}

const fail = {
  status: 'fail',
  message: '',
  data: ''
}

function sendOk(text, obj) {
  return Object.assign(success, {message:text, data:obj})
}

function sendFail (text, obj) {
  return Object.assign(fail, {message:text, data:obj})
}

module.exports = {
  sendOk,
  sendFail,
  deleteFile
}