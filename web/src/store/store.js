import { makeAutoObservable } from 'mobx';


export default class AuthStore {

  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
      this.isAuthenticated = true;
    }
  }

  async singIn (loginUser, email, password) {

    try {
        const { data } = await loginUser({
            variables: {
                email,
                password
            }
        });
        console.log("Вход выполнен", data)
        this.isAuthenticated = true;
        localStorage.setItem('access', data.login.token);
    } catch (error) {
        console.log(error.message);
    }
  };

  async logout () {
    this.isAuthenticated = false;
    localStorage.removeItem('access');
  };
};
