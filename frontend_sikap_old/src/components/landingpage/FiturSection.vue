<template>
  <section class="fitur-section py-5">
    <div class="container-xxl">
      <!-- HEADER -->
      <div class="text-center mb-5">
        <div class="section-label">
          FITUR UNGGULAN
        </div>

        <h2 class="section-title">
          Semua yang Anda Butuhkan dalam Satu Sistem
        </h2>
      </div>

      <!-- FEATURE GRID -->
      <div class="feature-grid">

        <div class="feature-card">
          <div class="feature-icon blue">
            <i class="bi bi-person-check"></i>
          </div>

          <h3>Kehadiran</h3>

          <p>
            Monitoring kehadiran guru secara real-time dan akurat.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon green">
            <i class="bi bi-calendar-event"></i>
          </div>

          <h3>Jadwal Mengajar</h3>

          <p>
            Kelola jadwal mengajar dengan mudah dan fleksibel.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon purple">
            <i class="bi bi-people"></i>
          </div>

          <h3>Kegiatan Guru</h3>

          <p>
            Catat dan pantau partisipasi guru dalam setiap kegiatan.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon yellow">
            <i class="bi bi-bar-chart-line"></i>
          </div>

          <h3>Penilaian Kinerja</h3>

          <p>
            Penilaian kinerja berbasis data yang objektif dan transparan.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon blue">
            <i class="bi bi-file-earmark-text"></i>
          </div>

          <h3>Laporan</h3>

          <p>
            Laporan lengkap siap cetak dan ekspor berbagai format.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon green">
            <i class="bi bi-people-fill"></i>
          </div>

          <h3>Manajemen Guru</h3>

          <p>
            Kelola data guru dengan lebih terstruktur.
          </p>
        </div>

      </div>

      <!-- STATS -->
      <div class="stats-wrapper">

        <div class="stat-item">
          <div class="stat-icon blue">
            <i class="bi bi-buildings"></i>
          </div>

          <div>
            <h3>250+</h3>
            <span>Sekolah Pengguna</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="stat-item">
          <div class="stat-icon green">
            <i class="bi bi-people-fill"></i>
          </div>

          <div>
            <h3>5.000+</h3>
            <span>Guru Aktif</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="stat-item">
          <div class="stat-icon purple">
            <i class="bi bi-clipboard-check"></i>
          </div>

          <div>
            <h3>100.000+</h3>
            <span>Data Kehadiran Tercatat</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="stat-item">
          <div class="stat-icon yellow">
            <i class="bi bi-shield-check"></i>
          </div>

          <div>
            <h3>99.9%</h3>
            <span>Uptime Sistem</span>
          </div>
        </div>

      </div>

      <!-- CTA -->
      <div class="cta-wrapper">

        <p>
          Siap meningkatkan kinerja dan profesionalisme guru di sekolah Anda?
        </p>

        <button class="cta-btn">
          Mulai Sekarang
          <i class="bi bi-arrow-right"></i>
        </button>

      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FiturSection",
};
</script>

<style scoped>
.fitur-section {
  position: relative;

  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.18), transparent 35%),
    #020817;

  overflow: hidden;
}

/* HEADER */
.section-label {
  color: #06b6d4;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.12em;

  margin-bottom: 10px;
}

.section-title {
  color: white;

  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;

  margin-bottom: 0;
}

/* FEATURE GRID */
.feature-grid {
  display: grid;

  grid-template-columns: repeat(6, 1fr);

  gap: 14px;

  margin-top: 50px;
}

.feature-card {
  background: rgba(15, 23, 42, 0.9);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 18px;

  padding: 24px 20px;

  text-align: center;

  transition: 0.25s ease;

  min-height: 180px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.feature-card:hover {
  transform: translateY(-5px);

  border-color: rgba(59,130,246,0.35);

  background: rgba(15, 23, 42, 1);
}

.feature-icon {
  width: 56px;
  height: 56px;

  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;

  margin-bottom: 18px;
}

.feature-card h3 {
  color: white;

  font-size: 17px;
  font-weight: 700;

  margin-bottom: 10px;
}

.feature-card p {
  color: #cbd5e1;

  font-size: 13px;
  line-height: 1.6;

  margin: 0;
}

/* ICON COLORS */
.blue {
  background: rgba(37,99,235,0.16);
  color: #3b82f6;
}

.green {
  background: rgba(34,197,94,0.16);
  color: #22c55e;
}

.purple {
  background: rgba(168,85,247,0.16);
  color: #a855f7;
}

.yellow {
  background: rgba(250,204,21,0.16);
  color: #facc15;
}

/* STATS */
.stats-wrapper {
  margin-top: 18px;

  background: rgba(15, 23, 42, 0.95);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 20px;

  padding: 26px 34px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;

  gap: 16px;

  flex: 1;
}

.stat-icon {
  width: 60px;
  height: 60px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
}

.stat-item h3 {
  color: white;

  font-size: 2rem;
  font-weight: 700;

  margin: 0;
}

.stat-item span {
  color: #cbd5e1;

  font-size: 14px;
}

.divider {
  width: 1px;
  height: 60px;

  background: rgba(255,255,255,0.08);
}

/* CTA */
.cta-wrapper {
  margin-top: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 18px;

  flex-wrap: wrap;
}

.cta-wrapper p {
  color: #e2e8f0;

  margin: 0;

  font-size: 16px;
}

.cta-btn {
  border: none;

  background: linear-gradient(
    135deg,
    #2563eb,
    #3b82f6
  );

  color: white;

  padding: 12px 22px;

  border-radius: 12px;

  font-weight: 600;

  display: flex;
  align-items: center;

  gap: 10px;

  transition: 0.25s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 10px 30px rgba(37,99,235,0.35);
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 991px) {
  .stats-wrapper {
    flex-wrap: wrap;
  }

  .divider {
    display: none;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .stats-wrapper {
    padding: 20px;
  }

  .stat-item h3 {
    font-size: 1.5rem;
  }

  .cta-wrapper {
    flex-direction: column;
    text-align: center;
  }
}
</style>