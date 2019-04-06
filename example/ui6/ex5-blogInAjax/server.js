var Koa = require('koa')
var Router = require('koa-router')
var logger = require('koa-logger')
var koaStatic = require('koa-static')
var bodyParser = require('koa-bodyparser')

var app = new Koa()
var router = new Router()

app.use(koaStatic('./'))
app.use(koaStatic('../'))
app.use(koaStatic('../../../dist/'))
app.use(bodyParser())

var posts = []

app.use(logger())

router
  .get('/list', listPosts)
  .get('/post/:id', getPost)
  .post('/post', createPost)

async function listPosts (ctx) {
  ctx.body = JSON.stringify(posts)
}

async function getPost (ctx) {
  var id = parseInt(ctx.params.id)
  console.log('getpost: id=%d posts=%j', id, posts)
  var post = posts[id]
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.body = await JSON.stringify(post)
}

async function createPost (ctx) {
  console.log('createPost:rawBody=%s', ctx.request.rawBody)
  console.log('createPost:body=%j', ctx.request.body)
  var post = ctx.request.body
  var id = posts.push(post) - 1
  post.created_at = new Date()
  post.id = id
  ctx.body = JSON.stringify(post)
}

app.use(router.routes()).listen(3000)
// app.listen(3000)
console.log('server run at http://localhost:3000')
