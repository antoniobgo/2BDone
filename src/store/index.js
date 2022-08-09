import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("items", () => {
  const boards = ref([
    {
      name: "Quadro Teste",
      sections: [
        {
          id: 1,
          name: "To Do",
          items: [
            {
              done: false,
              title: "Alou",
              description: "descricao!",
            },
          ],
        },
        {
          id: 2,
          name: "Doing",
          items: [
            {
              done: false,
              title: "hey!",
              description: "deeeeescricao!",
            },
          ],
        },
      ],
    },
  ]);
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
    console.log(boards.value[0].sections[0].items);
  }
  return { boards, addItemToSection, deleteTaskItem, editTaskItem };
});
