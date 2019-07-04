const sv6 = require('../sv6')
const server = module.exports = new sv6.Server()
const koa = server.koa
const fs = require('fs')
const fs6 = require('../fs6')
const path = require('path')
const pub = require('./pub')
pub.htmlRender.options.defaultExt = ''

koa.use(async function(ctx) {
  let dpath = decodeURI(ctx.path)
  console.log('  dpath=%s', dpath)
  let fpath = path.join(server.root, dpath)
  let ext = path.extname(fpath)
  let fstat = await fs6.stat6(fpath)
  if (fstat != null && fstat.isFile()) { // 檔案存在，傳回該檔案的串流
    ctx.type = ext
    ctx.body = fs.createReadStream(fpath)
  } else if (ext.trim().length === 0) { // 沒有副檔名
    let mdPath = fpath+'.md'
    let mdStat = await fs6.stat6(mdPath)
    if (mdStat != null && mdStat.isFile()) { // 看看是否 '.md' 檔存在，是的話就轉成 html 傳回。
      ctx.type = 'html'
      let mdBuffer = await fs6.readFile(mdPath)
      let mdText = mdBuffer.toString()
      // console.log('mdText=', mdText)
      ctx.body = pub.toHtml(mdText, {meta:{}, header: pub.path2link(dpath)}) // md2html(mdText)
    }
  }
})


