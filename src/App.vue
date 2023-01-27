<script setup>
import CustomAppBar from "@/components/main_components/CustomAppBar";
import CustomNavDrawer from "@/components/main_components/CustomNavDrawer";
</script>
<template>
  <v-app>
    <CustomAppBar />
    <CustomNavDrawer />
    <v-main>
      <v-container fluid class="h-100 pa-0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
body {
  font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
.logo {
  height: auto;
  width: 35px;
}
.logo:hover {
  cursor: pointer;
}

.small-text {
  font-size: 13px;
}
.grey-color {
  color: #948680;
}
</style>
