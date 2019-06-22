const C = require('./compiler')
const G = require('./generator')
const M = module.exports = {}

let htmlHeader = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
  <meta charset="utf-8" />
  <meta name="generator" content="pandoc" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <title>math</title>
  <style>
      code{white-space: pre-wrap;}
      span.smallcaps{font-variant: small-caps;}
      span.underline{text-decoration: underline;}
      div.column{display: inline-block; vertical-align: top; width: 50%;}
  </style>
  <!-- katex -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js"></script>
  <script>document.addEventListener("DOMContentLoaded", function () {
    var mathElements = document.getElementsByClassName("math");
    for (var i = 0; i < mathElements.length; i++) {
      var texText = mathElements[i].firstChild;
      if (mathElements[i].tagName == "SPAN") { katex.render(texText.data, mathElements[i], { displayMode: mathElements[i].classList.contains("display"), throwOnError: false } );
    }}});</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"/>
  <!-- highlight.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
  <script>hljs.initHighlightingOnLoad();</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/vs.min.css"/>
  <!--[if lt IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.min.js"></script>
  <![endif]-->
</head>
<body>
`

let htmlTail = `
</body>
</html>
`

M.toHtml = function (md, options={}) {
  let html = C.compile(md, G.htmlRender)
  return (options.standalone) ? `${htmlHeader}${html}${htmlTail}` : html
}

M.parse = function (md) {
  return C.compile(md, G.treeGenerator)
}
