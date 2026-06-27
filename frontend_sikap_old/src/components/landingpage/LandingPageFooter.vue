<template>
  <footer class="footer">
    <div class="container py-5">
      

      <!-- Divider -->
    

      <!-- Bottom -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div class="small text-secondary mb-2 mb-md-0">
          © 2026 SIKAP. All rights reserved.
        </div>

        <div class="d-flex gap-3 small">
          <a href="#" class="footer-link">Home</a>
          <a href="#" class="footer-link">Artikel</a>
          <a href="#" class="footer-link">Project</a>
          <a href="#" class="footer-link">e-Book</a>
          <a href="#" class="footer-link">About</a>
        </div>
      </div>
    </div>

    <!-- Scroll To Top -->
    <button class="scroll-top" @click="scrollToTop">
      <i class="bi bi-chevron-up"></i>
    </button>
  </footer>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
.footer {
  background: #0F172A;
  /* border-top: 1px solid #e5e7eb; */
  position: relative;
}

/* Social Icon */
.social-icon {
  width: 40px;
  height: 40px;
  border: 1px solid #1d4ed8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  transition: 0.2s;
}

.social-icon:hover {
  background: #1d4ed8;
  color: #fff;
}

/* Link */
.footer-link {
  text-decoration: none;
  color: #6b7280;
  transition: 0.2s;
}

.footer-link:hover {
  color: #ffffff;
}

/* Scroll top button */
.scroll-top {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  cursor: pointer;
}

.scroll-top:hover {
  background: #163bb3;
}
</style>