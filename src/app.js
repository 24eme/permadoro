import PomodoroCard from "./components/PomodoroCard.js";

const pomodoroCount = 6;

const app = Vue.createApp({
  components: { PomodoroCard },
  data() {
    return {
      pomodoros: []
    };
  },
  created() {
    for (let i = 1; i <= pomodoroCount; i++) {
      this.pomodoros.push({
        index: i,
        isactive: i == 1
      });
    }
  },
  computed: {
    getSortedPomodoros() {
      return this.pomodoros.sort(function(a, b) { return a.startDate.getTime() > b.startDate.getTime() });
    }
  }
});

app.mount("#app");
