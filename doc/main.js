const sidebar = document.querySelector('aside')

function init() {
  hljs.initHighlightingOnLoad();
  sidebar.style.width = '0px'
}

function toggleSidebar() {
  sidebar.style.width = (sidebar.style.width == '0px') ? '250px' : '0px'
}

init()