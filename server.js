const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, { 
  cors: {
    origin: "*", // Permitir todas as origens (não recomendado para produção)
    methods: ["GET", "POST"]
  }
});

const clients = new Set();

io.on('connection', (socket) => {

  processSingInUser(socket);

  socket.on('message', (message) => {
      broadcast(message, socket);
  });
  
  socket.on('disconnect', () => {
      clients.delete(socket);
      io.emit('updateUsersOnline', { quantity: clients.size });
  });
});


/**
 * 
 * @param {import('socket.io').Socket} socket 
 */
function processSingInUser(socket){
  console.log('Client connected');
  clients.add(socket);

  // Atualiza a quantidade de usuários online
  io.emit('updateUsersOnline', { quantity: clients.size });
}


function broadcast(message, from) {
  clients.forEach((client) => {
    if (client !== from) {
      client.send(message);
    }
  })
}

server.listen(8080, () => {
  console.log('Servidor rodando na porta 8080');
});


function randomGenerateID(){
    return crypto.randomBytes(2).toString('hex')
}