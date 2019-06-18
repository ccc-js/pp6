let inline = function (text) {
  var regexp = /((``(?<code2>.*?)``)|(`(?<code1>.*?)`)|(\*\*(?<star2>.*?)\*\*)|(\*(?<star1>.*?)\*)|(__(?<under2>.*)?__)|(_(?<under1>.*?)_)|(\$(?<math>.*?)\$)|(<(?<url>.*?)>)|(?<link>\[(?<text>[^\]]*?)\]\((?<href>[^\"\]]*?)("(?<title>.*?)")?\)))/g
  // var regexp = /(?<link>\[(?<text>[^\]]*?)\]\((?<href>[^\"\]]*?)("(?<title>.*?)")?\))/g
  var m, lastIdx = 0, list = [], len = text.length
  while ((m = regexp.exec(text)) !== null) {
    if (m.index > lastIdx) list.push({type:'text', body:text.substring(lastIdx, m.index)})
    let obj = {}, type, body
    for (let key in m.groups) {
      let value = m.groups[key]
      if (value != null) {
        obj[key] = value
        type = key
        body = value
      }
    }
    console.log('obj=%j', obj)
    if (obj.link != null)
      obj = {type:'link', text:obj.text, href:obj.href, title:obj.title}
    else 
      obj = {type, body}
    // console.log('obj=%j', obj)
    list.push(obj)
    lastIdx = regexp.lastIndex
  }
  if (len > lastIdx) list.push({type:'text', body:text.substring(lastIdx, len)})
  console.log('list=%j', list)
  return list
}

inline('aaa **b*d*b**_ccc_ *ddd*`e[i]ee`$\int_0^x f(x) dx$ ggg [text](link) ttt [text](link "title") ')
