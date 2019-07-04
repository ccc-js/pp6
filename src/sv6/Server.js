const M = module.exports = {
  Koa: require('koa'),
  Router: require('koa-router'),
  logger: require('koa-logger'),
  koaStatic: require('koa-static'),
  bodyParser: require('koa-bodyparser'),
}

class Server {
  constructor() {
    this.koa = new M.Koa()
    this.router= new M.Router()
    this.logger = M.logger()
    this.koaStatic = M.koaStatic
    this.bodyParser = M.bodyParser()
    this.koa.use(this.bodyParser)
    this.koa.use(this.logger)
  }

  serveStatic(path) {
    this.koa.use(this.koaStaic(path))
    return this
  }

  run(arg) {
    this.root = arg.root
    this.koa.listen(arg.port)
    console.log('server run at http://localhost:%d/', arg.port)
  }
}

M.Server = Server

/*

router
  .get('/list', listPosts)
  .get('/post/:id', getPost)
  .post('/post', createPost)
*/