import axios from "axios";
// import { useStore } from "@/store/index";

const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://todolist-api-production-ec65.up.railway.app";
// const store = useStore();

class AuthService {
  login(user) {
    return axios
      .post(BASE_URL + "/auth/login", {
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
      .get(BASE_URL + "/me", {
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
    return axios.post(BASE_URL + "/users", {
      email: user.email,
      password: user.password,
      password_confirmation: user.passwordConfirmation,
    });
  }
}

export default new AuthService();
