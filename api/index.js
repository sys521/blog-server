const router = require('koa-router')()
const {USER} = require('../db/sql.js')
const {sendOk, sendFail} = require('./tool.js')

router.post('/user/check', async (ctx, next) => {
  let u_name = ctx.request.body.u_name
  if (!u_name ) {
    ctx.response.body = sendFail()
  } else {
    let u_name = ctx.request.body.u_name
    let data =  await USER.hasUser(u_name)
    if (data.length > 0) {
      ctx.response.body = sendOk('NotUnique','NotUnique')
    } else {
      ctx.response.body = sendOk('unique', 'unique')
    }
  }
})
router.post('/user/add', async (ctx, next) => {
  try {
    let res = await USER.addUser(ctx.request.body)
    if (res.warningCount === 0) {
      ctx.response.body = sendOk('success', 'success')
    } else {
      ctx.response.body = sendOk(res.message, 'success')
    }
  } catch(err) {
    ctx.response.body = sendFail(err.message, 'fail')
  }
})
router.post('/login', async (ctx, next) => {
  let user = ctx.request.body
  if (user.u_name && user.u_password) {
    let res = await USER.check(user)
    ctx.response.body = sendOk('ok', 'true')
  } else {
    ctx.response.body = sendFail('not right commit', 'fail')
  }
})
module.exports = router