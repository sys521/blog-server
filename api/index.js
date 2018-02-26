const router = require('koa-router')()
const {sendOk, sendFail, deleteFile} = require('./tool.js')
const {USER} = require('../db/model.js')
const fs = require('fs')
const multer = require('koa-multer')
const path = require('path')
var storage = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {  
    cb(null, path.join(__dirname, '../public'))
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split(".")
    let cookieIndex = req.rawHeaders.indexOf('cookie')
    if (cookieIndex !== -1) {
      let cookieContent = req.rawHeaders[cookieIndex + 1].split('=')[1]
      cb(null, cookieContent + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
  }
})  
const upload = multer({storage: storage })

router.post('/user/check', async (ctx, next) => {
  let u_name = ctx.request.body.u_name
  if (!u_name ) {
    ctx.response.body = sendFail()
  } else {
    let u_name = ctx.request.body.u_name
    let data =  await USER.findOne({where: {user_name: u_name}})
    if (data) {
      ctx.response.body = sendOk('NotUnique','NotUnique')
    } else {
      ctx.response.body = sendOk('unique', 'unique')
    }
  }
})
router.post('/user/add', async (ctx, next) => {
  let {u_name, u_password, u_email} = ctx.request.body
  try {
    let res = await USER.create({user_name:u_name, user_password: u_password, user_email: u_email})
    ctx.response.body = sendOk('注册成功', 'success')
  } catch(err) {
    ctx.response.body = sendFail(err.message, 'fail')
  }
})
router.post('/user/login', async (ctx, next) => {
  let user = ctx.request.body
  if (user.u_name && user.u_password) {
    try {
      let res = await USER.findOne({where: {user_name: user.u_name}})
      if (res.dataValues.user_password === user.u_password){
        ctx.session.user = {name: user.u_name}
        ctx.response.body = sendOk('登录成功', 'success')
      } else {
        ctx.response.body = sendFail('登录失败', 'fail')
      }
    } catch(err) {
      
      ctx.response.body =sendFail(err.message, 'fail')
    }
  } else {
    ctx.response.body = sendFail('not right commit', 'fail')
  }
})
router.get('/user/info', async (ctx, next) => {
  console.log(ctx.session)
  let userName = ctx.session.user.name
  let res = await USER.findAll({attributes: ['user_email', 'user_displayName', 'user_header'], where: {user_name: userName}})
  console.log(res[0].dataValues)
  if (res[0].dataValues) {
    ctx.response.body = sendOk('success', res[0].dataValues)
  } else {
    ctx.response.body = sendFail('未找到该用户', 'fail')
  }
})
router.post('/user/update/header', upload.single('user_header'), async (ctx, next) => {
  console.log(ctx.req.file)
  let fileName = ctx.req.file.filename
  console.log(fileName)
  let userName = ctx.session.user.name
  let oldFile = await USER.findAll({attributes: ['user_header'], where: {user_name: userName}})
  if (oldFile[0].dataValues) {
    let filePath = path.join(__dirname, '../public')
    deleteFile(filePath, oldFile[0].dataValues.user_header)
  }
  let res = await USER.update({'user_header': fileName},{where: {user_name: userName}})
  ctx.response.body = sendOk('success', fileName)
})
module.exports = router