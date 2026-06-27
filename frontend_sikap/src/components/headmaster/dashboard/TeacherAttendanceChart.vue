<template>
  <div class="row d-flex justify-content-between align-items-center mb-3 px-2">
    <div class="col-9 text-start">
      <div>
        <h5 class="mb-0 fw-bold text-white">Rekap Kehadiran Mingguan</h5>
      </div>
    </div>
    <div class="col-3 text-end">
      <select
        class="form-select form-select-sm chart-filter px-2"
        style="width: 120px"
      >
        <option>Minggu Ini</option>
        <option>Minggu Lalu</option>
      </select>
    </div>
  </div>
  <div class="chart-wrapper">
    <Line :data="attendanceChartData" :options="attendanceChartOptions" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
);

export default {
  name: "TeacherAttendanceChart",

  components: {
    Line,
  },

  data() {
    return {
      attendanceChartData: {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum"],

        datasets: [
          {
            label: "Hadir",
            data: [30, 41, 37, 33, 44],

            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.18)",

            borderWidth: 3,

            // tension: 0.45,
            fill: true,

            pointBackgroundColor: "#22c55e",
            pointBorderColor: "#22c55e",

            pointRadius: 3,
            pointHoverRadius: 6,

            pointBorderWidth: 2,
          },

          {
            label: "Izin",
            data: [7, 9, 9, 7, 9],

            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.12)",

            borderWidth: 3,

            // tension: 0.45,
            fill: true,

            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#3b82f6",

            pointRadius: 3,
            pointHoverRadius: 5,
          },

          {
            label: "Alfa",
            data: [1, 4, 2, 10, 1],

            borderColor: "#ef4444",
            backgroundColor: "rgba(239,68,68,0.12)",

            borderWidth: 3,

            // tension: 0.45,
            fill: true,

            pointBackgroundColor: "#ef4444",
            pointBorderColor: "#ef4444",

            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },

      attendanceChartOptions: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: "index",
          intersect: false,
        },

        plugins: {
          legend: {
            position: "top",
            align: "start",

            labels: {
              color: "#dbeafe",

              usePointStyle: true,
              pointStyle: "rectRounded",

              boxWidth: 8,
              boxHeight: 8,

              padding: 18,

              font: {
                size: 11,
                weight: "600",
              },
            },
          },

          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 12,
            displayColors: true,
          },
        },

        layout: {
          padding: {
            top: -10,
            left: 0,
            right: 10,
            bottom: 10,
          },
        },

        scales: {
          x: {
            ticks: {
              color: "#cbd5e1",
              font: {
                size: 11,
                weight: "600",
              },
            },

            grid: {
              display: false,
            },

            border: {
              display: false,
            },
          },

          y: {
            min: 0,
            max: 50,

            ticks: {
              stepSize: 10,
              color: "#94a3b8",
              padding: 10,

              font: {
                size: 11,
              },
            },

            grid: {
              // color: "rgba(255,255,255,0.05)",
              drawTicks: false,
            },

            border: {
              display: false,
            },
          },
        },
      },
    };
  },
};
</script>

<style scoped>
.chart-card {
  background: linear-gradient(180deg, #071426 0%, #0b1d35 100%) !important;

  border-radius: 18px;

  border: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 10px 30px rgba(0, 0, 0, 0.25);

  overflow: hidden;
}

.chart-wrapper {
  position: relative;
  height: 250px;
  width: 100%;
}

.chart-filter {
  width: 120px;
  height: 38px;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;

  border-radius: 10px;

  font-size: 13px;
  font-weight: 600;
  appearance: auto;
  -webkit-appearance: auto;
  -moz-appearance: auto;
}

.chart-filter:focus {
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.15);
}
</style>
