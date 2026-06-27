<template>
  <div class="announcement-page fade-page">
    <!-- HEADER -->
    <div
      class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4"
    >
      <div>
        <span class="page-label">
          MANAJEMEN INFORMASI
        </span>

        <h3 class="page-title">
          Pengumuman Sekolah
        </h3>

        <p class="page-subtitle mb-0">
          Kelola informasi, agenda, dan pemberitahuan resmi sekolah
        </p>
      </div>

      <button class="create-btn">
        <i class="bi bi-plus-circle-fill"></i>
        Buat Pengumuman
      </button>
    </div>

    <!-- TOP STATS -->
    <div class="row g-4 mb-4">

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stats-card blue-card">

          <div class="stats-icon">
            <i class="bi bi-megaphone-fill"></i>
          </div>

          <div>
            <small>Total Pengumuman</small>
            <h2>24</h2>
          </div>

        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stats-card green-card">

          <div class="stats-icon">
            <i class="bi bi-broadcast-pin"></i>
          </div>

          <div>
            <small>Aktif Hari Ini</small>
            <h2>8</h2>
          </div>

        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stats-card orange-card">

          <div class="stats-icon">
            <i class="bi bi-calendar-event-fill"></i>
          </div>

          <div>
            <small>Agenda Minggu Ini</small>
            <h2>5</h2>
          </div>

        </div>
      </div>

      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stats-card purple-card">

          <div class="stats-icon">
            <i class="bi bi-bell-fill"></i>
          </div>

          <div>
            <small>Belum Dibaca</small>
            <h2>17</h2>
          </div>

        </div>
      </div>

    </div>

    <!-- CONTENT -->
    <div class="row g-4">

      <!-- LEFT -->
      <div class="col-12 col-xl-8">

        <!-- FILTER -->
        <div class="filter-wrapper mb-4">

          <div class="search-box">
            <i class="bi bi-search"></i>

            <input
              type="text"
              v-model="search"
              placeholder="Cari pengumuman..."
            />
          </div>

          <select class="custom-select">
            <option>Semua Kategori</option>
            <option>Akademik</option>
            <option>Kegiatan</option>
            <option>Rapat</option>
            <option>Penting</option>
          </select>

        </div>

        <!-- ANNOUNCEMENT LIST -->
        <div
          class="announcement-card"
          v-for="(item, index) in filteredAnnouncements"
          :key="index"
        >

          <!-- TOP -->
          <div class="announcement-top">

            <div class="announcement-left">

              <div
                class="announcement-icon"
                :class="item.iconClass"
              >
                <i :class="item.icon"></i>
              </div>

              <div>
                <div class="announcement-meta">
                  <span class="announcement-category">
                    {{ item.category }}
                  </span>

                  <span class="announcement-date">
                    {{ item.date }}
                  </span>
                </div>

                <h5 class="announcement-title">
                  {{ item.title }}
                </h5>
              </div>

            </div>

            <span
              class="priority-badge"
              :class="item.priorityClass"
            >
              {{ item.priority }}
            </span>

          </div>

          <!-- CONTENT -->
          <p class="announcement-content">
            {{ item.content }}
          </p>

          <!-- FOOTER -->
          <div class="announcement-footer">

            <div class="author-box">
              <div class="author-avatar">
                {{ item.author.charAt(0) }}
              </div>

              <div>
                <h6>{{ item.author }}</h6>
                <small>Kepala Sekolah</small>
              </div>
            </div>

            <div class="announcement-actions">

              <button class="action-btn">
                <i class="bi bi-pencil-square"></i>
              </button>

              <button class="action-btn">
                <i class="bi bi-eye-fill"></i>
              </button>

              <button class="action-btn delete">
                <i class="bi bi-trash-fill"></i>
              </button>

            </div>

          </div>

        </div>

      </div>

      <!-- RIGHT -->
      <div class="col-12 col-xl-4">

        <!-- QUICK POST -->
        <div class="quick-post-card mb-4">

          <div class="section-header">
            <h5>Buat Pengumuman Cepat</h5>

            <small>
              Informasi singkat untuk guru
            </small>
          </div>

          <div class="form-group">
            <label>Judul</label>

            <input
              type="text"
              class="custom-input"
              placeholder="Masukkan judul..."
            />
          </div>

          <div class="form-group">
            <label>Kategori</label>

            <select class="custom-input">
              <option>Akademik</option>
              <option>Kegiatan</option>
              <option>Rapat</option>
              <option>Penting</option>
            </select>
          </div>

          <div class="form-group">
            <label>Isi Pengumuman</label>

            <textarea
              rows="5"
              class="custom-input"
              placeholder="Tulis pengumuman..."
            ></textarea>
          </div>

          <button class="publish-btn">
            <i class="bi bi-send-fill"></i>
            Publikasikan
          </button>

        </div>

        <!-- RECENT ACTIVITY -->
        <div class="activity-card">

          <div class="section-header mb-4">
            <h5>Aktivitas Terbaru</h5>

            <small>
              Riwayat pengumuman terakhir
            </small>
          </div>

          <div class="activity-list">

            <div class="activity-item">
              <div class="activity-dot blue-dot"></div>

              <div>
                <p>
                  Pengumuman rapat dinas dipublikasikan
                </p>

                <small>10 menit lalu</small>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot green-dot"></div>

              <div>
                <p>
                  Jadwal Panca Waluya diperbarui
                </p>

                <small>35 menit lalu</small>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot orange-dot"></div>

              <div>
                <p>
                  Agenda workshop guru ditambahkan
                </p>

                <small>1 jam lalu</small>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-dot red-dot"></div>

              <div>
                <p>
                  Pengumuman penting dikirim ke semua guru
                </p>

                <small>2 jam lalu</small>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "AnnouncementPage",

  data() {
    return {
      search: "",

      announcements: [
        {
          title: "Rapat Dinas Bulanan Guru",
          category: "Rapat",
          date: "Hari Ini • 08:00",

          priority: "Penting",
          priorityClass: "priority-red",

          icon: "bi bi-people-fill",
          iconClass: "icon-blue",

          author: "Drs. Kepala Sekolah",

          content:
            "Seluruh guru diwajibkan hadir pada rapat dinas bulanan yang akan dilaksanakan di aula sekolah pukul 13.00 WIB.",
        },

        {
          title: "Kegiatan Panca Waluya Minggu Ini",
          category: "Kegiatan",
          date: "Hari Ini • 07:30",

          priority: "Normal",
          priorityClass: "priority-green",

          icon: "bi bi-award-fill",
          iconClass: "icon-green",

          author: "Drs. Kepala Sekolah",

          content:
            "Pelaksanaan kegiatan Panca Waluya minggu ini dilaksanakan setiap pagi sebelum KBM dimulai.",
        },

        {
          title: "Pengumpulan Administrasi Guru",
          category: "Akademik",
          date: "Kemarin • 14:20",

          priority: "Urgent",
          priorityClass: "priority-orange",

          icon: "bi bi-folder-fill",
          iconClass: "icon-orange",

          author: "Drs. Kepala Sekolah",

          content:
            "Mohon seluruh guru segera melengkapi administrasi pembelajaran semester genap sebelum hari Jumat.",
        },

        {
          title: "Workshop Implementasi Kurikulum",
          category: "Kegiatan",
          date: "Kemarin • 10:10",

          priority: "Normal",
          priorityClass: "priority-green",

          icon: "bi bi-mortarboard-fill",
          iconClass: "icon-purple",

          author: "Drs. Kepala Sekolah",

          content:
            "Workshop implementasi kurikulum akan dilaksanakan pada hari Sabtu di ruang multimedia.",
        },
      ],
    };
  },

  computed: {
    filteredAnnouncements() {
      return this.announcements.filter((item) =>
        item.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.fade-page {
  animation: fadePage 0.3s ease;
}

@keyframes fadePage {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-label {
  display: inline-block;

  padding: 6px 12px;

  border-radius: 999px;

  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  font-size: 11px;
  font-weight: 700;

  margin-bottom: 14px;
}

.page-title {
  color: white;

  font-size: 30px;
  font-weight: 700;
}

.page-subtitle {
  color: #94a3b8;

  font-size: 14px;
}

/* BUTTON */
.create-btn {
  height: 48px;

  border: none;

  padding: 0 20px;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );

  color: white;

  display: flex;
  align-items: center;

  gap: 10px;

  font-size: 14px;
  font-weight: 600;
}

/* STATS */
.stats-card {
  border-radius: 24px;

  padding: 22px;

  display: flex;
  align-items: center;

  gap: 18px;

  color: white;
}

.stats-card small {
  opacity: 0.8;
}

.stats-card h2 {
  margin: 6px 0 0;

  font-size: 32px;
  font-weight: 700;
}

.stats-icon {
  width: 60px;
  height: 60px;

  border-radius: 20px;

  background: rgba(255,255,255,0.16);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.blue-card {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.green-card {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.orange-card {
  background: linear-gradient(135deg, #ea580c, #c2410c);
}

.purple-card {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

/* FILTER */
.filter-wrapper {
  display: flex;
  gap: 14px;

  flex-wrap: wrap;
}

.search-box {
  flex: 1;

  min-width: 260px;

  height: 50px;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 16px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  gap: 10px;
}

.search-box i {
  color: #94a3b8;
}

.search-box input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: white;
}

.custom-select {
  min-width: 200px;

  height: 50px;

  border-radius: 16px;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  color: white;

  padding: 0 14px;
}

/* ANNOUNCEMENT */
.announcement-card,
.quick-post-card,
.activity-card {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 26px;

  padding: 24px;
}

.announcement-card {
  margin-bottom: 20px;
}

.announcement-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 16px;

  margin-bottom: 18px;
}

.announcement-left {
  display: flex;
  gap: 16px;
}

.announcement-icon {
  width: 56px;
  height: 56px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.icon-blue {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}

.icon-green {
  background: rgba(34,197,94,0.15);
  color: #4ade80;
}

.icon-orange {
  background: rgba(249,115,22,0.15);
  color: #fb923c;
}

.icon-purple {
  background: rgba(139,92,246,0.15);
  color: #a78bfa;
}

.announcement-meta {
  display: flex;
  gap: 10px;

  flex-wrap: wrap;

  margin-bottom: 8px;
}

.announcement-category,
.announcement-date {
  font-size: 12px;
  color: #94a3b8;
}

.announcement-title {
  color: white;

  font-size: 20px;
  font-weight: 700;
}

.announcement-content {
  color: #cbd5e1;

  line-height: 1.7;

  margin-bottom: 24px;
}

.priority-badge {
  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.priority-red {
  background: rgba(239,68,68,0.15);
  color: #f87171;
}

.priority-orange {
  background: rgba(249,115,22,0.15);
  color: #fb923c;
}

.priority-green {
  background: rgba(34,197,94,0.15);
  color: #4ade80;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 14px;

  flex-wrap: wrap;
}

.author-box {
  display: flex;
  align-items: center;

  gap: 12px;
}

.author-avatar {
  width: 42px;
  height: 42px;

  border-radius: 14px;

  background: linear-gradient(
    135deg,
    #3b82f6,
    #6366f1
  );

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-weight: 700;
}

.author-box h6 {
  margin: 0;

  color: white;
}

.author-box small {
  color: #94a3b8;
}

.announcement-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 40px;
  height: 40px;

  border: none;

  border-radius: 14px;

  background: rgba(255,255,255,0.05);

  color: white;
}

.action-btn.delete {
  color: #f87171;
}

/* FORM */
.section-header h5 {
  color: white;

  font-size: 18px;
  font-weight: 700;
}

.section-header small {
  color: #94a3b8;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  color: white;

  margin-bottom: 10px;

  display: block;

  font-size: 13px;
}

.custom-input {
  width: 100%;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 16px;

  padding: 14px;

  color: white;

  outline: none;
}

.publish-btn {
  width: 100%;

  height: 50px;

  border: none;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    #2563eb,
    #4f46e5
  );

  color: white;

  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;
}

/* ACTIVITY */
.activity-list {
  display: flex;
  flex-direction: column;

  gap: 20px;
}

.activity-item {
  display: flex;
  gap: 14px;
}

.activity-item p {
  color: white;

  margin-bottom: 4px;

  font-size: 14px;
}

.activity-item small {
  color: #94a3b8;
}

.activity-dot {
  width: 12px;
  height: 12px;

  border-radius: 50%;

  margin-top: 5px;
}

.blue-dot {
  background: #3b82f6;
}

.green-dot {
  background: #22c55e;
}

.orange-dot {
  background: #fb923c;
}

.red-dot {
  background: #ef4444;
}

/* MOBILE */
@media (max-width: 768px) {

  .page-title {
    font-size: 24px;
  }

  .announcement-top {
    flex-direction: column;
  }

  .custom-select {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }
}
</style>