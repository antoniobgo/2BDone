<script setup>
import { ref, computed, inject, onBeforeMount } from "vue";
import { useDisplay } from "vuetify";
import { useStore } from "@/store/index";
import router from "@/router/index.js";
import AuthService from "../services/auth.service";
import BoardService from "../services/board.service";

const axios = inject("axios");
const { mdAndUp } = useDisplay();
const store = useStore();
const user = ref({});
const isLoading = ref(false);
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const rules = {
  counter: (value) =>
    value.length >= 6 || "Senha deve ter no mínimo 6 caracteres.",
  email: (value) => {
    if (user.value.email.length < 5) return true;
    return emailPattern.test(value) || "E-mail inválido.";
  },
};
const loginError = ref(false);
const titleMessage = computed(() => {
  return "Log in";
});

onBeforeMount(() => {
  if (localStorage.getItem("token")) {
    if (store.isUserLoggedIn) router.push({ name: "home" });
    else {
      AuthService.loginWithToken().then((user) => {
        if (user) {
          store.$patch({
            isUserLoggedIn: true,
            loggedUser: user,
          });
        }
      });
      if (store.isUserLoggedIn && store.boards.length === 0)
        BoardService.getBoards().then((response) => {
          if (response.status === 200) store.setBoards(response.data);
        });
      router.push({ name: "home" });
    }
  }
});

const onCancelClick = () => {
  user.value = {};
  router.push({ name: "home" });
};
const onConfirmClick = () => {
  isLoading.value = true;
  AuthService.login(user.value)
    .then((response) => {
      if (response.status === 202) {
        store.$patch({
          isUserLoggedIn: true,
          loggedUser: response.data.user,
        });
        isLoading.value = false;
        router.push({ name: "home" });
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        loginError.value = true;
        isLoading.value = false;
        user.value.email = "";
        user.value.password = "";
      }
    });
};
</script>
<template>
  <div class="pa-10">
    <v-row justify="center" class="mt-15">
      <v-col cols="3" align-self="center">
        <v-card flat>
          <v-card-title>
            <p class="text-h4 mb-5">{{ titleMessage }}</p>
          </v-card-title>
          <v-card-text>
            <v-row no-gutters dense>
              <v-col>
                <p v-if="loginError" class="text-red mb-2">
                  Email ou senha incorretos
                </p>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="user.email"
                  placeholder="Email"
                  :rules="[rules.email]"
                  variant="outlined"
                  density="compact"
                  autocomplete
                />

                <v-text-field
                  v-model="user.password"
                  placeholder="Senha"
                  variant="outlined"
                  hide-details
                  density="compact"
                  class="mb-5"
                  type="password"
                />
                <v-btn
                  :loading="isLoading"
                  variant="outlined"
                  size="large"
                  class="w-100 bg-primary"
                  @click="onConfirmClick"
                  >Log in</v-btn
                >
                <div class="mt-5">
                  <a href="/#/signup">Esqueceu a senha?</a>
                </div>
                <v-divider class="mt-5" />
                <div class="w-100 d-flex justify-center mt-5">
                  <p>Não tem uma conta? <a href="/#/signup">Crie aqui</a></p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-img
          @click="router.push({ name: 'home' })"
          :src="require('@/assets/login_image.svg')"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style>
.v-input__details {
  padding-bottom: 5px;
}
</style>
