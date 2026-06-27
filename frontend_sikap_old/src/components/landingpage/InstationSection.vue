<template>
  <section class="instation-section py-5 text-start">
    <div class="container-xxl">
      <div class="row align-items-center gy-4">
        <div class="col-12 col-lg-5 text-white">
          <span class="section-label">Kenapa Pilih SIKAP?</span>
          <h2 class="section-title">
            Solusi lengkap untuk sekolah dalam memantau kinerja dan partisipasi guru.
          </h2>
          <p class="section-text">
            Kelola absensi, jadwal, partisipasi kegiatan, dan laporan kinerja dengan satu dashboard yang mudah digunakan.
          </p>
        </div>

        <div class="col-12 col-lg-7">
          <div class="row g-4">
            <div class="col-12 col-md-6">
              <div class="info-card">
                <div class="info-icon">A</div>
                <h3>Akurat</h3>
                <p>
                  Data absensi dan partisipasi diproses secara real-time agar keputusan sekolah lebih cepat.
                </p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="info-card">
                <div class="info-icon">R</div>
                <h3>Real-Time</h3>
                <p>
                  Informasi kehadiran dan aktivitas guru tersedia segera tanpa menunggu laporan manual.
                </p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="info-card">
                <div class="info-icon">M</div>
                <h3>Mudah</h3>
                <p>
                  Antarmuka ringkas dan terstruktur sehingga setiap guru dan admin bisa langsung pakai.
                </p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="info-card">
                <div class="info-icon">L</div>
                <h3>Lengkap</h3>
                <p>
                  Meliputi absensi, jadwal, penilaian, partisipasi kegiatan, hingga laporan sekolah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "InstationSection",
};
</script>

<style scoped>
.instation-section {
  background: rgba(15, 23, 42, 0.95);
}
.section-label {
  display: inline-block;
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 1.25rem;
}
.section-title {
  font-size: clamp(2rem, 2.8vw, 3rem);
  line-height: 1.05;
  margin-bottom: 1rem;
}
.section-text {
  color: #d1d5db;
  font-size: 1rem;
  max-width: 560px;
}
.info-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 20px;
  padding: 1.75rem;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  font-weight: 700;
}
.info-card h3 {
  color: #ffffff;
  font-size: 1.15rem;
}
.info-card p {
  color: #cbd5e1;
  margin: 0;
  line-height: 1.7;
}
</style>
