
const sequelize = require('./config')
const {USER, ARTICAL, COMMENT, LOVE, CONCERN, ARTICALIMGS} = require('./model.js')

USER.hasMany(ARTICAL,{foreignKey: 'user_id'})
USER.hasMany(LOVE, {foreignKey: 'user_id'})
ARTICAL.hasMany(LOVE, {foreignKey: 'artical_id'})
USER.hasMany(CONCERN, {foreignKey: 'from_id'})

function init_sql () {
  sequelize.authenticate()
    .then(() => {
      let tables = [USER, ARTICAL, COMMENT, LOVE, CONCERN, ARTICALIMGS]
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