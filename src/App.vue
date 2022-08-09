<script setup>
import { ref } from "vue";

const drawer = ref(true);
</script>
<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>2BDone</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" left>
      <v-card flat class="pl-5 pt-5">
        <v-list>
          <v-list-item
            prepend-icon="mdi-calendar-today"
            title="Hoje"
            value="today"
            rounded="xl"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-calendar-month"
            title="Próximo"
            rounded="xl"
            value="coming"
          />
          <v-list-group class="pt-5" value="Projetos">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-folder-outline"
                title="Projetos"
              ></v-list-item>
            </template>
          </v-list-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.v-application {
  font-family: "Times New Roman";
}
</style>
