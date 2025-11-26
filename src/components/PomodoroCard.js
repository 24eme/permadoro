const dateHistoric = new Date(1980, 10, 24, 0, 0, 0);
const pomodoroMinutes = 25;
const shortbreakMinutes = 5;
const longbreakMinutes = 15;
const totalMinutes = 130;
const pomodoroPeriods = {
  pomodoro: { title: "Pomodoro", icon: "🍅", notification: "On ce concentre sur sa tâche pendant 25 minutes, aucune distraction !", duration: pomodoroMinutes * 1000 * 60, color: '#dc3545'},
  shortbreak: { title: "Pause Courte", icon: "☕", notification: "On lève les mains du clavier, courte pause de 5 minutes !", duration: shortbreakMinutes * 1000 * 60, color: '#ffc107'},
  longbreak: { title: "Pause longue", icon: "🏖️", notification: "Loooooonnnngue pause, 15 minutes pour chiller !", duration: longbreakMinutes * 1000 * 60, color: '#ffc107'}
}
const chronologie = ['pomodoro', 'shortbreak', 'pomodoro', 'shortbreak', 'pomodoro', 'shortbreak', 'pomodoro', 'longbreak'];

export default {
  name: "PomodoroCard",
  props: ["index", "icon", "isactive", "partof", "hasSound"],
  data() {

    const data = {
        title: pomodoroPeriods.pomodoro.title, notification: pomodoroPeriods.pomodoro.notification,
        active: false,
        minuteRest: null,
        secondRest: null,
        startDateHistoric: null,
        timer: null,
        startDate: new Date(),
        hasNotification: Notification.permission === "granted" && parseInt(localStorage.getItem('notification')),
        duration: 0,
        color: pomodoroPeriods.pomodoro.color,
        periods: [
        ]
    }

    let currentTime = 0;
    for(let p of chronologie) {
      const confPeriod = pomodoroPeriods[p];
      data.periods.push({
        startTime: currentTime, duration: confPeriod.duration, icon: confPeriod.icon, title: confPeriod.title, notification: confPeriod.notification, color: confPeriod.color, width: Math.round(confPeriod.duration / 1000 / 60 / totalMinutes * 100) + '%'
      })
      currentTime += confPeriod.duration;
    }

    return data;
  },
  setup(index, icon, isactive, partof, hasSound) {
  },
  created() {
    this.active = this.isactive
    this.startDateHistoric = new Date(dateHistoric.getTime() - (this.index * (Math.floor(totalMinutes/this.partof) * 1000 * 60)));
    this.updateStartDate()
    this.updateTimer()
    this.timer = setInterval(this.updateTimer, 1000)
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
      if(duration > (totalMinutes * 1000 * 60)) {
        this.resetCycle();
        return;
      }

      let found = false;
      for(let period of this.periods) {
        period.progress = Math.round((duration - period.startTime) / period.duration * 100)
        if(duration >= period.startTime && duration < period.startTime + period.duration) {
          this.period = period
          found = true;
        }
      }

      if(!found) {
        return;
      }

      this.duration = duration;
      let periodeEnd = new Date(this.startDate.getTime() + this.period.startTime + this.period.duration)
      let periodeDuration = periodeEnd.getTime() - now.getTime();
      this.minuteRest = Math.floor(Math.round(periodeDuration / 1000) / 60).toString().padStart(2, "0")
      this.secondRest = (Math.round(periodeDuration / 1000) % 60).toString().padStart(2, "0")
      this.title = this.period.icon + ' ' +this.period.title
      this.color = this.period.color

      if(this.active) {
        FavIconX.config({
          borderColor: this.period.color,
          fillColor: this.period.color,
        })
        FavIconX.setValue(parseInt(this.period.progress));
        document.title = this.period.icon + ' ' + this.minuteRest + ':' + this.secondRest + ' - ' + this.period.title + ' - ' + this.icon;
      }

      if(lastStartTimePeriod && lastStartTimePeriod != this.period.startTime) {
        this.changePeriod(this.period)
      }
    },
    changePeriod(newPeriod) {
      if(!this.active) {
        return;
      }
      this.$emit('changePeriod', this, newPeriod);
    },
    resetCycle() {
      this.updateStartDate();
      this.updateTimer()
      this.$emit('end', this);
    },
    deactivate() {
      this.active = false;
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
    toggleSound() {
      this.$emit('toggleSound');
    },
    copyLink(element) {
      navigator.clipboard.writeText(document.location.href);
      const btn = element.closest('button');
      const tooltip = bootstrap.Tooltip.getOrCreateInstance(btn)

      setTimeout(function() { tooltip.show(); }, 200)
      setTimeout(function() { tooltip.hide(); }, 1500)
    },
    async toggleNotifications() {
      if(!this.hasNotification) {
        await Notification.requestPermission();
        this.hasNotification = Notification.permission === "granted"
      } else {
        this.hasNotification = false
      }
      localStorage.setItem('notification', this.hasNotification*1)
    }
  },
  watch: {
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  template: '#pomodoro-template'
}
