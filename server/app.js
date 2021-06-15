const path = require('path')
const express = require('express')
const morgan = require('morgan')
const app = express()
module.exports = app

// logging middleware
app.use(morgan('dev'))

// body parsing middleware
app.use(express.json())

const { db, models: { Message, User } } = require('./db');
console.log(Object.keys(db.Sequelize));
app.get('/api/messages', async(req, res, next)=> {
  try {
    const user = await User.findByToken(req.headers.authorization);
    res.send(await Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { fromId: user.id },
          { toId: user.id }
        ]
      },
      include: [
        { model: User, as: 'to'},
        { model: User, as: 'from'}
      ],
      order: [
        ['createdAt', 'desc']
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/messages', async(req, res, next)=> {
  try {
    const user = await User.findByToken(req.headers.authorization);
    const message = await Message.create({ text: req.body.text, fromId: user.id, toId: req.body.toId});
    await message.reload({ include: [
      { model: User, as: 'to'},
      { model: User, as: 'from'}
    ]});
    res.send(message);
  }
  catch(ex){
    next(ex);
  }
});

// auth and api routes
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '..', 'public/index.html')));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})
