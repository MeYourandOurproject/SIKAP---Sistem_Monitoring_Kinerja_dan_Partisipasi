<template>
  <div>
    <LandingPageNavbar class="navbar" />
    <div class="layout">
      <router-view />
    </div>
    <LandingPageFooter class="footer" />
  </div>
</template>

<script>
import LandingPageNavbar from "@/components/landingpage/LandingPageNavbar.vue";
import LandingPageFooter from "@/components/landingpage/LandingPageFooter.vue";

export default {
  name: "LandingPageLayout",
  components: {
    LandingPageNavbar,
    LandingPageFooter,
  },
};
</script>

<style>
.layout {
  min-height: 100vh;
  /* background-image: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)),
    url("../../../assets/pilihan-bg.webp"); */
  background-size: cover;
  background-position: top;
  position: relative;
  /* color: white; */
}

.navbar {
  z-index: 11;
}

.footer {
  z-index: 11;
}
</style>
