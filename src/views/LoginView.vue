<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store/index";
import router from "@/router/index.js";
import { useCookies } from "vue3-cookies";

const axios = inject("axios");
const store = useStore();
const user = ref({});
const { cookies } = useCookies();
const titleMessage = computed(() => {
  return "Bem vindo de volta!";
});
const onCancelClick = () => {
  user.value = {};
};
const onConfirmClick = () => {
  axios
    .post("http://localhost:3000/v1/auth/login", user.value)
    .then((response) => {
      if (response.status === 200) {
        store.loggedUser.value = response.data.user;
        console.log(response.data.tokens);
        cookies.set("access", response.data.tokens.access);
        cookies.set("refresh", response.data.tokens.refresh);
        console.log(cookies.get("access"));
        store.isUserLoggedIn = true;
        axios
          .get(
            "http://localhost:3000/v1/users/" +
              store.loggedUser.value.id +
              "/boards"
          )
          .then((response) => {
            if (response.status === 200) {
              response.data.forEach((item) => {
                store.addBoard(item);
              });
            }
          });
        router.push("/");
      }
    });
};
</script>
<template>
  <div class="pa-10">
    <v-row justify="center">
      <v-col cols="6">
        <v-card flat>
          <v-card-title>
            <p class="text-h2">{{ titleMessage }}</p>
          </v-card-title>
          <v-card-subtitle>
            <p>Logue sua conta</p>
          </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="user.email"
              placeholder="Email"
              variant="outlined"
              hide-details
              density="compact"
              class="my-2"
              autocomplete
            />
            <v-text-field
              v-model="user.password"
              placeholder="Senha"
              variant="outlined"
              hide-details
              density="compact"
              class="my-2"
              type="password"
            />
          </v-card-text>
          <v-card-actions>
            <v-row justify="space-around">
              <v-btn variant="outlined" @click="onCancelClick">voltar</v-btn>
              <v-btn variant="outlined" @click="onConfirmClick">entrar</v-btn>
              <v-btn variant="outlined" @click="router.push('signup')"
                >ainda não tem uma conta? cadastre-se!</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
