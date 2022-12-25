<script setup>
import { ref, computed, inject } from "vue";
import { useStore } from "@/store/index";
import BoardSection from "@/components/BoardSection.vue";
import router from "@/router/index.js";
import AuthService from "../services/auth.service";

const axios = inject("axios");
const store = useStore();
const user = ref({});
const titleMessage = computed(() => {
  return "Cadastre-se! :)";
});
const errorMessage = computed(() => {
  return "Email já cadastrado.";
});
const isLoading = ref(false);
const showErrorMessage = ref(false);
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function isButtonDisabled() {
  if (
    !user.value.name ||
    !user.value.email ||
    !user.value.password ||
    !user.value.passwordConfirmation
  )
    return true;
  //eslint-disable-next-line
  return !(
    emailPattern.test(user.value.email) &&
    user.value.password === user.value.passwordConfirmation
  );
}
const rules = {
  required: (value) => !!value || "Campo obrigatório.",
  counter: (value) =>
    value.length >= 6 || "Senha deve ter no mínimo 6 caracteres.",
  email: (value) => {
    return emailPattern.test(value) || "E-mail inválido.";
  },
  passwordConfirmation: (value) =>
    value === user.value.password || "As senhas devem coincidir.",
};

const onCancelClick = () => {
  user.value = {};
};
const onConfirmClick = () => {
  AuthService.register(user.value)
    .then((response) => {
      if (response.status === 201) {
        user.value = {};
        router.push("/login");
      }
    })
    .catch((error) => {
      if (error.response.status === 400) showErrorMessage.value = true;
    });
};
</script>
<template>
  <div class="pa-10">
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>
            <p class="text-h2">{{ titleMessage }}</p>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.name"
              :rules="[rules.required]"
              placeholder="Nome"
              variant="outlined"
              density="compact"
              class="my-2"
            />
            <v-text-field
              v-model="user.email"
              :rules="[rules.required, rules.email]"
              placeholder="Email"
              variant="outlined"
              density="compact"
              class="my-2"
              autocomplete
            />
            <v-text-field
              v-model="user.password"
              placeholder="Senha"
              :rules="[rules.required, rules.counter]"
              variant="outlined"
              density="compact"
              class="my-2"
              type="password"
            />
            <v-text-field
              v-model="user.passwordConfirmation"
              placeholder="Confirmar Senha"
              variant="outlined"
              :rules="[
                rules.required,
                rules.counter,
                rules.passwordConfirmation,
              ]"
              density="compact"
              class="my-2"
              type="password"
            />
          </v-card-text>
          <v-row no-gutters dense>
            <p v-if="showErrorMessage" class="text-red">
              {{ errorMessage }}
            </p>
          </v-row>
          <v-card-actions>
            <v-row justify="space-around">
              <v-btn @click="onCancelClick">cancelar</v-btn>
              <v-btn @click="onConfirmClick" :disabled="isButtonDisabled()"
                >cadastrar</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
