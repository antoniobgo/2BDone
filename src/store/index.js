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
    // eslint-disable-next-line no-debugger
    debugger;
    console.log(boards);
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
  return { boards, addItemToSection };
});
