import PomodoroCard from "./components/PomodoroCard.js";

const pomodoroCount = 9;
const icons = ["🐻","🐝", "🦊","🐧","🐨","🦄","🐱","🐢","🐼"];

const app = Vue.createApp({
  components: { PomodoroCard },
  data() {
    return {
      pomodoros: []
    };
  },
  created() {
    let activeIndex = 0;
    if(document.location.hash) {
      activeIndex = parseInt(document.location.hash.replace('#', ''))
    }
    for (let i = 0; i < pomodoroCount; i++) {
      this.pomodoros.push({
        index: i,
        icon: icons[i],
        isactive: i == activeIndex
      });
    }
  },
  computed: {
  }
});

app.mount("#app");
