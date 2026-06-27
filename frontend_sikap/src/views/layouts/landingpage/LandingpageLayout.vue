<template>
  <div>
    <LandingpageNavbar class="landingpage-navbar" />
    <div class="landingpage-layout">
      <router-view />
    </div>
    <LandingpageFooter class="landingpage-footer" />
  </div>
</template>

<script>
import LandingpageNavbar from "@/components/landingpage/LandingpageNavbar.vue";
import LandingpageFooter from "@/components/landingpage/LandingpageFooter.vue";

export default {
  components: {
    LandingpageNavbar,
    LandingpageFooter,
  },
};
</script>

<style>
.landingpage-layout {
  min-height: 100vh;
  background-size: cover;
  background-position: top;
  position: relative;
}

.landingpage-navbar {
  z-index: 11;
}

.landingpage-footer {
  z-index: 11;
}
</style>
