import Chat from './Chat';

const root = document.getElementById('root');

const app = new Chat(root);

app.init();

const ws = new WebSocket('https://socket-server-3il3.onrender.com');

ws.addEventListener('open', e => {
  console.log(e);

  console.log('ws open');
})

ws.addEventListener('close', e => {
  console.log(e);

  console.log('ws close');
})

ws.addEventListener('error', e => {
  console.log(e);

  console.log('ws error');
})

ws.addEventListener('message', e => {
  console.log(e);

  const data = JSON.parse(e.data)

  console.log('ws message');
})
