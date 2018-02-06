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
const config = require('./db/config.js')
const MysqlStore = require('koa-mysql-session')

// 初始化数据库
init_sql()
// error handler
onerror(app)

const limit_time = 1000 * 60 * 30
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(session({
  key: 'user',
  store: new MysqlStore(config),
  cookie: {
    maxAge: limit_time
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

// routes
app.use(index.routes(), index.allowedMethods())
// api

app.use(api.routes(),api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
