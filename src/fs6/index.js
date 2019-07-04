const fs = require('fs')
const fs6 = module.exports = fs.promises
const path = require('path')

fs6.readText = async function (filePath) {
  try {
    return await fs6.readFile(filePath, 'utf8')
  } catch (error) {
   return null
  }
}

fs6.readTextSync = function (filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
   return null
  }
}

fs6.dirWalk = async function (dir, attach, handler) {
  const subdirs = await fs6.readdir(dir)
  let len = subdirs.length
  // let list = []
  for (let i=0; i<len; i++) {
    const fpath = path.resolve(dir, subdirs[i])
    let isDir = (await fs6.stat(fpath)).isDirectory()
    if (isDir) {
      // list.push(handler('folder', fpath, attach))
      await handler('folder', fpath, attach)
    } else {
      // list.push(handler('file', fpath, attach))
      await handler('file', fpath, attach)
    }
  }
  // Promise.all(list) // .catch(function (err) { console.log('err=', err) })
}

fs6.stat6 = async function (fpath) {
  try {
    const fstat = await fs6.stat(fpath)
    return fstat
  } catch (error) {
    return null
  }
}