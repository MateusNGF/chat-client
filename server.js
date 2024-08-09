const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const server = http.createServer();
const io = new Server(server, { 
  cors: {
    origin: "*", // Atenção: Permitir todas as origens não é recomendado para produção
    methods: ["GET", "POST"]
  }
});

const clients = new Map();
const groups = new Map();

// Função para gerar um ID único para os grupos
function generateUniqueGroupId() {
    let id;
    do {
        id = crypto.randomBytes(4).toString('hex').toUpperCase();
    } while (groups.has(id));
    return id;
}

// Evento ao conectar
io.on('connection', (socket) => {
    clients.set(socket, { groupsConnected: new Set() });

    // Evento para envio de mensagens
    socket.on('message', (payload) => {
        const { groupId, message } = JSON.parse(payload);
        const group = groups.get(groupId);

        if (group) {
            group.subscribers.forEach((subscriber) => {
                if (subscriber !== socket) {
                    subscriber.emit('message', JSON.stringify({ groupId, message }));
                }
            });
        }
    });

    // Evento ao desconectar
    socket.on('disconnect', () => {
        const clientData = clients.get(socket);
        if (clientData) {
            clientData.groupsConnected.forEach((groupId) => {
                const group = groups.get(groupId);
                if (group) {
                    group.subscribers.delete(socket);
                    if (group.subscribers.size === 0) {
                        groups.delete(groupId); // Remove o grupo se não houver mais inscritos
                    } else {
                        // Notifica os usuários restantes
                        group.subscribers.forEach((subscriber) => {
                            subscriber.emit('updateUsersOnline', {
                                quantity: group.subscribers.size,
                                groupId: groupId
                            });
                        });
                    }
                }
            });
            clients.delete(socket);
        }
    });

    // Evento para criação de grupos
    socket.on('createGroup', (owner, callback) => {
        const groupId = generateUniqueGroupId();
        const newGroup = {
            id: groupId,
            owner: owner,
            subscribers: new Set([socket])
        };

        groups.set(groupId, newGroup);
        const infoClient = clients.get(socket)
        if (infoClient.groupsConnected.size > 2) {
          return callback({ error: 'Limit of created groups reached, limit at 2 groups.' });
        }

        infoClient.groupsConnected.add(groupId); 

        callback({
            id: groupId,
            onlines: newGroup.subscribers.size,
            messages: []
        });
    });

    // Evento para ingresso em um grupo existente
    socket.on('joinGroup', ({ groupId }, callback) => {
        const group = groups.get(groupId); callback

        if (!group) {
            return callback({ error: 'Group not found' });
        }

        if (group.subscribers.has(socket)) {
            return callback({ error: 'Already joined' });
        }

        group.subscribers.add(socket);
        clients.get(socket).groupsConnected.add(groupId);

        // Notifica os usuários do grupo sobre o novo inscrito
        group.subscribers.forEach((subscriber) => {
            if (subscriber !== socket) {
                subscriber.emit('updateUsersOnline', {
                    quantity: group.subscribers.size,
                    groupId: groupId
                });
            }
        });

        callback({
            id: groupId,
            onlines: group.subscribers.size,
            messages: []
        });
    });
});

server.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
