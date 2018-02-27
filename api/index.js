const router = require('koa-router')()
const {sendOk, 
  sendFail, 
  deleteFile,
  createDir,
  createFile} = require('./tool.js')
const {USER} = require('../db/model.js')
const fs = require('fs')
const path = require('path')
const {uploadHeaderImg, uploadArticalImg} = require('../storage')

// 用户相关
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
router.post('/user/update/header', uploadHeaderImg.single('user_header'), async (ctx, next) => {
  let fileName = ctx.req.file.filename
  console.log(fileName)
  let userName = ctx.session.user.name
  let oldFile = await USER.findAll({attributes: ['user_header'], where: {user_name: userName}})
  if (oldFile[0].dataValues) {
    deleteFile(path.join(__dirname, '../public/header-imgs'), oldFile[0].dataValues.user_header)
  }
  let res = await USER.update({'user_header': fileName},{where: {user_name: userName}})
  ctx.response.body = sendOk('success', fileName)
})
router.post('/user/displayname/update', async (ctx) => {
  let {user_displayName} = ctx.request.body
  let userName = ctx.session.user.name
  if (user_displayName) {
    let res = await USER.update({'user_displayName': user_displayName}, {where: {user_name: userName}})
    if (res[0] === 1) {
      ctx.response.body = sendOk('success', 'success')
    } else {
      ctx.response.body = sendFail('fail', 'somethingError')
    }
  } else {
    ctx.response.body = sendFail('fail', '请输入合适的名称')
  }
})

// 文章相关
router.post('/artical/imgs/add', uploadArticalImg.single('image'),async(ctx) => {
  let userName = ctx.session.user.name
  let file = ctx.req.file.filename
  let user_id = await USER.findAll({attributes: ['user_id'], where:{user_name: userName}})  
})

router.get('/artical/add', async(ctx) => {
  let userName = ctx.session.user.name
  let res = await USER.findAll({attributes: ['user_id'], where: {user_name: userName}})
  let {user_id} = res[0].dataValues
  if (user_id) {
    let userDir = userName + user_id
    let dirPath = path.join(__dirname, '../public/artical/', userDir)
    let fileMdName = new Date().getTime() + '.md'
    let fileMd = dirPath + '/' + fileMdName
    try {
      let dir = await createDir(dirPath)
      let res = await createFile(fileMd)
      ctx.response.body = sendOk('success', fileMdName)
    } catch (err) {
      ctx.response.body = sendFial('fail', err)
    }
  } else {
    ctx.response.body = sendFail('fail', '没有此用户')
  }
})
module.exports = router