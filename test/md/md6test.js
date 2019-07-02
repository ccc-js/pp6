const expect = require('js6/se6').expect
const uu6 = require('js6/uu6')
const md6 = require('../../src/md6')

// let md = 'aaa *bbb* ccc \n **ddd** $\\int_0^x f(x)$ eee `fff`'
let md = `
[id]: path/to/file "title"

---

...  [text](path/to/file "title")

\`\`\`json6
{
  name: 'ccc',
  age: 49
}
\`\`\`

---

*******

# title

aaa *bbb* ccc _xxx_ 
ddd eee fff

## section

**ddd** $\\int_0^x f(x)$ eee __yyy__ 

title
=====================

section
----------------------

\`\`\`json6
{
  name: 'ccc',
  age: 49
}
\`\`\`

link to [YouTube](https://tw.youtube.com)

![an image](/path/to/image)

$$
\\int_0^x f(x)
$$

    tabline1
    tabline2
    tabline3


f1 | f2 | f3
---|----|-----
x11 | x12 | x13
x21 | x22 | x23

[ccc2019]: #ccc2019 "A paper of ccc"


ttt \`fff\` .. 

\`\` aaa \` bbb \`\` 



> ... &... <https://tw.youtube.com> ...
> ... &amp; ...

1. aaa
2. bbb
    1. bbb1
    2. bbb2
    3. bbb3
        * bbb3.1
        * bbb3.2
        * bbb3.3
* ccc
* ddd


$$
\\int_0^x f(x) dx
$$

embed : ... $\\int_0^x f(x) dx$ ...

\`\`\`js
function add(x,y) {
  return x+y
}
\`\`\`

pub6 出版系統\r\n\r\n* [book](book)\r\n* [journal](journal)\r\n

`

let md0 = `[course.wiki](../index.html) / [ws](index.html)`

let md2 = `


f1 | f2 | f3
---|----|-----
x11 | x12 | x13
x21 | x22 | x23

|f1 | f2 | f3 |
|---|----|-----|
|x11 | x12 | x13|
|x21 | x22 | x23|

`



describe('mdParser test', function() {

  it('parse', function() {
    let tree = md6.parse(md2)
    console.log('tree=%s', JSON.stringify(tree, null, 2))
  })

  it('htmlRender', function() {
    let html = md6.toHtml(md2)
    console.log('html=%s', html)
    // expect(html).to.contain('<i>bbb</i>')
  })

  it('htmlRender(options)', function() {
    let r = md6.newHtmlRender({defaultExt: '.html'})
    console.log('html=%s', r.render(md2))
    // expect(html).to.contain('<i>bbb</i>')
  })
})
