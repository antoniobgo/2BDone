import axios from "axios";
const API_URL = "http://localhost:3000/";

class BoardService {
  createBoard(board) {
    const token = localStorage.getItem("token");
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

  editBoard(newBoard) {
    const token = localStorage.getItem("token");
    return axios.patch(
      `${API_URL}/boards/${newBoard.id}`,
      {
        title: newBoard.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getBoards() {
    const token = localStorage.getItem("token");
    return axios.get(API_URL + "me/boards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteBoard(boardId) {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getBoardSections(boardId) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/boards/${boardId}/sections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getSectionItems(sectionId) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/sections/${sectionId}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addSection(boardId, title) {
    const token = localStorage.getItem("token");
    return axios.post(
      `${API_URL}/boards/${boardId}/sections`,
      {
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  editSection(section) {
    const token = localStorage.getItem("token");
    return axios.patch(
      `${API_URL}/sections/${section.id}`,
      {
        title: section.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  addItem(item, sectionId) {
    const token = localStorage.getItem("token");
    return axios.post(
      `${API_URL}/sections/${sectionId}/items`,
      {
        title: item.title,
        description: item.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new BoardService();
