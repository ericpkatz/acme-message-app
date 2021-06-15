//this is the access point for all things database related!

const db = require('./db')
const { INTEGER, STRING } = db.Sequelize.DataTypes;

const User = require('./models/User')
const Message = db.define('message', {
  text: {
    type: STRING,
    defaultValue: 'hi'
  },
  fromId: {
    type: INTEGER,
    allowNull: false
  },
  toId: {
    type: INTEGER,
    allowNull: false
  }
});

//associations could go here!
Message.belongsTo(User, { as: 'from' });
Message.belongsTo(User, { as: 'to' });

module.exports = {
  db,
  models: {
    User,
    Message
  },
}
