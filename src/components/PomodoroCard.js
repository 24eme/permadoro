const dateHistoric = new Date(1980, 10, 24, 0, 0, 0);
const pomodoroMinutes = 25;
const shortbreakMinutes = 5;
const longbreakMinutes = 15;
const totalMinutes = 130;
const pomodoroPeriods = {
  pomodoro: { title: "🍅 Pomodoro", duration: pomodoroMinutes * 1000 * 60, color: '#dc3545'},
  shortbreak: { title: "☕ Pause Courte", duration: shortbreakMinutes * 1000 * 60, color: '#ffc107'},
  longbreak: { title: "🏖️ Pause longue", duration: longbreakMinutes * 1000 * 60, color: '#ffc107'}
}

export default {
  name: "PomodoroCard",
  props: ["index", "icon", "isactive", "partof"],
  data() {
    return {
        title: pomodoroPeriods.pomodoro.title,
        active: false,
        minuteRest: null,
        secondRest: null,
        startDateHistoric: null,
        startDate: new Date(),
        duration: 0,
        color: pomodoroPeriods.pomodoro.color,
        periods: [
          { startTime: 0, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 25 * 1000 * 60, duration: pomodoroPeriods.shortbreak.duration, title: pomodoroPeriods.shortbreak.title, color: pomodoroPeriods.shortbreak.color, width: Math.round(shortbreakMinutes / totalMinutes * 100) + '%' },
          { startTime: 30 * 1000 * 60, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 55 * 1000 * 60, duration: pomodoroPeriods.shortbreak.duration, title: pomodoroPeriods.shortbreak.title, color: pomodoroPeriods.shortbreak.color, width: Math.round(shortbreakMinutes / totalMinutes * 100) + '%' },
          { startTime: 60 * 1000 * 60, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 85 * 1000 * 60, duration: pomodoroPeriods.shortbreak.duration, title: pomodoroPeriods.shortbreak.title, color: pomodoroPeriods.shortbreak.color, width: Math.round(shortbreakMinutes / totalMinutes * 100) + '%' },
          { startTime: 90 * 1000 * 60, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 115 * 1000 * 60, duration: pomodoroPeriods.longbreak.duration, title: pomodoroPeriods.longbreak.title, color: pomodoroPeriods.longbreak.color, width: Math.round(longbreakMinutes / totalMinutes * 100) + '%' }
        ],
    }
  },
  setup(index, icon, isactive, partof) {
  },
  created() {
    this.active = this.isactive
    this.startDateHistoric = new Date(dateHistoric.getTime() - (this.index * (Math.floor(totalMinutes/this.partof) * 1000 * 60)));
    this.updateStartDate()
    this.updateTimer()
    setInterval(this.updateTimer, 1000)
  },
  methods: {
    updateStartDate() {
      const today = new Date();
      this.startDate = new Date(this.startDateHistoric.getTime() + (Math.floor((today.getTime() - this.startDateHistoric.getTime()) / (7800 * 1000)) * 7800 * 1000))
    },
    updateTimer() {
      let now = new Date();
      let duration = now.getTime() - this.startDate.getTime();
      for(let period of this.periods) {
        period.progress = Math.round((duration - period.startTime) / period.duration * 100)
        if(duration > period.startTime && duration <=period.startTime + period.duration) {
          this.period = period
        }
      }
      this.duration = duration;
      if(this.period) {
        let periodeEnd = new Date(this.startDate.getTime() + this.period.startTime + this.period.duration)
        let periodeDuration = periodeEnd.getTime() - now.getTime();
        this.minuteRest = Math.floor(Math.round(periodeDuration / 1000) / 60).toString().padStart(2, "0")
        this.secondRest = (Math.round(periodeDuration / 1000) % 60).toString().padStart(2, "0")
        this.title = this.period.title
        this.color = this.period.color
      }
      if(this.duration >= totalMinutes * 1000 * 60) {
        this.updateStartDate();
        this.updateTimer()
        this.$emit('end', this);
      }
    },
    setActive() {
      this.active = true
      this.$emit('changeActive', this);
    }
  },
  watch: {
    'active': function() {
    }
  },
  template: '#pomodoro-template'
}
