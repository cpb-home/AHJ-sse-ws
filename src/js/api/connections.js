const SERVER_URL = 'https://ahj-sse-ws-server.onrender.com/';
import LS from "./LS";

export function validateUser(options, inputText, hint) {
  fetch(SERVER_URL + 'new-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(options)
  })
  .then(res => {
    if (res.status === 409) {
      hint.textContent = 'Такой ник уже существует. Введите другой.';
    } else {
      LS.addUserName(inputText);
      this.modal.disable();
      this.container.textContent = '';
      this.init();
    }
  })
}

export async function getMessages() {
  const fetchMessages = await fetch(SERVER_URL + 'chat', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  return await fetchMessages.json();
}

export async function getAllUsers() {
  const response = await fetch(SERVER_URL + 'users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  const data = await response.json();
  return data;
}