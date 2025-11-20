const dateHistoric = new Date(1980, 10, 24, 0, 0, 0);
const pomodoroMinutes = 25;
const shortbreakMinutes = 5;
const longbreakMinutes = 15;
const totalMinutes = 130;
const pomodoroPeriods = {
  pomodoro: { title: "🍅 Pomodoro", notification: "On ce concentre sur sa tâche pendant 25 minutes, aucune distraction !", duration: pomodoroMinutes * 1000 * 60, color: '#dc3545'},
  shortbreak: { title: "☕ Pause Courte", notification: "On lève les mains du clavier, courte pause de 5 minutes !", duration: shortbreakMinutes * 1000 * 60, color: '#ffc107'},
  longbreak: { title: "🏖️ Pause longue", notification: "Loooooonnnngue pause, 15 minutes pour chiller !", duration: longbreakMinutes * 1000 * 60, color: '#ffc107'}
}

export default {
  name: "PomodoroCard",
  props: ["index", "icon", "isactive", "partof"],
  data() {
    return {
        title: pomodoroPeriods.pomodoro.title, notification: pomodoroPeriods.pomodoro.notification,
        active: false,
        minuteRest: null,
        secondRest: null,
        startDateHistoric: null,
        startDate: new Date(),
        hasNotification: Notification.permission === "granted",
        duration: 0,
        color: pomodoroPeriods.pomodoro.color,
        periods: [
          { startTime: 0, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, notification: pomodoroPeriods.pomodoro.notification, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 25 * 1000 * 60, duration: pomodoroPeriods.shortbreak.duration, title: pomodoroPeriods.shortbreak.title, notification: pomodoroPeriods.shortbreak.notification, color: pomodoroPeriods.shortbreak.color, width: Math.round(shortbreakMinutes / totalMinutes * 100) + '%' },
          { startTime: 30 * 1000 * 60, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, notification: pomodoroPeriods.pomodoro.notification, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 55 * 1000 * 60, duration: pomodoroPeriods.shortbreak.duration, title: pomodoroPeriods.shortbreak.title, notification: pomodoroPeriods.shortbreak.notification, color: pomodoroPeriods.shortbreak.color, width: Math.round(shortbreakMinutes / totalMinutes * 100) + '%' },
          { startTime: 60 * 1000 * 60, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, notification: pomodoroPeriods.pomodoro.notification, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 85 * 1000 * 60, duration: pomodoroPeriods.shortbreak.duration, title: pomodoroPeriods.shortbreak.title, notification: pomodoroPeriods.shortbreak.notification, color: pomodoroPeriods.shortbreak.color, width: Math.round(shortbreakMinutes / totalMinutes * 100) + '%' },
          { startTime: 90 * 1000 * 60, duration: pomodoroPeriods.pomodoro.duration, title: pomodoroPeriods.pomodoro.title, notification: pomodoroPeriods.pomodoro.notification, color: pomodoroPeriods.pomodoro.color, width: Math.round(pomodoroMinutes / totalMinutes * 100) + '%' },
          { startTime: 115 * 1000 * 60, duration: pomodoroPeriods.longbreak.duration, title: pomodoroPeriods.longbreak.title, notification: pomodoroPeriods.longbreak.notification, color: pomodoroPeriods.longbreak.color, width: Math.round(longbreakMinutes / totalMinutes * 100) + '%' }
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
      let lastStartTimePeriod = null
      if(this.period) {
        lastStartTimePeriod = this.period.startTime
      }
      let now = new Date();
      let duration = now.getTime() - this.startDate.getTime();
      if(this.duration >= totalMinutes * 1000 * 60) {
        this.updateStartDate();
        this.updateTimer()
        this.$emit('end', this);
        return;
      }
      for(let period of this.periods) {
        period.progress = Math.round((duration - period.startTime) / period.duration * 100)
        if(duration >= period.startTime && duration < period.startTime + period.duration) {
          this.period = period
        }
      }
      if(!this.period) {
        return;
      }
      this.duration = duration;
      let periodeEnd = new Date(this.startDate.getTime() + this.period.startTime + this.period.duration)
      let periodeDuration = periodeEnd.getTime() - now.getTime();
      this.minuteRest = Math.floor(Math.round(periodeDuration / 1000) / 60).toString().padStart(2, "0")
      this.secondRest = (Math.round(periodeDuration / 1000) % 60).toString().padStart(2, "0")
      this.title = this.period.title
      this.color = this.period.color

      if(lastStartTimePeriod && lastStartTimePeriod != this.period.startTime) {
        this.changePeriod(this.period)
      }
    },
    changePeriod(newPeriod) {
      if(!this.active || !this.activeNotifications) {
        return;
      }
      new Notification(this.icon + ' ' + newPeriod.title, {
        body: newPeriod.notification
      });
    },
    setActive() {
      if(this.active) {
        return;
      }
      this.active = true
      this.$emit('changeActive', this);
    },
    toggleViewAll() {
      this.$emit('toggleViewAll');
    },
    async activeNotifications() {
      await Notification.requestPermission();
      this.hasNotification = Notification.permission === "granted"
    }
  },
  watch: {
  },
  template: '#pomodoro-template'
}
