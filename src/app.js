import PomodoroCard from "./components/PomodoroCard.js";

const pomodoroCount = 6;
const icons = ["🐻","🐝", "🦊","🐢","🐨","🦦","🐧","🐯","🐳","🐗","🐼","🦔","🦝","🐶"];

document.addEventListener("DOMContentLoaded", (event) => {
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

const app = Vue.createApp({
  components: { PomodoroCard },
  data() {
    return {
      pomodoros: [],
      activeIndex: null,
      viewAll: false,
      hasSound: parseInt(localStorage.getItem("sound"))
    };
  },
  setup() {
    FavIconX.config({
      borderColor: '#000',
      fillColor: '#000',
      borderWidth: 2,
      shadowColor: '#fff',
      shape: 'circle',
      updateTitle: false
    });

    document.title = 'Permadoro - Pomodoro collectif';
  },
  mounted() {
    this.sortPomodoros();
    if(!this.activeIndex) {
      this.activeIndex = this.pomodoros[0].index;
    }
    this.getPomodoro(this.activeIndex).refObject[0].setActive()
    this.updateHash();
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
        partof: pomodoroCount,
        refObject: Vue.useTemplateRef('pomodoro_' + i)
      });
    }
    this.updateHash();
    window.addEventListener('hashchange', this.changeHash);
  },
  methods: {
    sortPomodoros() {
      this.pomodoros.sort(function(a, b) {
        if(!a.refObject) {
          return a.index <= b.index;
        }
        return a.refObject[0].duration > b.refObject[0].duration
      });
    },
    getPomodoro(index) {
      for(let p of this.pomodoros) {
        if(p.index == index) {
          return p;
        }
      }

      return null;
    },
    changeHash() {
      const activeIndex = parseInt(document.location.hash.replace('#', ''))
      const p = this.getPomodoro(activeIndex);
      if(!document.location.hash || !p || !p.refObject) {
          return;
      }
      this.activeIndex = activeIndex
      p.refObject[0].setActive();
    },
    updateHash() {
      const p = this.getPomodoro(this.activeIndex);
      if(!p) {
        return;
      }
      document.location.hash = '#'+p.index+p.icon;
    },
    changePomodoroActive(pActive) {
      if(this.activeIndex == pActive.index) {
        this.viewAll = false
        return;
      }
      this.activeIndex = pActive.index;
      this.updateHash();
      for(let p of this.pomodoros) {
        if(this.activeIndex != p.index) {
          p.refObject[0].deactivate()
        }
      }
      this.viewAll = false
    },
    changePomodoroPeriod(p, newPeriod) {
      if(this.hasSound) {
        document.getElementById("audio_bell").play();
      }
      if(p.activeNotifications) {
        new Notification(p.icon + ' ' + p.period.title, {
          body: newPeriod.notification
        });
      }
    },
    endPomodoro(p) {
      this.sortPomodoros();
    },
    toggleViewAll() {
      this.viewAll = !this.viewAll;
    },
    toggleSound() {
      this.hasSound = !this.hasSound;
      localStorage.setItem("sound", this.hasSound*1);
    }
  }
});

app.mount("#app");
