const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

const logger = require('koa-logger')

const index = require('./routes/index')
const api = require('./api/index.js')
const init_sql = require('./db/index.js')

const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')

const {sendOk, sendFail} = require('./api/tool.js')

const {USER} = require('./db/model.js')

// 初始化数据库
init_sql()
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))



// session 保存到mysql
const config = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'blog'
}
const limit_time = 1000 * 60 * 60
app.use(session({
  key: 'user_id',
  store: new MysqlStore(config),
  cookie: {
    maxAge: limit_time,
    httpOnly: false,
    domain: 'localhost',
    path: '/'
  }
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  map: {html : 'ejs'}
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//  session 
app.use(async (ctx, next) => {
  let urlArr = ctx.request.url.split('/')
  console.log(urlArr)
  if (urlArr[1] === 'user' && urlArr[2] !== 'check' && urlArr[2] !== 'add' && urlArr[2] !== 'login') {
    if (ctx.session.user && ctx.session.user.name) {
      let user_name = ctx.session.user.name
      console.log(user_name)
      try {
        let res = await USER.findAll({arttibuts:['user_id'], where:{user_name}})
        let user_id = res[0].dataValues.user_id
        ctx.state.user_id = user_id
        console.log(ctx.state)
        await next()
      } catch(err) {
        console.log(err)
      }
    } else {
      ctx.response.body = sendFail('fail', '未登录或者缓存失效')
    }
  } else {
    console.log(ctx.session)
    await next()
  }
})
// routes
app.use(index.routes(), index.allowedMethods())
// api
app.use(api.routes(),api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
