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
const limit_time = 1000 * 60 * 30
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
  console.log(ctx.request.url)
  let urlArr = ctx.request.url.split('/')
  if (urlArr[1] === 'user' && urlArr[2] !== 'check' && urlArr[2] !== 'add' && urlArr[2] !== 'login') {
    if (ctx.session.user && ctx.session.user.name) {
      await next()
    } else {
      ctx.response.body = sendFail('未登录', 'fail')
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