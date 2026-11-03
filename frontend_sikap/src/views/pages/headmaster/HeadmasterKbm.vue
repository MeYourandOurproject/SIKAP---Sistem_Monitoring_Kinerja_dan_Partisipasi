<template>
  <TeacherClassAttendance :mode="mode" />
</template>

<script>
import TeacherClassAttendance from "@/components/headmaster/kbm/TeacherClassAttendance.vue";
export default {
  name: "HeadmasterKBM",
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

<style></style>
