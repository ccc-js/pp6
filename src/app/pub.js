const fs6 = require('../fs6')
const md6 = require('../md6')
// const mdit = require('../../tool/mdit')
const path = require('path')
const uu6 = require('js6/uu6')
const JSOX = require('jsox')

const M = module.exports = {}

let options = {toHtml:true, toPdf:false}

M.htmlRender = md6.newHtmlRender({defaultExt: '.html'})

M.mdToHtml = function (md, options) {
  if (md == null) return ''
  // return mdit.render(md)
  return M.htmlRender.render(md)
}

M.parse = function (md) { // 1   2        3                   4             5              6
  let m = md.trim().match(/^(```(paper)\s*([\s\S]*?)\n```)?\s*([\s\S]*?)\s*?(\n```reference([\s\S]*?)```)?$/)
  if (m == null) return null
  let type = (m[2]||'').trim()
  let meta = JSOX.parse('{' + (m[3]||'') + '}')
  let body = (m[4]||'').trim()
  let ref = JSOX.parse('{' + (m[6]||'') + '}')
  return {type, meta, body, ref}
}

M.bib2html = function (bib) {
  let refs = []
  let i = 1
  for (let id in bib) {
    let {title, url, year, author, booktitle} = bib[id]
    refs.push(`
<li>
  <a id="${id}"></a>
  ${author} , 
  <em>"${url==null? title : '<a href="' + url + '">' + title + '</a>'}"</em>, 
  ${booktitle ? booktitle+',' : ''}
  ${year}
</li>`)
  }
  return `\n<ol class="referene">\n${refs.join('\n')}\n</ol>`
}

M.path2link = function (fpath) {
  // console.log('fpath=%j', fpath)
  let parts = fpath.split('/')
  let list = []
  for (let i=0; i<parts.length; i++) {
    if (parts[i].trim() === '') continue
    list.push(`[${parts[i]}](${parts.slice(0, i+1).join('/')})`)
  }
  // console.log('list=%j', list)
  return list.join(' / ')
}

M.toHtml = function (md, plugin={meta:{}}) {
  let {meta, sidebar, footer, header} = plugin
  let {root, defaultExt} = meta
  let options = {defaultExt}
  // console.log('options=%j', options)
  root = root || 'https://ccc-js.github.io/pp6/doc'
  let r = M.parse(md), html=null
  if (r == null) return
  let {type, meta:fileMeta, body, ref} = r
  let {abstract, title, author} = uu6.defaults(fileMeta, {title:'', author:'', abstract:''})
  html = `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.2/katex.min.css">
  <link rel="stylesheet" type="text/css" href="https://ccc-js.github.io/pp6/doc/main.css">
  <!-- 
  <link rel="stylesheet" type="text/css" href="file:///D:/ccc/js/pp6/doc/main.css"> 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/atom-one-light.min.css">
  -->
  </head>
  <body>
  <title>${title}</title>
  <header>
    <div style="float:left"><label class="toggle" onclick="toggleSidebar()">≡</label>&nbsp;&nbsp;</div>
    <div style="float:left">${M.mdToHtml(header)}</div>
  </header>
  <aside>
  <div>
  ${M.mdToHtml(sidebar, options)}
  </div>
  </aside>
  <article>
  <div class="header">
    ${(title == '')? '' : '<h1 class="title">'+title+'</h1>' }
    ${(author == '')? '' : '<p class="author">'+author.replace(/\n/g, '<br>')+'</p>'}
    ${(abstract == '')? '' : '<div class="abstract"><h2>Abstract</h2>\n<p>'+abstract.replace(/\n/g, '<br>')+'</p></div>'}
  </div>
  ${M.mdToHtml(body, options)}
  <div class="reference">
  ${!uu6.eq(ref, {}) ? `<h2>Reference</h2>`+M.bib2html(ref) : ''}
  </div>
  </article>
  <footer>${M.mdToHtml(footer, options)}</footer>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.2/katex.min.js"></script>
  <script src="https://ccc-js.github.io/pp6/doc/main.js"></script>
  <!--
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
  <script src="file:///D:/ccc/js/pp6/doc/main.js"></script>
  -->
  </script>
  </body>
  </html>
  `
  return html
}

M.convert = function (md, toFormat='html', plugin={}) {
  switch (toFormat) {
    case 'html': return M.toHtml(md, plugin)
    // case 'tex' : return M.toTex(md, plugin)
    default: throw Error('M.convert: toFormat='+toFormat+' not supported!')
  }
}

M.htmlFileToPdf = async function (htmlFile, pdfFile, meta) {
  let browser = await puppeteer.launch({ /* headless: false */ })
  let htmlPath = 'file://' + path.resolve(htmlFile)
  let pdfPath = 'file://' + path.resolve(pdfFile)
  console.log('pdfPath=%s', pdfPath)
  let page = await browser.newPage()
  await page.goto(htmlPath)
  await page.emulateMedia('print')
  await page.pdf({
    path: pdfFile, 
    format: 'A4', 
    margin: {top: 60, bottom: 60, left: 40, right: 40 },
    printBackground: true,
    displayHeaderFooter: true,
    // headerTemplate 參考 https://github.com/GoogleChrome/puppeteer/issues/2167
    headerTemplate: `<div class='text center'></div>`, // <div class='text left'>${meta.bookTitle||''} / ${meta.title}</div><div class=''></div>`, // <div class='date text left'></div><div class='title text center'></div>`, 
    footerTemplate: `
    <div class='text center grow'>
      <span class='pageNumber'></span>
    </div>`,
  })
  await browser.close()
}

M.convertFile = async function (mdFile, options, plugin={}) {
  let { dir, base, ext, name } = path.parse(mdFile)
  var toFile = null, toText = null
  try {
    console.log('  convert:%s', mdFile)
    let md = await fs6.readText(mdFile)
    if (options.toHtml || options.toPdf) { // 轉為 html 檔
      toFile = path.join(dir, name+'.html')
      toText = M.convert(md, 'html', plugin)
      if (options.toHtml) await fs6.writeFile(toFile, toText)
      /*
      if (options.toPdf) { // 轉為 pdf 檔
        let pdfFile = path.join(dir, name+'.pdf')
        console.log('  pdfFile=%s', pdfFile)
        await M.htmlFileToPdf(toFile, pdfFile, meta)
      }
      */
    }
    return toText
  } catch (error) { console.log('error=', error) }
}

async function handler(type, dir, attach) {
  let {stack} = attach
  switch (type) {
    case 'folder': 
      await folderVisit(dir, attach, handler)
      break
    case 'file':
      let len = stack.length, plugin = stack[len-1], {base:file} = path.parse(dir)
      if (!file.endsWith('.md') || file.startsWith('_')) break
      // 建立 header (md)
      let relativePath = '../'
      let headList = []
      for (let i=len-1; i>=1; i--) {
        let name = stack[i].pathPart
        headList.push(`[${name}](${relativePath}${stack[i].pathPart})`)
        relativePath += '../'
      }
      plugin.header = headList.reverse().join(' / ')
      await M.convertFile(dir, options, plugin)
      break
    default:
      throw Error('Error: convertAll: dirWalk' + type + ' not found !')
  }
}

async function folderVisit(dir, attach, handler) {
  let {stack} = attach
  let pathPart = path.basename(dir) // 子目錄名稱
  let parent = (stack.length > 0) ? stack[stack.length-1] : {}
  let sidebar = await fs6.readText(path.join(dir, '_sidebar.md'))
  let footer  = await fs6.readText(path.join(dir, '_footer.md'))
  let json6   = await fs6.readText(path.join(dir, '_meta.json6'))
  if (json6 != null) console.log('json6=%j', json6)
  let meta    = JSOX.parse(json6||'{}')
  meta = Object.assign(meta, parent.meta||{})
  plugin = uu6.defaults({meta, sidebar, footer, pathPart}, parent) // header, 
  stack.push(plugin)
  await fs6.dirWalk(dir, attach, handler)
  stack.pop()
}

M.convertAll = async function(root)  {
  try {
    let attach = {stack: [] }
    await folderVisit(root, attach, handler)
  } catch (error) { console.log('error=', error) }
}

