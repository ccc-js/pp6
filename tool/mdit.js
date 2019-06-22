const mdit = require('markdown-it')()
/*
const mdit = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
})

mdit.use(require('markdown-it-katex'))
*/
module.exports = mdit