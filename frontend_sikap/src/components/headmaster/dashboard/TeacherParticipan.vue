<template>
  <!-- HEADER -->
  <div class="row d-flex justify-content-between align-items-center mb-4 px-2">
    <div class="col-9 text-start">
      <h5 class="chart-title mb-0">Partisipasi Kegiatan</h5>
    </div>

    <div class="col-3 text-end">
      <select class="form-select form-select-sm chart-filter">
        <option>Mei 2024</option>
        <option>April 2024</option>
        <option>Maret 2024</option>
      </select>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="row align-items-center">
    <!-- DONUT -->
    <div class="col-12 col-md-5">
      <div class="donut-wrapper">
        <Doughnut :data="chartData" :options="chartOptions" />

        <!-- CENTER TEXT -->
        <div class="donut-center">
          <small>Total Kegiatan</small>
          <h2>12</h2>
        </div>
      </div>
    </div>

    <!-- LEGEND -->
    <div class="col-12 col-md-7">
      <div class="legend-list">
        <div class="legend-item">
          <div class="legend-left">
            <span class="legend-dot green"></span>
            <span>Mengikuti</span>
          </div>

          <div class="legend-right">
            <strong>72%</strong>
            <span>(31)</span>
          </div>
        </div>

        <div class="legend-item">
          <div class="legend-left">
            <span class="legend-dot blue"></span>
            <span>Menjadi Panitia</span>
          </div>

          <div class="legend-right">
            <strong>20%</strong>
            <span>(9)</span>
          </div>
        </div>

        <div class="legend-item">
          <div class="legend-left">
            <span class="legend-dot yellow"></span>
            <span>Tidak Mengikuti</span>
          </div>

          <div class="legend-right">
            <strong>8%</strong>
            <span>(2)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

import { Doughnut } from "vue-chartjs";

ChartJS.register(Tooltip, Legend, ArcElement);

export default {
  name: "TeacherActivityChart",

  components: {
    Doughnut,
  },

  data() {
    return {
      chartData: {
        labels: ["Mengikuti", "Menjadi Panitia", "Tidak Mengikuti"],

        datasets: [
          {
            data: [72, 20, 8],

            backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b"],

            borderWidth: 0,

            hoverOffset: 4,
          },
        ],
      },

      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: "72%",

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 12,
          },
        },
      },
    };
  },
};
</script>

<style scoped>
.activity-chart-card {
  background: linear-gradient(180deg, #071426 0%, #0b1d35 100%);

  border-radius: 20px;

  border: 1px solid rgba(255, 255, 255, 0.06);

  padding: 20px;

  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 10px 30px rgba(0, 0, 0, 0.25);
}

.chart-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.chart-filter {
  width: 120px;
  height: 38px;

  background-color: rgba(255, 255, 255, 0.04);

  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;

  border-radius: 10px;

  font-size: 13px;
  font-weight: 600;

  padding-right: 35px;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

  background-repeat: no-repeat;
  background-position: right 12px center;
}

.chart-filter:focus {
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.15);
}

.donut-wrapper {
  position: relative;
  width: 220px;
  height: 220px;

  margin: auto;
}

.donut-center {
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  text-align: center;

  color: white;
}

.donut-center small {
  display: block;

  font-size: 12px;

  color: #94a3b8;

  margin-bottom: 4px;
}

.donut-center h2 {
  margin: 0;

  font-size: 40px;
  font-weight: 700;
}

.legend-list {
  display: flex;
  flex-direction: column;

  gap: 22px;
}

.legend-item {
  display: flex;

  justify-content: space-between;
  align-items: center;

  color: white;
}

.legend-left {
  display: flex;
  align-items: center;

  gap: 12px;

  font-size: 15px;
  font-weight: 500;
}

.legend-dot {
  width: 14px;
  height: 14px;

  border-radius: 4px;

  display: inline-block;
}

.green {
  background: #22c55e;
}

.blue {
  background: #3b82f6;
}

.yellow {
  background: #f59e0b;
}

.legend-right {
  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 15px;
}

.legend-right strong {
  font-weight: 700;
}

.legend-right span {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .legend-list {
    margin-top: 30px;
  }

  .donut-wrapper {
    width: 180px;
    height: 180px;
  }

  .donut-center h2 {
    font-size: 32px;
  }
}
</style>
