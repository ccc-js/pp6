const C = require('./compiler')
const G = require('./generator')
const M = module.exports = {}

M.toHtml = function (md) {
  return C.compile(md, G.htmlRender)
}

M.parse = function (md) {
  return C.compile(md, G.treeGenerator)
}