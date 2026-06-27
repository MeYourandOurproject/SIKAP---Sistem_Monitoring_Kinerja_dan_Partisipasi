<template>
  <div class="activities-page">

    <!-- HEADER -->
    <div
      class="page-header"
    >

      <div>
        <span class="header-badge">
          MANAJEMEN KEGIATAN
        </span>

        <h2 class="page-title mt-3">
          Kegiatan Sekolah & KBM
        </h2>

        <p class="page-subtitle mb-0">
          Kelola seluruh kegiatan sekolah, monitoring status pelaksanaan,
          dan dokumentasi aktivitas guru secara terstruktur.
        </p>
      </div>

      <div class="header-stats">

        <div class="mini-stat">
          <strong>{{ activities.length }}</strong>
          <span>Total Kegiatan</span>
        </div>

        <div class="mini-stat green">
          <strong>{{ ongoingCount }}</strong>
          <span>Berlangsung</span>
        </div>

      </div>

    </div>

    <!-- CONTENT -->
    <div class="row g-4 mt-1">

      <!-- FORM -->
      <div class="col-12 col-xl-4">

        <div class="glass-card form-card">

          <div class="form-top mb-4">

            <div class="form-icon">
              <i class="bi bi-plus-circle-fill"></i>
            </div>

            <div>
              <h5 class="section-title mb-1">
                Tambah Kegiatan
              </h5>

              <small class="section-subtitle">
                Input kegiatan baru sekolah
              </small>
            </div>

          </div>

          <!-- ALERT -->
          <div
            v-if="message.text"
            class="custom-alert"
            :class="message.type === 'success'
              ? 'alert-success-custom'
              : 'alert-danger-custom'"
          >
            <i
              class="bi"
              :class="message.type === 'success'
                ? 'bi-check-circle-fill'
                : 'bi-exclamation-circle-fill'"
            ></i>

            {{ message.text }}
          </div>

          <!-- FORM -->
          <form @submit.prevent="submitActivity">

            <div class="mb-3">
              <label class="form-label-custom">
                Nama Kegiatan
              </label>

              <input
                v-model="form.name"
                type="text"
                class="custom-input"
                placeholder="Contoh: Workshop Kurikulum"
              />
            </div>

            <div class="mb-3">
              <label class="form-label-custom">
                Jenis Kegiatan
              </label>

              <select
                v-model="form.type"
                class="custom-input"
              >
                <option value="">
                  Pilih jenis kegiatan
                </option>

                <option value="Kegiatan Sekolah">
                  Kegiatan Sekolah
                </option>

                <option value="KBM">
                  KBM
                </option>

              </select>
            </div>

            <div class="row g-3 mb-3">

              <div class="col-6">

                <label class="form-label-custom">
                  Tanggal
                </label>

                <input
                  v-model="form.date"
                  type="date"
                  class="custom-input"
                />

              </div>

              <div class="col-6">

                <label class="form-label-custom">
                  Penanggung Jawab
                </label>

                <input
                  v-model="form.responsiblePerson"
                  type="text"
                  class="custom-input"
                  placeholder="Nama PJ"
                />

              </div>

            </div>

            <div class="mb-3">

              <label class="form-label-custom">
                Deskripsi
              </label>

              <textarea
                v-model="form.description"
                rows="4"
                class="custom-input textarea-custom"
                placeholder="Tuliskan deskripsi kegiatan..."
              ></textarea>

            </div>

            <div class="mb-4">

              <label class="form-label-custom">
                Status
              </label>

              <select
                v-model="form.status"
                class="custom-input"
              >

                <option value="planned">
                  Planned
                </option>

                <option value="ongoing">
                  Ongoing
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="isSubmitting"
            >

              <i class="bi bi-save2-fill"></i>

              {{
                isSubmitting
                  ? "Menyimpan..."
                  : "Simpan Kegiatan"
              }}

            </button>

          </form>

        </div>

      </div>

      <!-- LIST -->
      <div class="col-12 col-xl-8">

        <div class="glass-card">

          <!-- HEADER -->
          <div
            class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
          >

            <div>
              <h5 class="section-title mb-1">
                Daftar Kegiatan
              </h5>

              <small class="section-subtitle">
                Monitoring seluruh aktivitas sekolah
              </small>
            </div>

            <div class="search-box">

              <i class="bi bi-search"></i>

              <input
                type="text"
                v-model="search"
                placeholder="Cari kegiatan..."
              />

            </div>

          </div>

          <!-- LIST -->
          <div
            v-if="filteredActivities.length"
            class="activity-grid"
          >

            <div
              v-for="activity in filteredActivities"
              :key="activity.id"
              class="activity-card"
            >

              <!-- TOP -->
              <div class="activity-top">

                <div
                  class="activity-type-icon"
                  :class="activity.type === 'KBM'
                    ? 'blue-icon'
                    : 'green-icon'"
                >

                  <i
                    class="bi"
                    :class="activity.type === 'KBM'
                      ? 'bi-journal-bookmark-fill'
                      : 'bi-calendar-event-fill'"
                  ></i>

                </div>

                <span
                  class="status-pill"
                  :class="statusClass(activity.status)"
                >
                  {{ activity.status }}
                </span>

              </div>

              <!-- BODY -->
              <h5 class="activity-title">
                {{ activity.name }}
              </h5>

              <p class="activity-description">
                {{ activity.description || 'Tidak ada deskripsi kegiatan.' }}
              </p>

              <!-- INFO -->
              <div class="activity-info">

                <div class="info-item">
                  <i class="bi bi-calendar2-week"></i>

                  {{ formatDate(activity.date) }}
                </div>

                <div class="info-item">
                  <i class="bi bi-person-circle"></i>

                  {{ activity.responsiblePerson || 'Belum ditentukan' }}
                </div>

              </div>

              <!-- FOOTER -->
              <div class="activity-footer">

                <span class="activity-category">
                  {{ activity.type }}
                </span>

                <button class="detail-btn">
                  Detail
                </button>

              </div>

            </div>

          </div>

          <!-- EMPTY -->
          <div
            v-else
            class="empty-state"
          >

            <i class="bi bi-calendar-x"></i>

            <h5>
              Belum Ada Kegiatan
            </h5>

            <p>
              Tambahkan kegiatan pertama Anda untuk mulai monitoring aktivitas sekolah.
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
// import { activityAPI } from "@/utils/api";

export default {
  name: "PersonResponsibleActivities",

  data() {
    return {
      search: "",

      form: {
        name: "",
        type: "",
        date: "",
        responsiblePerson: "",
        description: "",
        status: "planned",
      },

      activities: [],

      message: {
        text: "",
        type: "success",
      },

      isSubmitting: false,
    };
  },

  computed: {
    filteredActivities() {
      return this.activities.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    ongoingCount() {
      return this.activities.filter(
        (item) => item.status === "ongoing"
      ).length;
    },
  },

  mounted() {
    this.fetchActivities();
  },

  methods: {
    async fetchActivities() {
      const response = await activityAPI.getAll();

      if (response.success) {
        this.activities = response.data;
      }
    },

    async submitActivity() {
      if (
        !this.form.name ||
        !this.form.type ||
        !this.form.date
      ) {
        this.message = {
          text:
            "Nama, jenis, dan tanggal kegiatan wajib diisi.",
          type: "danger",
        };

        return;
      }

      this.isSubmitting = true;

      const response = await activityAPI.create({
        name: this.form.name,
        type: this.form.type,
        date: this.form.date,
        responsiblePerson: this.form.responsiblePerson,
        description: this.form.description,
        status: this.form.status,
      });

      if (response.success) {
        this.message = {
          text: "Kegiatan berhasil disimpan.",
          type: "success",
        };

        this.form = {
          name: "",
          type: "",
          date: "",
          responsiblePerson: "",
          description: "",
          status: "planned",
        };

        this.fetchActivities();
      } else {
        this.message = {
          text:
            response.error ||
            "Gagal menyimpan kegiatan.",
          type: "danger",
        };
      }

      this.isSubmitting = false;
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    },

    statusClass(status) {
      switch (status) {
        case "ongoing":
          return "status-warning";

        case "completed":
          return "status-success";

        case "cancelled":
          return "status-danger";

        default:
          return "status-secondary";
      }
    },
  },
};
</script>

<style scoped>
.activities-page {
  color: white;

  animation: fadePage 0.3s ease;
}

/* HEADER */
.page-header {
  background:
    linear-gradient(
      135deg,
      rgba(59,130,246,0.18),
      rgba(15,23,42,0.95)
    );

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 28px;

  padding: 28px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;

  flex-wrap: wrap;
}

.header-badge {
  background: rgba(34,197,94,0.15);

  color: #4ade80;

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 1px;
}

.page-title {
  font-size: 34px;

  font-weight: 700;

  color: white;
}

.page-subtitle {
  color: #94a3b8;

  max-width: 700px;

  line-height: 1.7;
}

.header-stats {
  display: flex;

  gap: 16px;
}

.mini-stat {
  min-width: 130px;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 20px;

  padding: 18px;

  text-align: center;
}

.mini-stat strong {
  display: block;

  font-size: 26px;

  color: white;
}

.mini-stat span {
  color: #94a3b8;

  font-size: 12px;
}

.mini-stat.green strong {
  color: #4ade80;
}

/* CARD */
.glass-card {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 28px;

  padding: 24px;
}

.section-title {
  color: white;

  font-weight: 700;
}

.section-subtitle {
  color: #94a3b8;
}

/* FORM */
.form-card {
  position: sticky;

  top: 20px;
}

.form-top {
  display: flex;
  align-items: center;

  gap: 16px;
}

.form-icon {
  width: 58px;
  height: 58px;

  border-radius: 18px;

  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.form-label-custom {
  display: block;

  margin-bottom: 10px;

  color: #cbd5e1;

  font-size: 13px;
  font-weight: 600;
}

.custom-input {
  width: 100%;

  height: 52px;

  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 16px;

  padding: 0 16px;

  color: white;

  outline: none;

  transition: 0.2s ease;
}

.textarea-custom {
  height: auto;

  padding-top: 14px;
}

.custom-input:focus {
  border-color: rgba(59,130,246,0.4);

  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.custom-input::placeholder {
  color: #64748b;
}

.submit-btn {
  width: 100%;

  height: 54px;

  border: none;

  border-radius: 18px;

  background: linear-gradient(
    135deg,
    #2563eb,
    #1d4ed8
  );

  color: white;

  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  transition: 0.25s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

/* ALERT */
.custom-alert {
  padding: 14px 16px;

  border-radius: 16px;

  margin-bottom: 18px;

  display: flex;
  align-items: center;

  gap: 10px;

  font-size: 14px;
}

.alert-success-custom {
  background: rgba(34,197,94,0.15);

  color: #4ade80;
}

.alert-danger-custom {
  background: rgba(239,68,68,0.15);

  color: #f87171;
}

/* SEARCH */
.search-box {
  width: 260px;
  height: 48px;

  background: rgba(255,255,255,0.04);

  border: 1px solid rgba(255,255,255,0.06);

  border-radius: 16px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 16px;
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

.search-box input::placeholder {
  color: #64748b;
}

/* GRID */
.activity-grid {
  display: grid;

  grid-template-columns: repeat(
    auto-fill,
    minmax(280px, 1fr)
  );

  gap: 18px;
}

.activity-card {
  background: rgba(255,255,255,0.03);

  border: 1px solid rgba(255,255,255,0.05);

  border-radius: 24px;

  padding: 20px;

  transition: 0.25s ease;
}

.activity-card:hover {
  transform: translateY(-4px);

  background: rgba(255,255,255,0.05);
}

.activity-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 18px;
}

.activity-type-icon {
  width: 54px;
  height: 54px;

  border-radius: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.blue-icon {
  background: rgba(59,130,246,0.15);

  color: #60a5fa;
}

.green-icon {
  background: rgba(34,197,94,0.15);

  color: #4ade80;
}

.activity-title {
  color: white;

  font-size: 18px;
  font-weight: 700;

  margin-bottom: 10px;
}

.activity-description {
  color: #94a3b8;

  font-size: 13px;

  line-height: 1.7;

  min-height: 50px;
}

.activity-info {
  display: flex;
  flex-direction: column;

  gap: 10px;

  margin-top: 18px;
}

.info-item {
  display: flex;
  align-items: center;

  gap: 10px;

  color: #cbd5e1;

  font-size: 13px;
}

.activity-footer {
  margin-top: 20px;

  padding-top: 16px;

  border-top: 1px solid rgba(255,255,255,0.06);

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-category {
  background: rgba(255,255,255,0.05);

  color: #cbd5e1;

  padding: 7px 12px;

  border-radius: 999px;

  font-size: 12px;
}

.detail-btn {
  border: none;

  height: 40px;

  padding: 0 18px;

  border-radius: 12px;

  background: rgba(59,130,246,0.15);

  color: #60a5fa;

  font-size: 13px;
  font-weight: 600;
}

/* STATUS */
.status-pill {
  padding: 6px 12px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.status-warning {
  background: rgba(250,204,21,0.15);

  color: #fde047;
}

.status-success {
  background: rgba(34,197,94,0.15);

  color: #4ade80;
}

.status-danger {
  background: rgba(239,68,68,0.15);

  color: #f87171;
}

.status-secondary {
  background: rgba(148,163,184,0.15);

  color: #cbd5e1;
}

/* EMPTY */
.empty-state {
  padding: 80px 20px;

  text-align: center;

  color: #94a3b8;
}

.empty-state i {
  font-size: 60px;

  margin-bottom: 18px;

  color: #475569;
}

/* ANIMATION */
@keyframes fadePage {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* MOBILE */
@media (max-width: 768px) {

  .page-title {
    font-size: 28px;
  }

  .header-stats {
    width: 100%;
  }

  .mini-stat {
    flex: 1;
  }

  .search-box {
    width: 100%;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>