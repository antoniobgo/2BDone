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
              description: "Alooou!",
            },
          ],
        },
        {
          id: 2,
          name: "Doing",
          items: [
            {
              done: false,
              description: "hey!",
            },
          ],
        },
      ],
    },
  ]);
  function addItemToSection(sectionId) {
    // eslint-disable-next-line no-debugger
    debugger;
    console.log(boards);
    boards.value[0].sections.forEach((section) => {
      if (section.id === sectionId) {
        section.items.push({ done: false, description: "hmmmmmm" });
      }
    });
  }
  return { boards, addItemToSection };
});
