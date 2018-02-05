const fs = require('fs')
// 获取指定路径下所有的文件，返回去掉.sql的文件名字。
function getDirList (path) {
  let files = fs.readdirSync(path)
  let filesNameList = files.map(e => {
    return e.split('.sql').join('')
  })
  return filesNameList
}

module.exports = getDirList
