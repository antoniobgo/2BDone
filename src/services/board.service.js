import axios from "axios";
// import { useStore } from "@/store/index";

const API_URL = "http://localhost:3000/";
// const store = useStore();

class BoardService {
  // createBoard(board) {
  //   return axios
  //     .post(API_URL + "login", {
  //       email: user.email,
  //       password: user.password,
  //     })
  //     .then((response) => {
  //       if (response.data.tokens.access && response.data.tokens.refresh) {
  //         localStorage.setItem("tokens", JSON.stringify(response.data.tokens));
  //         // store.$patch({
  //         //   isUserLoggedIn: true,
  //         //   loggedUser: response.data.user,
  //         // });
  //       }
  //       return response;
  //     });
  // }

  // TODO: enviar tokens.
  getBoards() {
    let token = JSON.parse(localStorage.getItem("token"));
    //eslint-disable-next-line
    // debugger;
    return axios.get(API_URL + "me/boards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // register(user) {
  // return axios.post(API_URL + "register", {
  // name: user.name,
  // email: user.email,
  // password: user.password,
  // });
  // }
}

export default new BoardService();
