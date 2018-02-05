const config = require('./config.js')

let mysql = require('mysql')

var pool = mysql.createPool(config)
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, (err,res) => {
          if (err) {
            reject(err)
          } else {
            var string = JSON.stringify(res)
            var data = JSON.parse(string)
            resolve(data)
          }
        })
        connection.release()
      }
    })
  })
}

module.exports = {
  query
}