let {query} = require('./async_db.js')
let fs = require('fs')

let showTables = 'show tables'

// 获取数据库中所有表
async function getTables () {
  let res = await query(showTables)
  if (res.length > 0) {
    tableList = res.map(e => {
      return e.Tables_in_blog
    })
    return tableList
  } else {
    return []
  }
}

module.exports = getTables
