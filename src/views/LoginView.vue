<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store/index";
import router from "@/router/index.js";
import AuthService from "../services/auth.service";

const axios = inject("axios");
const store = useStore();
const user = ref({});
const titleMessage = computed(() => {
  return "Bem vindo de volta!";
});
const onCancelClick = () => {
  user.value = {};
};
const onConfirmClick = () => {
  AuthService.login(user.value).then((response) => {
    if (response.code === 401) console.log("nao logou");
    //eslint-disable-next-line
    // debugger;
    else {
      store.$patch({ isUserLoggedIn: true, loggedUser: response.data.user });
      router.push({ name: "home" });
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
