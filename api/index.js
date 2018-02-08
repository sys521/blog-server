const router = require('koa-router')()
const {sendOk, sendFail} = require('./tool.js')
const {USER} = require('../db/model.js')
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
router.get('/user/info', async(ctx, next) => {
  console.log('22222')
  console.log(ctx.session)
  let userName = ctx.session.user.name
  let res = await USER.getUser(userName)
  if (res) {
    ctx.response.body = sendOk('success', res)
  } else {
    ctx.response.body = sendFail('未找到该用户', 'fail')
  }
})
module.exports = router