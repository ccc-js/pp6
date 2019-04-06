(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var I = module.exports = {}

/*
<img id="img1" src="demo_small.png" width="600" height="337">
<canvas id="canvas1" width="600" height="337"></canvas>
var img = document.getElementById('img1');
var rects = img.getClientRects(); // 很多個，why?
var rect = img.getBoundingClientRect(); // 一個，OK!
var ctx = img.getContext('2d');
var idata = ctx.getImageData(0,0,img.width,img.height); // 取得 rgb 陣列。
ctx.drawImage(img, 0, 0);
ctx.putImageData(idata, 0, 0);
document.getElementById(id);
*/

I.image2idata=function(image) {
	var canvas = document.createElement('canvas');
	canvas.width = image.width, canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0,0,img.width,img.height);
}

I.canvas2idata=function(canvas, x, y, width, height) {
  return canvas.getContext('2d').getImageData(x,y,width,height);
}

I.idata2rgb=function(idata) {
	var d = idata.data, rows=idata.height, cols=idata.width;
	var rgb={r:R.newM(rows,cols),g:R.newM(rows,cols),b:R.newM(rows,cols)};
	for (var r=0; r<rows; r++) {
  	for (var c=0; c<cols; c++) {
			var i = (r*cols+c);
		  rgb.r[i] = d[i];
		  rgb.g[i] = d[i+1];
		  rgb.b[i] = d[i+2];
		}
	}
	return rgb;
}

I.rgb2idata=function(rgb, idata) {
	var d=idata.data, width=rgb.r.cols(), height=rgb.r.rows();
	for (var r=0; r<rows; r++) {
  	for (var c=0; c<cols; c++) {
			var i = (r*cols+c);
		  d[i] = rgb.r[i];
		  d[i+1] = rgb.g[i];
		  d[i+2] = rgb.b[i];
		}
	}
}

I.gray=function(idata) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v;
  }
}

I.bright = function(idata, adjustment) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
}

I.threshold = function(idata, threshold) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = v
  }
}

I.convolute = function(idata, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);
  var src = idata.data;
  var sw = idata.width;
  var sh = idata.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;
  // go through the destination image pixels
  var alphaFac = opaque ? 1 : 0;
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy*sw+scx)*4;
            var wt = weights[cy*side+cx];
            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
}
},{}],3:[function(require,module,exports){
const M = module.exports = {}

Object.assign(M, 
  require('./browser'),
  require('./image'),
)


},{"./browser":1,"./image":2}],4:[function(require,module,exports){
ui6 = require('./ui6/')

},{"./ui6/":3}]},{},[4]);
