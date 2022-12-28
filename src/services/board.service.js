import axios from "axios";
// import { useStore } from "@/store/index";

// const store = useStore();
const API_URL = "http://localhost:3000/";

class BoardService {
  createBoard(board) {
    let token = localStorage.getItem("token");
    return axios.post(
      API_URL + "boards",
      {
        title: board.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getBoards() {
    let token = localStorage.getItem("token");
    //eslint-disable-next-line
    // debugger;
    return axios.get(API_URL + "me/boards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new BoardService();
