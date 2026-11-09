<template>
  <section id="fitur" class="fitur-section">
    <div class="container-xxl features-container">
      <header class="features-heading">
        <p class="section-label">FITUR UNGGULAN</p>
        <h2 class="section-title">Semua yang Anda Butuhkan dalam Satu Sistem</h2>
      </header>

      <div class="feature-grid">
        <article class="feature-card blue">
          <div class="feature-icon">
            <i class="bi bi-person-check" aria-hidden="true"></i>
          </div>
          <h3>Kehadiran</h3>
          <p>Informasi kehadiran tersusun rapi dan mudah diakses.</p>
        </article>

        <article class="feature-card green">
          <div class="feature-icon">
            <i class="bi bi-calendar-event" aria-hidden="true"></i>
          </div>
          <h3>Jadwal Mengajar</h3>
          <p>Kelola jadwal mengajar dengan mudah dan fleksibel.</p>
        </article>

        <article class="feature-card purple">
          <div class="feature-icon">
            <i class="bi bi-people" aria-hidden="true"></i>
          </div>
          <h3>Kegiatan Guru</h3>
          <p>Kelola agenda kegiatan dan pembagian tugas sekolah dengan praktis.</p>
        </article>

        <article class="feature-card yellow">
          <div class="feature-icon">
            <i class="bi bi-bar-chart-line" aria-hidden="true"></i>
          </div>
          <h3>Pengembangan Profesional</h3>
          <p>Dukung pengembangan profesional melalui informasi yang terarah.</p>
        </article>

        <article class="feature-card green">
          <div class="feature-icon">
            <i class="bi bi-people-fill" aria-hidden="true"></i>
          </div>
          <h3>Manajemen Guru</h3>
          <p>Kelola data guru dengan lebih terstruktur.</p>
        </article>
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
  scroll-margin-top: 90px;
  padding: clamp(3.75rem, 6vw, 5rem) 1.25rem !important;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(30, 64, 110, 0.18), transparent 58%),
    #081321;
}

.features-container {
  max-width: 1380px;
}

.features-heading {
  max-width: 850px;
  margin: 0 auto clamp(1.5rem, 3vw, 2.25rem);
  text-align: center;
}

.section-label {
  margin: 0 0 0.45rem;
  color: #22d3ee;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.section-title {
  margin: 0;
  color: #f1f5f9;
  font-size: clamp(1.7rem, 3.2vw, 2.55rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.8rem;
}

.feature-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 178px;
  align-items: center;
  flex-direction: column;
  padding: 1rem 1rem 1.1rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 13px;
  background: rgba(16, 29, 47, 0.88);
  text-align: center;
  transition:
    transform 0.25s ease,
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--feature-color) 38%, transparent);
  background: rgba(20, 36, 57, 0.96);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
}

.feature-card.blue {
  --feature-color: #1687ff;
}

.feature-card.green {
  --feature-color: #10b981;
}

.feature-card.purple {
  --feature-color: #8b5cf6;
}

.feature-card.yellow {
  --feature-color: #f59e0b;
}

.feature-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  margin: 0.05rem 0 0.7rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--feature-color) 45%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--feature-color) 17%, transparent);
  box-shadow: 0 5px 16px color-mix(in srgb, var(--feature-color) 12%, transparent);
  color: var(--feature-color);
  font-size: 1.25rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.feature-card:hover .feature-icon {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px color-mix(in srgb, var(--feature-color) 24%, transparent);
}

.feature-card h3 {
  margin: 0 0 0.4rem;
  color: #f1f5f9;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
}

.feature-card p {
  max-width: 240px;
  margin: 0;
  color: #aab6c7;
  font-size: 0.78rem;
  line-height: 1.55;
}

@media (max-width: 1050px) {
  .feature-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .feature-card {
    min-height: 168px;
  }
}

@media (max-width: 700px) {
  .fitur-section {
    padding: 3.75rem 1rem !important;
  }

  .section-title {
    font-size: clamp(1.7rem, 6vw, 2.1rem);
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.7rem;
  }

  .feature-card {
    min-height: 168px;
    padding: 0.9rem 0.7rem;
  }
}

@media (max-width: 390px) {
  .feature-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature-card {
    min-height: 0;
    padding: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .feature-icon {
    transition: none;
  }
}
</style>
