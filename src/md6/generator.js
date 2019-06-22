const R = module.exports = {}

R.treeGenerator = function (node) {
  // console.log('node=%j', node)
  return node
}

let rs = function rewriteSpecial(str) {
  if (str == null) return ''
  let len = str.length
  let r = []
  for (let i=0; i<len; i++) {
    let ch = str[i], toStr=ch
    switch (ch) {
      case '<': toStr = '&lt;'; break
      case '>': toStr = '&gt;'; break
      case '&': 
        if (!/^&\w+;/.test(str.substring(i))) toStr = '&amp;'
        break
    }
    r.push(toStr)
  }
  return r.join('')
}

class Html {
  // inline
  text(x) { return x.body }
  code2(x) { return `<code>${x.body}</code>` }
  code1(x) { return `<code>${x.body}</code>` }
  star2(x) { return `<strong>${rs(x.body)}</strong>` }
  star1(x) { return `<strong>${rs(x.body)}</strong>` }
  under2(x) { return `<em>${rs(x.body)}</em>` }
  under1(x) { return `<em>${rs(x.body)}</em>` }
  url(x) { return `<a href="${x.body}">${x.body}</em>` }
  math1(x) { return `<span class="math inline">${x.body}</span>` }
  math(x) { return `<p><span class="math display">\n${x.body}\n</span></p>` }
  link(x) { return `<a href="${x.href}" alt="${x.alt}">${x.text}</a>` }
  // block
  blocks(x) { return x.childs.join('\n') }
  header(x) { return `<h${x.level}>${x.childs.join('')}</h${x.level}>` }
  line(x) { return `${x.childs.join('')}` }
  empty(x) { return `<p></p>\n`.repeat(x.count-1) }
  code(x) { return `<pre><code class="${x.lang}">\n${x.body}\n</code></pre>`}
  mark(x) { return `<blockquote>\n${x.childs.join('\n')}\n</blockquote>` }
  tabBlock(x) { return `<pre>\n${x.childs.join('\n')}\n</pre>` }
  image(x) { return `<img src="${x.href}" alt="${x.alt}">${rs(x.title)}</img>` }
  hline(x) { return '<hr>' }
  ref(x) { return '' }
  paragraph(x) { return `<p>${x.childs.join('\n')}</p>` }
  list(x) { return `${'    '.repeat(x.level)}<${x.listType}>\n${x.childs.join('\n')}\n${'    '.repeat(x.level)}</${x.listType}>`}
  li(x) { return `${'    '.repeat(x.level+1)}<li>${x.childs.join('')}</li>` }
  table(x) {
    let len = x.childs.length, list=[]
    for (let ri=0; ri<len; ri++) {
      let row = x.childs[ri]
      let rowHtml = ''
      switch (ri) {
        case 0: rowHtml = `<tr><th>${row.replace(/\|/g, '</th><th>')}</th></tr>`; break;
        case 1: rowHtml = ''; break
        default: rowHtml = `<tr><td>${row.replace(/\|/g, '</td><td>')}</td></tr>`; break;
      }
      list.push(rowHtml)
    }
    return `<table>\n${list.join('\n')}\n</table>`
  }
} 

R.html = new Html()

R.htmlRender = function (node) {
  // console.log('node=%j', node)
  if (node.type == null) return node
  return R.html[node.type](node)
}



/*
R.htmlRender = function (node) {
  let {type, body, childs} = node, len, list
  switch (type) {
    case 'string': return rs(body)
    case '*': return '<em>'+rs(body)+'</em>'
    case '_': return '<em>'+rs(body)+'</em>'
    case '**': return '<strong>'+rs(body)+'</strong>'
    case '__': return '<strong>'+rs(body)+'</strong>'
    case '`': return '<code>'+body+'</code>'
    case '``': return '<code>'+body+'</code>'
    case '[': return rs(body)
    case '(': return body
    case '<': return `<a href="${body}">${rs(body)}</a>`
    case 'empty': return ''
    case 'hline': return '<hr>'
    case 'link': return `<a href="${node.link}" title="${node.title}">${rs(node.text)}</a>`
    case 'code': return `<code class="${node.lang}"><pre>${body}\n</pre></code>`
    case 'math' : return `<math>${body}\n</math>`
    case 'mark' : return `<blockquote>\n${childs.join('\n')}\n</blockquote>`
    case 'tabBlock': return `<pre>${childs.join('\n')}\n</pre>`
    case 'image': return `<img src="${node.alt}">${rs(node.title)}</img>`
    case 'ref': // 紀錄 id 到引用中！
      return ''
    case 'paragraph':
      // if (childs.length === 0 || (childs.length === 1 && childs[0]==='')) return ''
      return `<p>${childs.join('\n')}</p>`
    case 'line':
      let lead = childs[0], level = lead.length
      if (lead.startsWith('#')) { // 標頭行
        return `<h${level}>${rs(childs.slice(1).join('').trim())}</h${level}>`
      } else { // 一般行
        return childs.join('')
      }
    case 'h1': return `<h1>${rs(childs.join('').trim())}</h1>`
    case 'h2': return `<h2>${rs(childs.join('').trim())}</h2>`
    case 'top': return childs.join('\n')
    case 'table': 
      len = childs.length; list=[]
      for (let ri=0; ri<len; ri++) {
        let row = childs[ri]
        let rowHtml = ''
        switch (ri) {
          case 0: rowHtml = `<tr><th>${row.replace(/\|/g, '</th><th>')}</th></tr>`; break;
          case 1: rowHtml = ''; break
          default: rowHtml = `<tr><td>${row.replace(/\|/g, '</td><td>')}</td></tr>`; break;
        }
        list.push(rowHtml)
      }
      return `<table>\n${list.join('\n')}\n</table>`
    default:
      if (body != null) return body
      if (childs != null) return childs.join('')
      console.log('default: node=%j', node)
      throw Error('generator: error node='+node)
  }
}
*/