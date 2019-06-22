var sidebar = null

function init() {
  sidebar = document.querySelector('aside')
  sidebar.style.width = '0px'
}

function toggleSidebar() {
  sidebar.style.width = (sidebar.style.width == '0px') ? '250px' : '0px'
}

window.addEventListener('load', init)
hljs.initHighlightingOnLoad()
document.addEventListener("DOMContentLoaded", function () {
  var mathElements = document.getElementsByClassName("math");
  for (var i = 0; i < mathElements.length; i++) {
    var texText = mathElements[i].firstChild;
    if (mathElements[i].tagName == "SPAN") { katex.render(texText.data, mathElements[i], { displayMode: mathElements[i].classList.contains("display"), throwOnError: false } );
}}});