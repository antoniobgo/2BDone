import axios from "axios";
// import { useStore } from "@/store/index";

const API_URL = "http://localhost:3000/";
// const store = useStore();

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "/auth/login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          // store.$patch({
          //   isUserLoggedIn: true,
          //   loggedUser: response.data.user,
          // });
        }
        return response;
      });
  }

  loginWithToken() {
    const token = localStorage.getItem("token");
    return axios
      .get(API_URL + "me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.user && response.status === 200) {
          return response.data.user;
        }
        return false;
      });
  }

  logout() {
    localStorage.removeItem("token");
  }

  register(user) {
    return axios.post(API_URL + "/users", {
      email: user.email,
      password: user.password,
      password_confirmation: user.passwordConfirmation,
    });
  }
}

export default new AuthService();
