const fs = require('fs')

const deleteFile = function (filePath, name) {
  console.log(filePath)
  if (fs.existsSync(filePath)) {
    console.log('xxxxx')
    let files = fs.readdirSync(filePath)
    if (files.indexOf(name) !== -1) {
      let curPath = filePath + '/' + name
      fs.unlinkSync(curPath)
    }
  }
}
const createDir = (dirPath) => {
  return new Promise((resolve, reject) => {
    console.log(dirPath)
    fs.exists(dirPath, (res) => {
      if (res) {
        console.log(res)
        resolve('文件夹已经存在')
      } else {
        fs.mkdir(dirPath, (err,res) => {
          if (err) {
            reject(err)
          } else {
            console.log(res)
            resolve('创建成功')
          }
        })
      }
    })
  })
}
const createFile = (name) => {
  return new Promise((resolve, reject) => {
    console.log(name)
    fs.open(name, 'a', 0644, (err, fd) => {
      if (err) {
        reject('创建文件失败')
      } else {
        resolve('创建文件成功')
      }
    })
  })
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
  deleteFile,
  createDir,
  createFile
}