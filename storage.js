const fs = require('fs')
const multer = require('koa-multer')
const path = require('path')

const headerImgPath = path.join(__dirname, './public/header-imgs/')
const articalImgPath = path.join(__dirname, './public/artical-imgs/')

var headerImg = multer.diskStorage({  
  //文件保存路径
  destination: function (req, file, cb) {
    console.log(headerImgPath)
    cb(null, headerImgPath)
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split(".")
    console.log(fileFormat,'**************************')
    let cookieIndex = req.rawHeaders.indexOf('cookie')
    if (cookieIndex !== -1) {
      let cookieContent = req.rawHeaders[cookieIndex + 1].split('=')[1].slice(0,5)
      console.log(cookieContent)
      cb(null, cookieContent + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
  }
})
var articalImg = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {
    console.log(articalImgPath)
    cb(null, articalImgPath)
  },  
  //修改文件名称  
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".")
    let cookieIndex = req.rawHeaders.indexOf('cookie')
    console.log(file)
    if (cookieIndex !== -1) {
      let cookieContent = req.rawHeaders[cookieIndex + 1].split('=')[1].slice(0-5)
      cb(null, cookieContent + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
  }
})

const uploadHeaderImg = multer({storage: headerImg })
const uploadArticalImg = multer({storage: articalImg})

module.exports = {
  headerImgPath,
  articalImgPath,
  uploadHeaderImg,
  uploadArticalImg
}