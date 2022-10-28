import axios from "axios";
// import { useStore } from "@/store/index";

const API_URL = "http://localhost:3000/v1/auth/";
// const store = useStore();

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.tokens.access && response.data.tokens.refresh) {
          localStorage.setItem("tokens", JSON.stringify(response.data.tokens));
          // store.$patch({
          //   isUserLoggedIn: true,
          //   loggedUser: response.data.user,
          // });
        }
        return response;
      });
  }

  logout() {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    //eslint-disable-next-line
    debugger;
    if (tokens)
      return axios
        .post(API_URL + "logout", {
          refreshToken: tokens.refresh.token,
        })
        .then((response) => {
          localStorage.removeItem("tokens");
        })
        .catch((err) => {
          console.log(err);
        });
  }

  register(user) {
    return axios.post(API_URL + "register", {
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
