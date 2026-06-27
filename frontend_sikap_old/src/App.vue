<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import 'bootstrap-icons/font/bootstrap-icons.css'
export default {
  name: 'App',
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  /* font-family: 'Poppins', sans-serif; */
  -webkit-font-smooting: antialiased;
  -moz-osx-font-smooting: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color:#0F172A ;
}
</style>
