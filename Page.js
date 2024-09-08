export default class Page {
  constructor(root) {
    this.root = root;
  }

  init() {
    const header = document.createElement('h1');
    header.textContent = 'Начали';

    this.root.append(header);
  }
}