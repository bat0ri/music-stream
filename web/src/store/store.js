import { makeAutoObservable } from 'mobx';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../mutations/user';


class AuthStore {

  isAuthenticated = false;
  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  login = async (email, password) => {

    const [loginUser] =  useMutation(LOGIN_USER);

    try {
        const { data } = await loginUser({
            variables: {
                email,
                password
            }
        });
        console.log("Вход выполнен", data)
        this.isAuthenticated = true;
        this.user = data.login.email;
    } catch (error) {
        console.log(error.message);
    }
  };

  logout = () => {
    this.isAuthenticated = false;
    this.user = null;
  };
}

const authStore = new AuthStore();

export default authStore;
