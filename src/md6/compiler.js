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

var md, len, i, ahead, aheadStart, gen

let nextLine = function (start) {
  var j
  for (j=start; j<len; j++) {
    if (md.charAt(j)=='\n') break
  }
  return md.substring(start, j)
}

let isNext = function (h) {
  if (aheadStart != i) ahead = md.substr(i, 10)
  return (ahead.startsWith(h))
}

M.compile = function (text, generator) {
  md = '\n'+text.replace(/\t/g, '    ')+'\n'
  gen = generator
  len = md.length; i = 0; ahead = null; aheadStart = -1
  let tree = MD()
  return tree
}

M.parse = function (text) {
  return M.compile(text, M.treeGenerator)
}

// MD = (BLOCK)*
let MD = function () {
  let r = {type:'top', childs:[]}
  while (i < len) {
    let e = BLOCK()
    r.childs.push(e)
  }
  return gen(r)
}

// BLOCK = CODE | MARK | TABBLOCK | TABLE? | MATH? | TITLE | PARAGRAPH
let BLOCK = function () {
  // console.log('block=%j', md.substr(i, 10))
  var r = null
  if (isNext('\n```')) {
    return CODE()
  } else if (isNext('\n>')) {
    // console.log('isNext(\n>')
    return MARK()
  } else if (isNext('\n    ')) {
    return TABBLOCK()
  } else if (isNext('\n$$')) {
    return MATH()
  } else if (isNext('\n![')) {
    return IMAGE()
  } else if (isNext('\n#')) { // #.. section
    return LINE()
  } else if (r = HLINE()) {
    return r
  } else if (isNext('\n')) { // TABLE or PARAGRAPH
    return OTHERS()
  } else {
    throw Error('BLOCK: unknown type at '+i+':'+md.substr(i, 20))
  }
}

let HLINE = function () {
  if (headMatch('\n---', /^\-*?$/) || headMatch('\n***', /^\**?$/)) {
    return gen({type: 'hline'})
  }
  return null
}

let LIST = function () {
  if (headMatch('\n', /^\*\s/) || headMatch('\n', /^(\d+)\./)) {
    return gen({type: 'hline'})
  }
  return null
}

// LINE = \n(#*)? INLINE*
let LINE = function (options = {}) {
  let r = {type:'line', childs:[]}
  if (md[i]=='\n') i++; else if (options.newLine!==false) throw Error('LINE: not start with \n')
  let start = i
  while (md[i] == '#') i++
  let h = gen({type:'', head:'\n', body:md.substring(start, i), tail:''})
  r.childs.push(h)
  while (md[i] != '\n' && i < len) {
    let c = INLINE()
    r.childs.push(c)
  }
  return gen(r)
}

// INLINE = ITALIC | BOLD | ICODE | IMATH?
// ICODE = `(.*)`
// ITALIC = *(.*)*
// BOLD = **(.*)**
// LINK = [.*](.*)
// IMATH = $(.*)$

let headMatch = function (head, regexp) {
  if (isNext(head)) {
    let line = nextLine(i+head.length)
    let m = line.match(regexp)
    i += head.length + m[0].length
    return m
  }
  return null
}

let INLINE = function () {
  let m = null
  if (isNext('``')) {
    return IPART('``', '``')
  } else if (isNext('`')) {
    return IPART('`', '`')
  } else if (isNext('<')) {
    return IPART('<', '>')
  } else if (isNext('**')) {
    return IPART('**', '**')
  } else if (isNext('*')) {
    return IPART('*', '*')
  } else if (isNext('__')) {
    return IPART('__', '__')
  } else if (isNext('_')) {
    return IPART('_', '_')
  } else if (isNext('$')) {
    return IPART('$', '$')
  } else if ((r = LINK())!=null) {
    return r
  } else {
    return STRING()
  }
}

let LINK = function () {
  let m = headMatch('[', /^([^\]]*?)\]\(([^\)"]*?)(".*?")?\)/)
  if (m == null) return
  return gen({type:'link', text:m[1], link:m[2], title:m[3]})
}

let STRING = function () {
  let start = i
  while ('`*$[<_\n'.indexOf(md.charAt(i)) < 0) {
    i++
  }
  return gen({type:'string', head:'', body:md.substring(start, i), tail:''})
}

let IPART = function (head, tail, mode='inline') {
  if (isNext(head)) {
    let llen = head.length, rlen = tail.length
    let start = i + llen
    i = start
    for (; i<len; i++) {
      if (md.substr(i, rlen) === tail) {
        let r = {type:head, head, body:md.substring(start, i), tail}
        i += rlen
        return (mode === 'inline') ? gen(r) : r
      }
      if ((mode=='inline' && md.charAt(i) === '\n') || i >= len) {
        console.log('md=%s', md)
        console.log('head=%j md.substr(i,10)=%j', head, md.substr(i, 10))
        throw Error('IPART('+head+') error, end of line encounter !')
      }
    }
  }
}

let OTHERS = function () {
  let line1 = nextLine(i+1)
  if (line1.match(/^\s*$/)) return LINE()
  let line2 = nextLine(i+line1.length+2) // \nline1\nline2
  let nexti = i + line1.length + line2.length + 2
  let childs = []
  // console.log('line1=%j line2=%j', line1, line2)
  if (/^\[[^\]]*?\]:/.test(line1)) { // REF [id]: path/to/file "title"
    return REF()
  } else if (/^===+$/.test(line2) || /^---+$/.test(line2)) { // h1:xxx\n=====, h2:xxx\n------
    let type = (line2[0] === '=') ? 'h1' : 'h2'
    childs.push(LINE())
    i = nexti
    return gen({type, head: '', childs, tail:line2})
  } else if (/^(\-*?\|)+\-*?$/.test(line2)) { // TABLE
    while (true) {
      let start = i
      let line = LINE()
      if (md.substring(start, i).indexOf('|') < 0) {
        i = start
        break
      } else {
        childs.push(line)
      }
    }
    return gen({type:'table', childs})
  } else { // PARAGRAPH
    while (i<len && !/^\n((```)|(>)|(    )|($$)|(#)|(\n))/.test(md.substring(i, i+10))) {
      childs.push(LINE())
    }
    return gen({type:'paragraph', childs})
  }
}

// CODE = \n```(\w+)\n(..*)\n```
let CODE = function () {
  let r = IPART('\n```', '\n```', 'block')
  let m = r.body.match(/^(.*?)\n([\s\S]*)$/)
  r.type = 'code'
  r.lang = m[1]
  r.body = m[2]
  return gen(r)
}

// MATH = \n$$(\w+)\n(..*)\n$$
let MATH = function () {
  let r = IPART('\n$$', '\n$$', 'block')
  r.type = 'math'
  return gen(r)
}

// MARK = (\n>.*)+
let MARK = function () {
  // console.log('MARK()')
  let childs = []
  while (isNext('\n>')) {
    i+=2
    childs.push(LINE({newLine:false}))
  }
  return gen({type:'mark', childs})
}

// TABBLOCK = (\n(TAB).*)+
let TABBLOCK = function () {
  let childs = []
  while (isNext('\n    ')) {
    let start = ++i
    while (md[i] != '\n') {
      i++
    }
    childs.push(md.substring(start+4, i))
  }
  return gen({type:'tabBlock', childs})
}

// IMAGE = \n![.*](.*)
let IMAGE = function () {
  let r = IPART('\n![', ')', 'block')
  let m = r.body.match(/^(.*?)\]\((.*?)(\s*"(.*?)")?$/)
  r.type = 'image'
  r.alt = m[1]
  r.href = m[2]
  r.title = m[4]
  return gen(r)
}

// [id]: url/to/image  "Optional title attribute"
// REF = \n[.*]:
let REF = function () {
  let r = IPART('\n[', '\n', 'block')
  i-- // 退回 \n
  console.log('REF: r.body=%j', r.body)
  let m = r.body.match(/^([^\]]*?)\]: (.*?)(\s*"(.*?)")?$/)
  r.type = 'ref'
  r.id = m[1]
  r.href = m[2]
  r.title = m[4]
  return gen(r)
}

/*
let PARAGRAPH = function () {
  let childs = []
  while (!/^\n((```)|(>)|(    )|($$)|(#)|(\n))/.test(md.substr(i, 10)) && !isTable()) {
    childs.push(LINE())
  }
  if (childs.length == 0) childs.push(LINE())
  return gen({type:'paragraph', childs})
}

let isTable = function () {
  return /^\n.*?\|.*?\n(\-+|)+\-+/.test(md.substring(i, 1000))
}

let TABLE = function () {
  let childs = []
  while (true) {
    let start = i
    let line = LINE()
    if (md.substring(start, i).indexOf('|') < 0) {
      i = start
      break
    } else {
      childs.push(line)
    }
  }
  return gen({type:'table', childs})
}
*/
/*
let next = function () {
  return md.charAt(i++)
}
*/