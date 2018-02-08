
const sequelize = require('./config')
const {USER, ARTICAL, COMMENT, LOVE, CONCERN} = require('./model.js')


function init_sql () {
  sequelize.authenticate()
    .then(() => {
      let tables = [USER, ARTICAL, COMMENT, LOVE, CONCERN]
      tables.map(e => {
        e.sync().then(res => {
          console.log(`${res} 初始化完成`)
        })
      })
    }).catch(err => {
      console.error('Unable to connect to the database:', err);
  });
}

module.exports = init_sql