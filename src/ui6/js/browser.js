const M = module.exports = {
  scriptLoaded: {},
  router: { map: new Map() }
}

class Nodes {
  constructor(o) { this.o = o }
  each(f) { this.o.forEach(f) }
  set(attr, value) { this.each((o)=>o[attr] = value) }
  get first() { this.firstChild }
  hide() { this.set('hidden', true) }
  show() { this.set('hidden', undefined) }
  html(html) { this.set('innerHTML', html) }
}

M.Nodes = Nodes

M.one = function (selector, node=document) {
  return node.querySelector(selector)
}

M.all = function (selector, node=document) {
  return new Nodes(node.querySelectorAll(selector))
}

// onhashchange => route
M.route = function (regexp, f) {
  M.router.map.set(regexp, f)
  return this
}

M.onhash = function () {
  var promise = new Promise(function (resolve, reject) {
    var hash = window.location.hash.trim().substring(1)
    var m
    for (let [regexp, f] of M.router.map) {
      m = hash.match(regexp)
      if (m) {
        f(m, hash)
        resolve(m)
        break
      }
    }
    if (!m) reject(new Error('no route match hash'))
  })
  return promise
}

window.onhashchange = function () {
  M.onhash()
}

M.go = function (hash) {
  window.location.hash = '#' + hash
  return M.onhash()
}

// View : Event Handling
M.on = function (obj, event, f) {
  var o = (typeof obj === 'string') ? M.one(obj) : obj
  o.addEventListener(event, f)
}

// load stylesheet (CSS)
M.styleLoad = function (url) {
  var ss = document.createElement('link')
  ss.type = 'text/css'
  ss.rel = 'stylesheet'
  ss.href = url
  M.one('head').appendChild(ss)
}

// load script (JS)
M.scriptLoad = function (url) {
  return new Promise(function (resolve, reject) {
    var urlLoaded = M.scriptLoaded[url]
    if (urlLoaded === true) resolve(url)
    var script = document.createElement('script')
    script.onload = function () {
      M.scriptLoaded[url] = true
      resolve()
    }
    script.onerror = function () {
      M.scriptLoaded[url] = false
      reject(new Error('Could not load script at ' + url));
    }
    script.src = url
    M.one('head').appendChild(script)
  })
}

/** ajax with 4 contentType , ref : https://imququ.com/post/four-ways-to-post-data-in-http.html
 * 1. application/x-www-form-urlencoded  ex: title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
 * 2. multipart/form-data                ex: -...Content-Disposition: form-data; name="file"; filename="chrome.png" ... Content-Type: image/png
 * 3. application/json                   ex: JSON.stringify(o)
 * 4. text/plain                         ex: hello !
 * 5. text/xml                           ex: <?xml version="1.0"?><methodCall> ...
 * For form, use xhr.send(new window.FormData(form))
 */
M.ajax = function (arg) {
  var promise = new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest()
    xhr.open(arg.method, arg.url, true)
    if (arg.contentType) {
      xhr.setRequestHeader('Content-Type', arg.contentType)
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        if (arg.alert) alert('Success!')
        resolve(xhr.responseText)
      } else {
        if (arg.alert) alert('Fail!')
        reject(new Error(xhr.statusText))
      }
    }
    console.log('ajax:arg='+JSON.stringify(arg))
    xhr.send(arg.body)
  })
  return promise
}

M.ojax = async function (arg, obj) {
  arg.contentType = 'application/json'
  if (obj) arg.body = JSON.stringify(obj)
  var json = await M.ajax(arg)
  return JSON.parse(json)
}

M.fjax = function (arg, form) {
  form.action = arg.url
  form.method = arg.method
//  arg.contentType = 'multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA'
  arg.body = new window.FormData(form)
  return M.ajax(arg)
}

M.onload = function (init) {
  return new Promise(function (resolve, reject) {
    window.addEventListener('load', function () {
      init()
      window.onhashchange()
      resolve()
    })
  })
}