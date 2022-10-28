import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("items", () => {
  const isUserLoggedIn = ref(false);
  const loggedUser = ref({});
  const chosenBoardIndex = ref(0);
  const boards = ref([]);

  function setBoards(newBoards) {
    boards.value = newBoards;
  }
  function addItemToSection(sectionId, task) {
    boards.value[0].sections.forEach((section) => {
      if (section.id === sectionId) {
        section.items.push({
          done: false,
          title: task.title,
          description: task.description,
        });
      }
    });
  }
  function addBoard(board) {
    boards.value.push(board);
  }
  function deleteTaskItem(sectionId, taskTitle) {
    boards.value[0].sections.forEach((section, index) => {
      if (section.id === sectionId) {
        boards.value[0].sections[index].items = section.items.filter((item) => {
          return item.title != taskTitle;
        });
      }
    });
  }
  function editTaskItem(sectionId, taskTitle, editedTask) {
    boards.value[0].sections.forEach((section, index) => {
      if (section.id === sectionId) {
        boards.value[0].sections[index].items.value = section.items.map(
          (item) => {
            return item.title !== taskTitle
              ? item
              : {
                  done: false,
                  title: editedTask.title,
                  description: editedTask.description,
                };
          }
        );
      }
    });
  }
  return {
    isUserLoggedIn,
    loggedUser,
    boards,
    chosenBoardIndex,
    addItemToSection,
    addBoard,
    deleteTaskItem,
    editTaskItem,
    setBoards,
  };
});
