// 读取文件
const readFile = require('./readFile.js')

// 获取文件夹下所有文件列表(去掉.sql扩展)
const getDirList = require('./getDirList.js')

// 获取数据库中所有表文件
const getTables = require('./getAllTables.js')

// 异步封装的连接池query
const {query} = require('./async_db.js')

const dirPath = __dirname +  '/' + 'sql'

async function init_sql(){
  console.log('开始初始化数据库文件')
  let sqlTables = await getTables()
  console.log(`数据库中已有表:${sqlTables}`)
  let sqlFiles = getDirList(dirPath)
  console.log(`sql文件:${sqlFiles}`)
  // sql文件夹下，未初始化的文件
  let not_init_files = sqlFiles.filter(e => {
    if (sqlTables.indexOf(e) === -1) {
      return e
    }
  })
  console.log(`未初始化数据库表:${not_init_files}`)
  if (not_init_files.length > 0) {
    not_init_files.map(e => {
      let _path = dirPath + '/' + e + '.sql'
      console.log(_path)
      readFile(_path).then(res => {
        console.log(`读取数据库文件:${e}, success`)
        return query(res)
      }).then(res => {
        console.log(`执行数据库文件:${e}, success`)
      }).catch(err => {
        console.log(`执行数据库文件:${e}, err:${err}`)
      })
    })
  }
}

module.exports = init_sql