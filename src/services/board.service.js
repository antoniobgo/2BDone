import axios from "axios";
// const BASE_URL = "https://todolist-api-production-ec65.up.railway.app";
const BASE_URL = "http://localhost:3000";

class BoardService {
  createBoard(board) {
    const token = localStorage.getItem("token");
    return axios.post(
      BASE_URL + "/boards",
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
      `${BASE_URL}/boards/${newBoard.id}`,
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
    return axios.get(BASE_URL + "/me/boards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteBoard(boardId) {
    const token = localStorage.getItem("token");
    return axios.delete(`${BASE_URL}/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getBoardSections(boardId) {
    const token = localStorage.getItem("token");
    return axios.get(`${BASE_URL}/boards/${boardId}/sections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getSectionItems(sectionId) {
    const token = localStorage.getItem("token");
    return axios.get(`${BASE_URL}/sections/${sectionId}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addSection(boardId, title) {
    const token = localStorage.getItem("token");
    return axios.post(
      `${BASE_URL}/boards/${boardId}/sections`,
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
      `${BASE_URL}/sections/${section.id}`,
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

  deleteSection(sectionId) {
    const token = localStorage.getItem("token");
    return axios.delete(`${BASE_URL}/sections/${sectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addItem(item, sectionId) {
    const token = localStorage.getItem("token");
    return axios.post(
      `${BASE_URL}/sections/${sectionId}/items`,
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

  editItem(item) {
    const token = localStorage.getItem("token");
    return axios.patch(
      `${BASE_URL}/items/${item.id}`,
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

  deleteItem(itemId) {
    const token = localStorage.getItem("token");
    return axios.delete(`${BASE_URL}/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new BoardService();
