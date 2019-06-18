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


`

let md2 = `# title
## section

aaa *bbb* __ccc__ \`ddd\`
`

describe('mdParser test', function() {
  /*
  it('parse', function() {
    let tree = md6.parse(md)
    console.log('tree=%s', JSON.stringify(tree, null, 2))
  })
  */
  it('htmlRender', function() {
    // let html = C.toHtml(md)
    let html = md6.toHtml(md)
    console.log('html=%s', html)
    // expect(html).to.contain('<i>bbb</i>')
  })
  
})
