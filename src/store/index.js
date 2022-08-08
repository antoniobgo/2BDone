import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("items", () => {
  const boards = ref([
    {
      name: "Quadro Teste",
      sections: [
        {
          name: "To Do",
          items: [
            {
              done: false,
              description: "Alooou!",
            },
          ],
        },
        {
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
  return { boards };
});
