<script setup>
import { defineProps, computed } from "vue";
const props = defineProps(["section"]);

const sectionItemsLength = computed(() =>
  props.section.items ? props.section.items.length : 0
);
</script>

<template>
  <v-row no-gutters justify="space-between" align="center">
    <div class="d-flex">
      <p>{{ props.section.title }}</p>
      <p class="ml-2 small-text grey-color">{{ sectionItemsLength }}</p>
    </div>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          flat
          icon="mdi-dots-horizontal grey-color"
        ></v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>Editar seção</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Excluir seção</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-row>
</template>
