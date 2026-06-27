<template>
  <div class="d-flex flex-column gap-5">
    <HeroSection />
    <!-- <InstationSection /> -->
    <FiturSection />
  </div>
</template>


<script>
import HeroSection from "@/components/landingpage/HeroSection.vue";
import FiturSection from "@/components/landingpage/FiturSection.vue";

export default {
  components: {
    HeroSection,
    FiturSection,
  },
};
</script>