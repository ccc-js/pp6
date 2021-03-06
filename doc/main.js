var sidebar = null

function init() {
  sidebar = document.querySelector('aside')
  sidebar.style.width = '0px'
  var mathElements = document.getElementsByClassName("math");
  for (var i = 0; i < mathElements.length; i++) {
    var texText = mathElements[i].firstChild;
    if (mathElements[i].tagName == "SPAN") {
      katex.render(texText.data, mathElements[i], { 
        displayMode: mathElements[i].classList.contains("display"), 
        throwOnError: false
      })
    }
  }
}

function toggleSidebar() {
  sidebar.style.width = (sidebar.style.width == '0px' || sidebar.style.width == '' ) ? '250px' : '0px'
}

// hljs.initHighlightingOnLoad()
window.addEventListener('load', init)

