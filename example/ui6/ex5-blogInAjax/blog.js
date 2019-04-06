var content, title

async function main () {
  ui6.route(/^list/, list)
    .route(/^post\/new/, add)
    .route(/^post\/(\w+?)/, show)
    .route(/^post/, create)
  await ui6.onload(init)
}

function init() {
  title = ui6.one('title')
  content = ui6.one('#content')
  ui6.go('list')
}

async function add () {
  console.log('add()')
  title.innerHTML = 'New Post'
  content.innerHTML = `
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <form>
    <p><input id="addTitle" type="text" placeholder="Title" name="title"></p>
    <p><textarea id="addBody" placeholder="Contents" name="body"></textarea></p>
    <p><input type="button" value="Create" onclick="create()"></p>
  </form>
  `
}

async function create () {
  var post = {
    title: ui6.one('#addTitle').value,
    body: ui6.one('#addBody').value,
    created_at: new Date()
  }
  console.log(`create:post=${JSON.stringify(post)}`)
  await ui6.ojax({method: 'POST', url: '/post'}, post)
//  posts.push(post)
  ui6.go('list')
}

async function show (m) {
  var id = parseInt(m[1])
  var post = await ui6.ojax({method: 'GET', url: `/post/${id}`})
//  var post = posts[id]
  content.innerHTML = `
  <h1>${post.title}</h1>
  <p>${post.body}</p>
  `
}

async function list () {
  var posts = await ui6.ojax({method: 'GET', url: '/list'})
  title.innerHTML = 'Posts'
  content.innerHTML =
  `<h1>Posts</h1>
  <p>You have <strong>${posts.length}</strong> posts!</p>
  <p><a href="#post/new">Create a Post</a></p>
  <ul id="posts">
    ${posts.map(post => `
      <li>
        <h2>${post.title}</h2>
        <p><a href="#post/${post.id}">Read post</a></p>
      </li>
    `).join('\n')}
  </ul>
  `
}

main()
