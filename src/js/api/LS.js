export default class LS {
  static addUserName(name) {
    const ls = localStorage;
    ls.setItem('userName', name);
  }

  static isUserNameExist() {
    const ls = localStorage;
    const userName = ls.getItem('userName');
    if (userName) {
      return true;
    }
    return false;
  }

  static deleteUserName() {
    const ls = localStorage;
    ls.removeItem('userName');
  }

  static getUserName() {
    const ls = localStorage;
    const userName = ls.getItem('userName');
    if (userName) {
      return userName;
    }
    return '';
  }
}