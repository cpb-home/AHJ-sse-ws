export default class Modal {
  constructor(callback) {
    this.callback = callback;
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'modal__background';

    const content = document.createElement('div');
    content.className = 'modal__content';

    const header = document.createElement('h3');
    header.className = 'modal__header';
    header.textContent = 'Выберите псевдоним';
    content.append(header);

    const body = this.createBody();
    content.append(body);

    const footer = this.createFooter();
    content.append(footer);

    modal.append(content);

    return modal;
  }

  createBody() {
    const body = document.createElement('div');
    body.className = 'modal__body';

    const form = this.createForm();
    body.append(form);

    const hint = document.createElement('div');
    hint.className = 'form__hint';
    body.append(hint);

    return body;
  }

  createForm() {
    const form = document.createElement('form');
    form.className = 'form__group';

    const input = document.createElement('input');
    input.className = 'form__input';

    const label = document.createElement('label');
    label.className = 'form__label';
    label.textContent = 'Псевдоним';
    label.append(input);
    form.append(label);

    return form;
  }

  createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'modal__footer';

    const okBtn = this.createOkBtn();
    footer.append(okBtn);

    const cancellBtn = this.createCancelBtn();
    footer.append(cancellBtn);

    return footer;
  }

  createOkBtn() {
    const btn = document.createElement('button');
    btn.className = 'modal__ok';
    btn.textContent = 'Подвердить';

    btn.addEventListener('click', () => {
      const input = document.querySelector('.form__input');
      const hint = document.querySelector('.form__hint');

      if (input.value === '') {
        hint.textContent = 'Вы не указали псевдоним';
      } else {
        this.callback(input.value);
      }
    })

    return btn;
  }

  createCancelBtn() {
    const btn = document.createElement('button');
    btn.className = 'modal__close';
    btn.textContent = 'Отмена';

    btn.addEventListener('click', () => {
      const hint = document.querySelector('.form__hint');
      if (hint) {
        hint.textContent = 'Вы не можете войти в чат без указания псевдонима';
      }
    })

    return btn;
  }

  disable() {
    const modal = document.querySelector('.modal__background');
    modal.style.display = 'none';
  }
}