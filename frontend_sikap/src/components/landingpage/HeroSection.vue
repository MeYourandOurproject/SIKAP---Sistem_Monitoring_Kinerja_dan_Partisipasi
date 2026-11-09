<template>
  <section id="beranda" class="home-heroes">
    <div class="container-xxl">
      <div class="hero-layout text-start">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          SISTEM INFORMASI KINERJA & PARTISIPASI
        </div>
        <h1 class="home-title">
          Kelola Kinerja Guru Lebih Mudah,
          <span class="title-highlight">Akurat</span> dan
          <span class="title-accent">Transparan</span>
        </h1>
        <p class="hero-subtitle">
          SIKAP membantu sekolah mengelola jadwal mengajar, memantau kehadiran,
          dan mengatur agenda kegiatan sekolah dalam satu sistem.
        </p>
        <div class="hero-buttons">
          <router-link to="/login" class="btn-hero btn-primary-hero">
            <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>
            Akses Login
          </router-link>
          <a href="#fitur" class="btn-hero btn-secondary-hero">
            <i class="bi bi-grid" aria-hidden="true"></i>
            Jelajahi Fitur
          </a>
        </div>
        <div class="hero-art">
          <div class="hero-image-wrapper">
            <img
              src="../../assets/hero_img.png"
              alt="Ilustrasi dashboard SIKAP untuk memantau kinerja dan kehadiran guru"
              class="hero-image"
              fetchpriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* =========================
   HERO SECTION
========================= */
.home-heroes {
  min-height: clamp(560px, calc(100svh - 76px), 900px);
  scroll-margin-top: 76px;
  padding: clamp(3rem, 7vh, 6rem) 1.5rem;
  background-size: cover;
  background-position: top;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.home-heroes .container-xxl {
  position: relative;
  z-index: 2;
  width: 100%;
}

/* Gradasi penyambung */
.home-heroes::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 140px;
  z-index: 1;
}

/* =========================
   TEXT
========================= */
.home-title {
  font-size: clamp(2.35rem, 3.2vw, 3.5rem);
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-align: start;
  margin-bottom: 0.75rem;
}

.hero-subtitle {
  text-align: start;
  letter-spacing: 0.5px;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2rem;
}

/* =========================
   FLOATING IMAGE
========================= */
.floating-img {
  animation: floating 3.5s ease-in-out infinite;
  max-width: 100%;
}

@keyframes floating {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-18px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* =========================
   INFO SECTION
========================= */
.info {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 2rem;
}

.info .col-auto {
  min-width: 150px;
}

.info i {
  background: rgba(34, 197, 94, 0.15) !important;
  padding: 10px 14px !important;
  border-radius: 12px !important;
}

/* =========================
   HERO BUTTON PREMIUM
========================= */
.hero-buttons {
  justify-content: start;
  margin-bottom: 2rem;
}

.btn-hero {
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  text-decoration: none;
}

.btn-hero:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.btn-primary-hero {
  background: #1d4ed8;
  color: #ffffff;
}

.btn-primary-hero:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(29, 78, 216, 0.3);
}

.btn-secondary-hero {
  background: transparent;
  color: #ffffff;
  backdrop-filter: blur(6px);
  border: 1px solid #a9a9a9;
}

.btn-secondary-hero:hover {
  background: #1d4ed8;
  color: #ffffff;
  transform: translateY(-4px);
  border-color: #1d4ed8;
}

.text-title-hero {
  color: #1d4ed8;
}

/* =========================
   FIX BADGE
========================= */
.hero-badge {
  display: block;
  width: fit-content;
  text-align: left;
  background: #e0edff;
  color: #1d4ed8;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}

/* =========================
   HERO IMAGE
========================= */
.hero-image-wrapper {
  width: 100%;
  z-index: 1;
  padding: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -300px
}

.hero-image {
  display: block;
  width: 100%;
  width: 1000px;
  height: auto;
  opacity: 0.95;
  animation: floating 4s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
}

@keyframes floating {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 768px) {
  .home-heroes {
    min-height: auto;
    padding: 2.5rem 1rem 3rem;
  }

  .home-title {
    font-size: clamp(1.75rem, 7vw, 2.35rem);
    line-height: 1.3;
    /* text-align: center; */
    margin-bottom: 1rem;
  }

  .home-title span {
    display: inline;
  }

  .hero-subtitle {
    font-size: 0.9rem;
    /* text-align: center; */
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .hero-buttons {
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .btn-hero {
    padding: 10px 16px;
    font-size: 0.8rem;
  }

  .btn-hero i {
    font-size: 1rem !important;
    margin-right: 0.5rem !important;
  }

  .hero-badge {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .hero-image-wrapper {
    min-height: 190px;
    margin: -1.5rem 0 0;
  }

  .hero-image {
    width: 100%;
    max-width: 440px;
  }

  .info {
    justify-content: center;
    gap: 20px;
    flex-direction: column;
    align-items: center;
  }

  .info .col-auto {
    width: 100%;
    min-width: unset;
    text-align: center;
  }

  .info .row {
    flex-direction: column;
    align-items: center !important;
    justify-content: center !important;
  }

  .info i {
    margin-bottom: 8px !important;
    margin-right: 0 !important;
  }

  .info small {
    display: block;
    margin-top: 4px;
  }
}

@media (max-width: 420px) {
  .home-heroes {
    padding-inline: 0.75rem;
  }

  .hero-buttons {
    gap: 0.5rem;
  }

  .btn-hero {
    padding-inline: 0.8rem;
  }
}
</style>

<style>
.home-heroes {
  position: relative;
  display: flex;
  min-height: min(760px, calc(100svh - 76px));
  align-items: center;
  padding: clamp(3.5rem, 8vh, 6.5rem) 1.5rem;
  overflow: hidden;
  isolation: isolate;
  scroll-margin-top: 76px;
  background:
    radial-gradient(ellipse at 76% 45%, rgba(29, 78, 216, 0.19), transparent 38%),
    radial-gradient(ellipse at 12% 0%, rgba(34, 197, 94, 0.07), transparent 35%),
    linear-gradient(135deg, #0b172a 0%, #081426 62%, #0c1b31 100%);
}

.home-heroes::before,
.home-heroes::after {
  position: absolute;
  z-index: -1;
  content: "";
  pointer-events: none;
}

.home-heroes::before {
  top: 12%;
  right: -9rem;
  width: 30rem;
  height: 30rem;
  border: 1px solid rgba(148, 163, 184, 0.08);
  border-radius: 50%;
  box-shadow:
    0 0 0 3rem rgba(148, 163, 184, 0.025),
    0 0 0 6rem rgba(148, 163, 184, 0.02);
}

.home-heroes::after {
  right: 0;
  bottom: 0;
  left: 0;
  height: 120px;
  background: linear-gradient(180deg, transparent, rgba(2, 8, 23, 0.45));
}

.home-heroes .container-xxl {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto auto auto 1fr;
  grid-template-areas:
    "badge art"
    "title art"
    "subtitle art"
    "actions art";
  align-items: center;
  column-gap: clamp(1.5rem, 4vw, 4.5rem);
  max-width: 1280px;
  margin: 0 auto;
}

.hero-badge {
  grid-area: badge;
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1.15rem;
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.08);
  color: #a7f3d0;
  font-size: 0.68rem;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.hero-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.12);
}

.home-title {
  grid-area: title;
  max-width: 680px;
  margin: 0 0 1.2rem;
  color: #f8fafc;
  font-size: clamp(2.5rem, 4.5vw, 4.25rem);
  font-weight: 780;
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.home-title .title-highlight {
  color: #60a5fa;
}

.home-title .title-accent {
  color: #4ade80;
}

.hero-subtitle {
  grid-area: subtitle;
  max-width: 570px;
  margin: 0 0 1.8rem;
  color: #bdc9d9;
  font-size: clamp(0.95rem, 1.2vw, 1.08rem);
  line-height: 1.75;
}

.hero-buttons {
  grid-area: actions;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 50px;
  padding: 0.8rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  white-space: nowrap;
}

.btn-hero:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.btn-primary-hero {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.24);
}

.btn-primary-hero:hover,
.btn-secondary-hero:hover {
  transform: translateY(-2px);
}

.btn-secondary-hero {
  border-color: rgba(203, 213, 225, 0.2);
  background: rgba(255, 255, 255, 0.045);
  color: #e2e8f0;
}

.btn-secondary-hero:hover {
  border-color: rgba(96, 165, 250, 0.42);
  background: rgba(37, 99, 235, 0.14);
  color: white;
}

.hero-art {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  min-height: 420px;
  grid-area: art;
  place-items: center;
}

.hero-art::before {
  position: absolute;
  inset: 14% 4%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(37, 99, 235, 0.19), transparent 68%);
  content: "";
  filter: blur(18px);
}

.hero-image-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  overflow: visible;
  pointer-events: none;
}

.hero-image {
  display: block;
  width: 145%;
  max-width: none;
  height: auto;
  margin-left: -27%;
  opacity: 0.96;
  filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.24));
  animation: hero-float 6s ease-in-out infinite;
}

@keyframes hero-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 991px) {
  .home-heroes {
    min-height: auto;
    padding: 4rem 1.5rem;
  }

  .hero-layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    column-gap: 1rem;
  }

  .home-title {
    font-size: clamp(2.2rem, 5vw, 3.2rem);
  }

  .hero-art {
    min-height: 340px;
  }

  .hero-image {
    width: 165%;
    margin-left: -35%;
  }
}

@media (max-width: 767px) {
  .home-heroes {
    padding: 2.25rem 1.15rem 3.5rem;
  }

  .hero-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto auto auto;
    grid-template-areas:
      "badge"
      "title"
      "art"
      "subtitle"
      "actions";
    row-gap: 0;
  }

  .hero-badge {
    margin-bottom: 0.85rem;
    padding: 0.45rem 0.7rem;
    font-size: 0.59rem;
    letter-spacing: 0.08em;
  }

  .home-title {
    max-width: 620px;
    margin-bottom: 0;
    font-size: clamp(2rem, 8.5vw, 3rem);
    line-height: 1.12;
  }

  .hero-art {
    height: clamp(220px, 67vw, 330px);
    min-height: 0;
    margin-top: -0.25rem;
    overflow: hidden;
  }

  .hero-art::before {
    inset: 12% 4%;
  }

  .hero-image-wrapper {
    width: 100%;
    height: 100%;
    overflow: visible;
    margin-left: -100px;
  }

  .hero-image {
    width: 142%;
    margin-left: -25%;
  }

  .hero-subtitle {
    max-width: 560px;
    margin: 0.1rem 0 1.25rem;
    font-size: 0.9rem;
    line-height: 1.65;
  }

  .hero-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.65rem;
  }

  .btn-hero {
    min-height: 46px;
    padding: 0.65rem 0.7rem;
    font-size: 0.78rem;
  }

  .btn-hero i {
    font-size: 0.95rem;
  }
}

@media (max-width: 380px) {
  .home-heroes {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  .hero-badge {
    font-size: 0.54rem;
  }

  .hero-art {
    height: 220px;
  }

  .hero-image {
    width: 150%;
    margin-left: -28%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-image {
    animation: none;
  }

  .btn-hero {
    transition: none;
  }
}
</style>
