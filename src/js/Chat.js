import ChatAPI from "./api/ChatAPI";
import Modal from "./Modal";
import LS from "./api/LS";
import { validateUser, getMessages, getAllUsers } from './api/connections';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.modal = new Modal(this.validateUserName.bind(this));
    this.ws;
    this.sentMsgs = false;
  }

  async init() {
    if (LS.isUserNameExist()) {

      const exitCont = this.createExitLink();
      this.container.append(exitCont);
      
      const chat = await this.createChat();
      this.container.append(chat);

      if (this.ws) {
        this.ws.removeEventListener('open');
        this.ws.removeEventListener('close');
        this.ws.removeEventListener('error');
        this.ws.removeEventListener('message');
      }

      this.ws = new WebSocket('ws://localhost:3000/ws');
      this.ws.addEventListener('open', e => {
        this.ws.send(JSON.stringify({type: 'onOpen', name: LS.getUserName()}));
      });

      this.ws.addEventListener('close', e => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({type: 'onClose', name: LS.getUserName()}));
        }
      });

      this.ws.addEventListener('error', e => {
      });

      this.ws.addEventListener('message', e => {
        const data = JSON.parse(e.data);
        if (data.type) {
          this.updateUserList();
        } else {
          this.updateMessages(data);
          this.updateUserList();
        }
      });
    } else {
      this.container.append(this.modal.render());
    }
  }

  async validateUserName(inputText, hint) {
    const options = {
      name: inputText
    };

    await validateUser.apply(this, [options, inputText, hint]);
  }

  createExitLink() {
    const exitCont = document.createElement('div');
      exitCont.className = 'exitCont';

      const exitLink = document.createElement('a');
      exitLink.className = 'exitLink';
      exitLink.textContent = 'Выйти';
      exitLink.href = '#';
      exitLink.addEventListener('click', e => {
        e.preventDefault();
        LS.deleteUserName();
        this.container.textContent = '';
        this.ws.close();
        this.init();
      });

      exitCont.append(exitLink);
      return exitCont;
  }

  async createChat() {
    const chatCont = document.createElement('div');
    chatCont.className = 'chat__cont';

    //messages
    const msgsCont = document.createElement('div');
    msgsCont.className = 'chat__msgCont';

    const msgsContHeader = document.createElement('h3');
    msgsContHeader.textContent = 'Список сообщений';
    msgsCont.append(msgsContHeader);

    //msgs list
    const msgsListCont = document.createElement('div');
    msgsListCont.className = 'chat__msgsListCont';

    const messages = await getMessages();

    if (messages.length) {
      messages.forEach (e => {
        const msgItem = this.createMessage(e);
        msgsListCont.append(msgItem);
      });
    } else {
      const noMesgsBlock = document.createElement('h5');
      noMesgsBlock.textContent = 'Приветствуем вас в чате, ' + LS.getUserName();
      msgsListCont.append(noMesgsBlock);
    }
    msgsListCont.scrollTo({ top: 9999, left: 0, behavior: 'smooth'});

    msgsCont.append(msgsListCont);

    //input
    const inputArea = this.createInputArea();
    msgsCont.append(inputArea);
    chatCont.append(msgsCont);
    
    //users
    const chatUserList = await this.createUserList();
    chatCont.append(chatUserList);

    return chatCont;
  }

  createInputArea() {
    const inputArea = document.createElement('form');
    inputArea.className = 'chat__inputCont';
    inputArea.addEventListener('submit', (e) => this.sendMessageHandler(e));

    const chatInput = document.createElement('input');
    chatInput.className = 'chat__input';
    chatInput.placeholder = 'Введите сообщение';
    inputArea.append(chatInput);

    const chatSubmitBtn = document.createElement('button');
    chatSubmitBtn.className = 'chat__submitBtn';
    chatSubmitBtn.textContent = 'Отправить';
    chatSubmitBtn.type = 'submit';
    inputArea.append(chatSubmitBtn);

    return inputArea;
  }

  createUser(user) {
    const chatUserItem = document.createElement('div');
    chatUserItem.className = 'chat__userItem';
    chatUserItem.textContent = user;

    return chatUserItem;
  }

  createMessage(msg) {
    const msgItem = document.createElement('div');
    if (msg.name === LS.getUserName()) {
      msgItem.className = 'chat__msgItem chat__msgItem-own';
    } else {
      msgItem.className = 'chat__msgItem chat__msgItem-all';
    }
    msgItem.textContent = msg.name + ': ' + msg.message;

    return msgItem;
  }

  async createUserList() {
    const chatUserList = document.createElement('div');
    chatUserList.className = 'chat__usersListCont';

    const chatUserListHeader = document.createElement('h3');
    chatUserListHeader.textContent = 'Список пользователей';
    chatUserList.append(chatUserListHeader);
    
    const users = await getAllUsers();
    users.forEach(e => {
      const chatUserItem = this.createUser(e.name);
      chatUserList.append(chatUserItem);
    });

    return chatUserList;
  }

  sendMessageHandler(e) {
    const form = document.querySelector('.chat__inputCont');
    if (form) {
      e.preventDefault();
      const input = document.querySelector('.chat__input');

      if (input && input.value !== '') {
        this.sentMsgs = true;
        this.ws.send(JSON.stringify({type: 'onMessage', name: LS.getUserName(), message: input.value}));
        input.value = '';
      }
    }
  }

  updateMessages(msgsArr) {
    const msgsListCont = document.querySelector('.chat__msgsListCont');
    if (msgsArr.length && this.sentMsgs) {
      msgsArr.forEach (e => {
        const msgItem = this.createMessage(e);
        msgsListCont.append(msgItem);
      });
    }
    msgsListCont.scrollTo({ top: 9999, left: 0, behavior: 'smooth'});
  }

  async updateUserList() {
    const newUsersList = await getAllUsers();
    
    if (newUsersList.length) {
      const userList = document.querySelector('.chat__usersListCont');
      userList.textContent = '';
      const chatUserListHeader = document.createElement('h3');
      chatUserListHeader.textContent = 'Список пользователей';
      userList.append(chatUserListHeader);

      newUsersList.forEach(e => {
        const chatUserItem = this.createUser(e.name);
        userList.append(chatUserItem);
      });
    }
  }
}