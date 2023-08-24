const express = require('express'); 
const http = require('http'); 
const socketIo = require('socket.io'); 
const cors = require('cors'); 

const app = express(); 
const server = http.createServer(app); 
const io = socketIo(server); 

app.use(cors()); 
app.use(express.json()); 

const messages = [];


io.on('connection', (socket) => {
  console.log('Usuario Conectado'); 

  socket.on('chat message', (message) => {
    console.log('Received message:', message);
    messages.push(message); 
    io.emit('chat message', message); 
  });

  socket.on('disconnect', () => {
    console.log('Usuario Desconectado'); 
  });
});

app.post('/send-message', (req, res) => {
  const { message } = req.body; 
  console.log('Mensagem Recebida', message); 
  messages.push(message);
  io.emit('chat message', message); 
  res.status(200).send('Message received and sent to clients');
});

app.get('/get-messages', (req, res) => {
    res.json(messages); 
  });

const port = process.env.PORT || 3001; 
server.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`); 
});
