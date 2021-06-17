const { db } = require('./db')
const PORT = process.env.PORT || 8080
const app = require('./app')
const seed = require('../script/seed');
const io = require('socket.io');

const init = async () => {
  try {
    if(process.env.SEED === 'true'){
      await seed();
    }
    else {
      await db.sync()
    }
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
    const socketServer = new io.Server(server);
    socketServer.on('connection', (socket)=> {
      console.log(socket);
      //TODO - this should send us a token for security
      //for starters- just sending user
      socket.on('auth', (user)=> {
        console.log(user);
        socket.join(user.id);
      });
      socket.on('action', (action)=> {
        socketServer.to(action.message.toId).emit('action', action);
      });
    });
  } catch (ex) {
    console.log(ex)
  }
}

init()
