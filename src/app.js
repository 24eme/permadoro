import PomodoroCard from "./components/PomodoroCard.js";

const pomodoroCount = 6;
const icons = ["🐻","🐝", "🦊","🐢","🐨","🦦"];
// const icons = ["🐻","🐝", "🦊","🐧","🐨","🦦","🦝","🐢","🐼"];

const app = Vue.createApp({
  components: { PomodoroCard },
  data() {
    return {
      pomodoros: [],
      activeIndex: 0
    };
  },
  setup() {
    const component = this;
    window.addEventListener('hashchange', function(e) {
      if(document.location.hash) {
        this.activeIndex = parseInt(document.location.hash.replace('#', ''))
      }
    })
  },
  created() {
    if(document.location.hash) {
      this.activeIndex = parseInt(document.location.hash.replace('#', ''))
    }
    for (let i = 0; i < pomodoroCount; i++) {
      this.pomodoros.push({
        index: i,
        icon: icons[i]
      });
    }
  },
  methods: {
  },
  computed: {
  }
});

app.mount("#app");
