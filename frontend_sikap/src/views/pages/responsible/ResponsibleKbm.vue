<template>
  <TeacherClassAttendance :mode="mode" />
</template>

<script>
import TeacherClassAttendance from "@/components/headmaster/kbm/TeacherClassAttendance.vue";

export default {
  name: "ResponsibleKbm",
  props: {
    mode: {
      type: String,
      default: "realtime",
    },
  },
  components: {
    TeacherClassAttendance,
  },
};
</script>
