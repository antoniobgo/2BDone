import axios from "axios";
// import { useStore } from "@/store/index";

const API_URL = "http://localhost:3000/v1/boards";
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
  getBoards(userId) {
    return axios.get(API_URL, { params: { userId } });
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
