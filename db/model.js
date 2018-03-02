const Sequelize = require('sequelize')
const sequelize = require('./config')

const USER = sequelize.define('users', {
  user_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  user_name: {type: Sequelize.STRING, unique: true},
  user_email: {type: Sequelize.STRING},
  user_password: {type: Sequelize.STRING},
  user_displayName: {type: Sequelize.STRING},
  user_header: {type: Sequelize.STRING}
})

const ARTICAL = sequelize.define('articals', {
  artical_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  artical_name: {type: Sequelize.STRING},
  artical_abstract: {type: Sequelize.TEXT},
  artical_content: {type: Sequelize.TEXT},
  artical_status: {type: Sequelize.STRING},
  artical_clicktimes: {type: Sequelize.INTEGER},
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: USER,
      key: 'user_id'
    }
  }
})

const LOVE = sequelize.define('love', {
  love_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: USER,
      key: 'user_id'
    }
  },
  artical_id: {
    type: Sequelize.INTEGER,
    references: {
      model: ARTICAL,
      key: 'artical_id'
    }
  }
})

const COMMENT = sequelize.define('comments', {
  comment_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  content: {type: Sequelize.TEXT},
  from_id: {
    type: Sequelize.INTEGER,
    references: {
      model: USER,
      key: 'user_id'
    }
  },
  to_id: {
    type: Sequelize.INTEGER,
    references: {
      model: USER,
      key: 'user_id'
    }
  }
})

const ARTICALIMGS = sequelize.define('articalimgs', {
  imgs_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  imgs_url: {type: Sequelize.STRING},
  artical_id: {
    type: Sequelize.INTEGER,
    references: {
      model: ARTICAL,
      key: 'artical_id'
    }
  }
})

const CONCERN = sequelize.define('concern', {
  concern_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  from_id: {
    type: Sequelize.INTEGER,
    references: {
      model: USER,
      key: 'user_id'
    }
  },
  to_id: {
    type: Sequelize.INTEGER,
    references: {
      model: USER,
      key: 'user_id'
    }
  }
})

module.exports = {
  USER,
  ARTICAL,
  COMMENT,
  LOVE,
  CONCERN,
  ARTICALIMGS
}