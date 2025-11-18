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
  mounted() {
  },
  created() {
    if(document.location.hash) {
      this.activeIndex = parseInt(document.location.hash.replace('#', ''))
    }
    for (let i = 0; i < pomodoroCount; i++) {
      this.pomodoros.push({
        ref: 'pomodoro_' + i,
        index: i,
        icon: icons[i],
        refObject: Vue.useTemplateRef('pomodoro_' + i)
      });
    }
    document.location.hash = '#'+this.pomodoros[this.activeIndex].index+this.pomodoros[this.activeIndex].icon
    window.addEventListener('hashchange', this.changeHash);
  },
  methods: {
    changeHash() {
      this.activeIndex = parseInt(document.location.hash.replace('#', ''))
      if(!document.location.hash || !this.pomodoros[this.activeIndex]) {
          return;
      }
      this.pomodoros[this.activeIndex].refObject[0].setActive()
    },
    changePomodoroActive(pActive) {
      document.location.hash = '#'+pActive.index+pActive.icon
      for(let p of this.pomodoros) {
        if(pActive.index != p.index) {
          p.refObject[0].active = false
        }
      }
    }
  },
  computed: {
  }
});

app.mount("#app");
