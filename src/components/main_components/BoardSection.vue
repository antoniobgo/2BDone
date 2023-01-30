<script setup>
import { defineProps, ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "@/store/index";
import BoardService from "@/services/board.service";
import SectionItem from "@/components/SectionItem.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import AddItemArea from "@/components/AddItemArea.vue";

const { mdAndUp } = useDisplay();
const store = useStore();
const props = defineProps(["section"]);
const showAddItemField = ref(false);
const addItemError = ref(false);
const taskFieldInputError = ref(false);
const isAddItemButtonLoading = ref(false);
</script>

<template>
  <v-card flat>
    <v-card-title class="pb-0 pl-3">
      <SectionTitle :section="props.section" />
    </v-card-title>
    <v-card-text
      class="pb-0 mb-0 overflow-y-auto card-text-height"
      :class="mdAndUp ? 'desktop-card-text-height' : 'mobile-card-text-height'"
    >
      <div v-if="props.section.items">
        <SectionItem
          v-for="item in props.section.items"
          :key="item.id"
          :item="item"
          :section="props.section"
          class="my-4"
        />
      </div>
    </v-card-text>
    <v-card-actions class="ma-0 pa-0">
      <AddItemArea :section="props.section" />
    </v-card-actions>
  </v-card>
</template>

<style>
.desktop-card-text-height {
  max-height: 65vh;
}
.mobile-card-text-height {
  max-height: 55vh;
}
</style>
