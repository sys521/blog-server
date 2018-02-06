const { query } = require('./async_db.js')

let USER = {
  hasUser (u_name) {
    let sql = `select u_name from user where u_name = '${u_name}'`
    return query(sql)   
  },
  addUser (user) {
    console.log(user)
    let obj = {u_name, u_password,u_email} = user
    console.log(obj)
    let sql = `insert into user(u_name,u_password,u_email) values ('${u_name}','${u_password}','${u_email}')`
    return query(sql)
  },
  async check (user) {
    let {u_name, u_password} = user
    let sql = `select u_password from user where u_name='${u_name}'`
    let res = await query(sql)
    try {
      let res = await query(sql)
      if (res && res[0].u_password === u_password) {
        return true
      } else {
        return false
      }
    } catch(err) {
      console.log(err, new Date())
    }
  }
}
module.exports = {
  USER
}