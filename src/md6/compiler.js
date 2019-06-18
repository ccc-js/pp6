/* 以下的 . 都不包含 \n 字元，但是 .. 可包含 \n 字元
----------基本語法---------------
MD = (LINE | BLOCK)*
LINE = (#*)? INLINE*\n
INLINE = ITALIC | BOLD | ICODE | IMATH | LINK | URL? | <URL> |  | .*
BLOCK = LIST? | HLINE? | SECTION | REF | CODE | MARK | TABBLOCK | TABLE | MATH
ICODE = `(.*)`
ITALIC = *(.*)*
BOLD = **(.*)**
CODE = \n```(\w+)\n(..*)\n```
MARK = (\n>.*)+
TABBLOCK = (\n(TAB).*)+

----------延伸語法----------------
TABLE = ROW \n(-+|)+(.*) ROW+
ROW   = \n(.* |)+(.*)
IMATH = $(.*)$
MATH  = \n$$(..*)\n$$
*/
const M = module.exports = require('./generator')

var lines, lineIdx, lineTop, paragraph

M.compile = function (md, generator) {
  lines = (md).split('\n'); lineTop = lines.length; lineIdx = 0; paragraph={ type:'paragraph', childs:[] }
  gen = generator
  // len = md.length; i = 0; ahead = null; aheadStart = -1
  let tree = MD()
  return tree
}

M.parse = function (text) {
  return M.compile(text, M.treeGenerator)
}

// MD = (BLOCK)*
let MD = function () {
  let r = {type:'top', childs:[]}
  while (lineIdx < lineTop) {
    let e = BLOCK()
    r.childs = r.childs.concat(e)
  }
  return gen(r)
}

let line = function () {
  return lines[lineIdx]
}

let head = function (str) {
  return (line().startsWith(str))
}

let lineMatch = function (regexp) {
  return line().match(regexp)
}

let genLine = function (line) {
  return gen({type:'line', childs: inline(line)})
}

let inline = function (text) {
  var regexp = /((``(?<code2>.*?)``)|(`(?<code1>.*?)`)|(\*\*(?<star2>.*?)\*\*)|(\*(?<star1>.*?)\*)|(__(?<under2>.*)?__)|(_(?<under1>.*?)_)|(\$(?<math>.*?)\$)|(<(?<url>.*?)>)|(?<link>\[(?<text>[^\]]*?)\]\((?<href>[^\"\]]*?)("(?<title>.*?)")?\)))/g
  var m, lastIdx = 0, len = text.length
  var r = []
  while ((m = regexp.exec(text)) !== null) {
    if (m.index > lastIdx) r.push(gen({type:'text', body:text.substring(lastIdx, m.index)}))
    let obj = {}, type, body
    for (let key in m.groups) {
      let value = m.groups[key]
      if (value != null) {
        obj[key] = value
        type = key
        body = value
      }
    }
    if (obj.link != null)
      obj = {type:'link', text:obj.text, href:obj.href, title:obj.title}
    else 
      obj = {type, body}
    // console.log('obj=%j', obj)
    r.push(gen(obj))
    lastIdx = regexp.lastIndex
  }
  if (len > lastIdx) r.push(gen({type:'text', body:text.substring(lastIdx, len)}))
  return r
}

// BLOCK = CODE | MARK | TABBLOCK | TABLE? | MATH? | TITLE | PARAGRAPH
let BLOCK = function () {
  var r = null // ,blockStart = lineIdx
  if (r == null) r = EMPTY()
  if (r == null) r = CODE()
  if (r == null) r = MARK()
  if (r == null) r = TABBLOCK()
  if (r == null) r = MATH()
  if (r == null) r = IMAGE()
  if (r == null) r = REF()
  if (r == null) r = HEADER()
  if (r == null) r = HLINE()
  if (r == null) r = TABLE()
  if (r == null) {
    // console.log('lines[%d]=%j', lineIdx, line())
    paragraph.childs.push(genLine(lines[lineIdx++]))
    return []
  } else { // 有比對到某種 BLOCK
    let list = []
    if (paragraph.childs.length > 0) list.push(gen(paragraph))
    list.push(gen(r))
    paragraph = {type:'paragraph', childs:[]}
    return list
  }
}

let lineUntil = function (regexp, options={}) {
  let list = []
  for (lineIdx++; lineIdx < lineTop; lineIdx++) {
    line1 = line()
    if (lineMatch(regexp)) break
    if (options.compile) line1 = inline(line1)
    list.push(line1)
  }
  return list
}

// EMPTY = \s*
let EMPTY = function () {
  if (line().trim().length !== 0) return null
  lineIdx ++
  return {type:'empty'}
}

// CODE = ```\n.*\n```
let CODE = function () {
  let line1 = line()
  if (!line1.startsWith('```')) return null
  let lang = line1.match(/^```(\S*)/)[1]
  let childs = lineUntil(/^```/)
  lineIdx ++
  return gen({type:'code', lang, body:childs.join('\n')})
}

// MARK = (\n>.*)+
let MARK = function () {
  if (!line().startsWith('>')) return null
  let childs = []
  for (lineIdx++; lineIdx < lineTop; lineIdx++) {
    line1 = line()
    if (!line().startsWith('>')) break
    childs.push(genLine(line1.substr(1)))
  }
  return gen({type:'mark', childs})
}

// TABBLOCK = (\n(TAB).*)+
let TABBLOCK = function () {
  if (!line().startsWith('    ')) return null
  let childs = []
  for (lineIdx++; lineIdx < lineTop; lineIdx++) {
    line1 = line()
    if (!line().startsWith('    ')) break
    childs.push(genLine(line1.substr(4)))
  }
  return gen({type:'tabBlock', childs})
}

// MATH = \n$$(\w+)\n(..*)\n$$
let MATH = function () {
  if (!line().startsWith('$$')) return null
  let childs = lineUntil(/^\$\$/)
  lineIdx ++
  return gen({type:'math', body:childs.join('\n')})
}

// IMAGE = \n![.*](.*)
let IMAGE = function () {
  let m = lineMatch(/^!\[(.*?)\]\((.*?)(\s*"(.*?)")?\)\s*$/)
  if (m == null) return null
  lineIdx++
  return gen({type:'image', alt:m[1], href:m[2], title:m[4]})
}

// [id]: url/to/image  "Optional title attribute"
// REF = \n[.*]:
let REF = function () {
  let m = lineMatch(/^\[([^\]]*?)\]: (.*?)(\s*"(.*?)")?$/)
  if (m == null) return null
  lineIdx++
  return gen({type:'ref', id:m[1], href:m[2], title:m[4]})
}

let HEADER = function () {
  let line1 = lines[lineIdx], line2 = lines[lineIdx+1]
  // console.log('line1=%j', line1)
  let m = line1.match(/^(#+)(.*)?$/) // # ....
  // console.log('m=%j', m)
  if (m != null) {
    let r = {type:'header', level:m[1].length, childs:inline(m[2])}
    // console.log('HEADER: r=%j', r)
    lineIdx++
    return gen(r)
  }
  if (line2 == null) return null
  m = line2.match(/^((===+)|(---+))$/)
  if (m == null) return null
  lineIdx += 2
  let level = (m[1] === '=') ? 1 : 2
  return gen({type:'header', level, childs:inline(line1)})
}

let HLINE = function () {
  let m = lineMatch(/^((---+)|(\*\*\*+))$/)
  if (m == null) return null
  lineIdx++
  return gen({type:'hline', level:m[1].length, body:m[2]})
}

let TABLE = function () {
  let line1 = lines[lineIdx]
  if (line1.indexOf('|') < 0) return null
  let line2 = lines[lineIdx+1]
  m = line2.match(/^(\-*?\|)+\-*?$/)
  if (m == null) return null
  let childs = [ genLine(line1), genLine(line2) ]
  for (lineIdx+=2; lineIdx < lineTop; lineIdx++) {
    let tline = line()
    if (tline.indexOf('|')<0) break
    childs.push(genLine(tline))
  }
  return gen({type:'table', childs})
}

let LIST = function () {
  throw Error('LIST() not implemented!')
}

/*
// LINE = \n(#*)? INLINE*
let HEADER = function () {
  let line1 = line(), start=i=0
  let m = lineMatch(/^(#*)/)
  if (m == null) return null
  let level = m[0].length
  let childs = inline(line().substring(level))
  return gen(r, {type:'head', level, childs})
}
*/
/*
let PARAGRAPH = function () {
  while (i<len && !/^\n((```)|(>)|(    )|($$)|(#)|(\n))/.test(md.substring(i, i+10))) {
    childs.push(LINE())
  }
}
*/
/*

  } else { // PARAGRAPH
    while (i<len && !/^\n((```)|(>)|(    )|($$)|(#)|(\n))/.test(md.substring(i, i+10))) {
      childs.push(LINE())
    }
    return gen({type:'paragraph', childs})
  }
}
*/


/*
let LIST = function () {
  if (headMatch('\n', /^\*\s/) || headMatch('\n', /^(\d+)\./)) {
    return gen({type: 'hline'})
  }
  return null
}
*/