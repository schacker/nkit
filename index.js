const Koa = require('koa')
const http = require('http')
const https = require('https')
let log4js = require('log4js')

const app = new Koa()

log4js.configure({
    appenders: [
        {
          "type": "dateFile",
          "filename": "./server/log/access.log",
          "pattern": "-yyyy-MM-dd",
          "category": "http"
        },
        {
          "type": "file",
          "filename": "./server/log/app.log",
          "maxLogSize": 10485760,
          "numBackups": 3
        },
        {
          "type": "logLevelFilter",
          "level": "ERROR",
          "appender": {
            "type": "file",
            "filename": "./server/log/errors.log"
          }
        }
      ]
})
let logger = log4js.getLogger('nkit-api')

app.use(async (ctx, next) => {
    
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(ctx)
    logger.info(`${ctx.method} | ${ctx.protocol}://${ctx.host}${ctx.path} | ${ctx.request.querystring} | - ${ms}`)
})

app.use(async ctx => {
    ctx.body = 'Hello World'
})

http.createServer(app.callback()).listen(3000)
// https.createServer(app.callback()).listen(3001)