const dateHistoric = new Date(1980, 10, 24, 0, 0, 0);
export default {
  name: "PomodoroCard",
  props: ["index", "isactive"],
  data() {
    return {
        title: "🍅 Pomodoro",
        minuteRest: null,
        secondRest: null,
        startDate: new Date(),
        color: '#dc3545',
        periods: [
          { startTime: 0, duration: 25 * 1000 * 60, title: "🍅 Pomodoro", color: '#dc3545', width: Math.round(25 / 130 * 100) + '%' },
          { startTime: 25 * 1000 * 60, duration: 5 * 1000 * 60, title: "☕ Pause Courte", color: '#ffc107', width: Math.round(5 / 130 * 100) + '%' },
          { startTime: 30 * 1000 * 60, duration: 25 * 1000 * 60, title: "🍅 Pomodoro", color: '#dc3545', width: Math.round(25 / 130 * 100) + '%' },
          { startTime: 55 * 1000 * 60, duration: 5 * 1000 * 60, title: "☕ Pause Courte", color: '#ffc107', width: Math.round(5 / 130 * 100) + '%' },
          { startTime: 60 * 1000 * 60, duration: 25 * 1000 * 60, title: "🍅 Pomodoro", color: '#dc3545', width: Math.round(25 / 130 * 100) + '%' },
          { startTime: 85 * 1000 * 60, duration: 5 * 1000 * 60, title: "☕ Pause Courte", color: '#ffc107', width: Math.round(5 / 130 * 100) + '%' },
          { startTime: 90 * 1000 * 60, duration: 25 * 1000 * 60, title: "🍅 Pomodoro", color: '#dc3545', width: Math.round(25 / 130 * 100) + '%' },
          { startTime: 115 * 1000 * 60, duration: 15 * 1000 * 60, title: "🏖️ Pause longue", color: '#ffc107', width: Math.round(15 / 130 * 100) + '%' }
        ],
    }
  },
  setup(index, isactive) {
  },
  created() {
    const today = new Date();
    const component = this;
    const startDateHistoric = new Date(dateHistoric.getTime() - ((this.index - 1) * (Math.floor(130/6) * 1000 * 60)));
    this.startDate = new Date(startDateHistoric.getTime() + (Math.floor((today.getTime() - startDateHistoric.getTime()) / (7800 * 1000)) * 7800 * 1000))
    this.updateTimer()
    setInterval(function() {
        component.updateTimer()
    }, 1000)
  },
  methods: {
    updateTimer() {
      let now = new Date();
      let duration = now.getTime() - this.startDate.getTime();
      for(let period of this.periods) {
        period.progress = Math.round((duration - period.startTime) / period.duration * 100)
        if(duration > period.startTime && duration <=period.startTime + period.duration) {
          this.period = period
        }
      }
      if(this.period) {
        let periodeEnd = new Date(this.startDate.getTime() + this.period.startTime + this.period.duration)
        let periodeDuration = periodeEnd.getTime() - now.getTime();
        this.minuteRest = Math.floor(Math.round(periodeDuration / 1000) / 60).toString().padStart(2, "0")
        this.secondRest = (Math.round(periodeDuration / 1000) % 60).toString().padStart(2, "0")
        this.title = this.period.title
        this.color = this.period.color
      }
    },
  },
  template: '#pomodoro-template'
}
