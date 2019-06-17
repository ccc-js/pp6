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
  for (let i=0; i<len; i++) {
    const fpath = path.resolve(dir, subdirs[i])
    let isDir = (await fs6.stat(fpath)).isDirectory()
    if (isDir) {
      await handler('folder', fpath, attach)
    } else {
      await handler('file', fpath, attach)
    }
  }
}