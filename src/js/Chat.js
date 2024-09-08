import ChatAPI from "./api/ChatAPI";
import Modal from "./Modal";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
    this.modal = new Modal(this.validateUserName.bind(this));
  }

  init() {
    //const modal = new Modal(this.validateUserName.bind(this));
    this.container.append(this.modal.render());


  }

  bindToDOM() {}

  registerEvents() {}

  subscribeOnEvents() {}

  onEnterChatHandler() {}

  sendMessage() {}

  renderMessage() {}

  async validateUserName(inputText) {
    const options = {
      name: inputText
    };
    await fetch('https://socket-server-3il3.onrender.com/new-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(options)
    })
    .then(res => res.json())
    .then(result => console.log(result));
    //this.modal.disable();
  }
}
