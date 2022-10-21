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
const onCancelClick = () => {
  user.value = {};
};
const onConfirmClick = () => {
  AuthService.register(user.value).then((response) => {
    if (response.status === 201) {
      user.value = {};
      router.push("/");
    }
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
              placeholder="Nome"
              variant="outlined"
              hide-details
              density="compact"
              class="my-2"
            />
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
            <v-text-field
              v-model="user.confirmPassword"
              placeholder="Confirmar Senha"
              variant="outlined"
              hide-details
              density="compact"
              class="my-2"
              type="password"
            />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-row justify="space-around">
              <v-btn @click="onCancelClick">cancelar</v-btn>
              <v-btn @click="onConfirmClick">cadastrar</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
