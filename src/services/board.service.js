import axios from "axios";
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
    return axios.get(API_URL + "me/boards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getBoardSections(boardId) {
    let token = localStorage.getItem("token");
    return axios.get(`${API_URL}/boards/${boardId}/sections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getSectionItems(sectionId) {
    let token = localStorage.getItem("token");
    return axios.get(`${API_URL}/sections/${sectionId}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new BoardService();
