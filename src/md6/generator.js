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