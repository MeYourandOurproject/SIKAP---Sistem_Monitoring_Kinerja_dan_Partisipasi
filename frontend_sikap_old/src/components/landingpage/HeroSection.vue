<template>
  <div
    class="container-fluid home-heroes d-flex align-items-center justify-content-start py-5 py-md-4 px-4 px-md-0"
  >
    <!-- HERO -->
    <div class="container-xxl">
      <div
        class="row d-flex align-items-center justify-content-center justify-content-md-start pt-5"
      >
        <div class="col-12 col-md-6 gap-2 d-flex flex-column order-2 order-md-1 ">
          <div class="hero-badge d-none d-md-flex">
            SISTEM INFORMASI KINERJA & PARTISIPASI
          </div>
          <div
            class="home-title fw-bold text-white text-start text-md-start lh-sm"
          >
            Kelola Kinerja Guru Lebih Mudah,
            <span class="text-primary">Akurat</span> <br />dan
            <span class="text-success">Transparan</span>
          </div>

          <div class="col-12 d-md-none d-flex d-flex align-items-center justify-content-center">
          <div class="hero-image-wrapper">
            <img
              src="../../assets/hero_img.PNG"
              alt="hero"
              class="hero-image"
            />
          </div>
        </div>

          <p class="hero-subtitle text-white text-start text-md-start">
            SIKAP membantu sekolah dalam memantau kehadiran, jadwal mengajar,
            partisipasi kegiatan, hingga penilaian kinerja guru dalam satu
            sistem terintegrasi dan realtime.
          </p>

          <div
            class="hero-buttons d-flex gap-3 flex-nowrap justify-content-start"
          >
            <router-link to="/artikel"
              ><button class="btn-hero btn-primary-hero">
                <i class="bi bi-rocket-takeoff me-3 fs-4"></i
                ><small>Mulai Sekarang</small>
              </button></router-link
            >

            <router-link to="/project"
              ><button class="btn-hero btn-secondary-hero">
                <i class="bi bi-play-circle me-3 fs-4"></i>
                <small>Lihat Demo</small>
              </button></router-link
            >
          </div>
          <!-- <div
            class="info d-flex flex-wrap text-secondary small fw-medium text-white mt-3 gap-3"
          >
            <div class="col-auto">
              <div
                class="row text-start align-items-center justify-content-center gx-0"
              >
                <div class="col-3">
                  <i
                    class="bi bi-shield-check text-white fs-4 fw-bold bg-outline-success px-2 py-1 rounded-3"
                  ></i>
                </div>
                <div class="col-9">
                  <small class="ms-2">Aman & Terpercaya</small>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <div
                class="row text-start align-items-center justify-content-center gx-0"
              >
                <div class="col-3">
                  <i
                    class="bi bi-file-earmark-bar-graph text-white fs-4 fw-bold bg-outline-success px-2 py-1 rounded-3 me-5"
                  ></i>
                </div>
                <div class="col-9"><small class="ms-2">Real-Time</small></div>
              </div>
            </div>
            <div class="col-auto">
              <div
                class="row text-start align-items-center justify-content-center gx-0"
              >
                <div class="col-3">
                  <i
                    class="bi bi-cloud text-white fs-4 fw-bold bg-outline-success px-2 py-1 rounded-3 me-3"
                  ></i>
                </div>
                <div class="col-9"><small class="ms-2">Akses Mudah</small></div>
              </div>
            </div>
          </div> -->
        </div>
        <div class="col-12 col-md-6 order-1 order-md-2 d-flex align-items-center justify-content-center d-none d-md-flex">
          <div class="hero-image-wrapper">
            <img
              src="../../assets/hero_img.PNG"
              alt="hero"
              class="hero-image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* =========================
   HERO SECTION
========================= */
.home-heroes {
  max-height: 100vh;
  /* margin-top: 70px; */
  background-size: cover;
  background-position: top;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: 1px;
  text-align: start;
  margin-bottom: 1.5rem;
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
  margin-left: -350px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 50px;
  /* overflow: hidden; */
}

.hero-image {
  width: 100%;
  width: 1100px;
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
    padding: 0;
    margin-top: 50px;
  }

  .home-title {
    font-size: 1.75rem;
    line-height: 1.3;
    text-align: center;
    margin-bottom: 1rem;
  }

  .home-title span {
    display: inline;
  }

  .hero-subtitle {
    font-size: 0.9rem;
    text-align: center;
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
    min-height: 250px;
    /* margin-bottom: -20px; */
    margin: -40px 0 ;
    margin-left: -200px;
    padding-bottom: 0px;
  }

  .hero-image {
    width: 100%;
    width: 500px;
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
</style>
