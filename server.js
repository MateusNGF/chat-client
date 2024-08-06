const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (ws) => {
  console.log('Novo cliente conectado', ws.protocol);
  clients.add(ws);

  ws.on('message', (message) => {
     broadcast(message, ws)
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Cliente desconectado');
  });
});

function broadcast(message, from) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== from) {
            console.log({message})
            client.send(message);
          }
    })
}


function randomGenerateID(){
    return crypto.randomBytes(2).toString('hex')
}