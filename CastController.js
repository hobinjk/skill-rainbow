const MAX_QUEUE_LENGTH = 3;
const QUEUE_AGE = 600;

export default class CastController {
  constructor() {
    this.queue = [];
    this.currentCast = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.update = this.update.bind(this);

    this.castDiv = document.getElementById('sh-cast');
    this.queueDiv = document.getElementById('sh-queue');

    document.body.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(event) {
    this.filterQueue();
    while (this.queue.length >= MAX_QUEUE_LENGTH) {
      this.queue.pop();
    }
    this.queue.push({
      key: event.key,
      time: Date.now(),
    });
  }

  filterQueue() {
    this.queue = this.queue.filter((q) => {
      return q.time + QUEUE_AGE > Date.now();
    });
  }

  update() {
    if (!this.currentCast || this.currentCast.end <= Date.now()) {
      this.currentCast = null;
      this.cast();
    }
    this.draw();
    window.requestAnimationFrame(this.update);
  }

  draw() {
    if (!this.currentCast) {
      this.castDiv.textContent = 'idle';
    } else {
      let timeLeft = ((this.currentCast.end - Date.now()) / 1000).toFixed(2);
      this.castDiv.textContent = `${this.currentCast.key} ${timeLeft}s`;
    }
    this.queueDiv.textContent = JSON.stringify(this.queue.map((q) => q.key));
  }
  cast() {
    if (this.queue.length === 0) {
      return;
    }
    let q = this.queue.shift();
    let dur = 400;
    if (SkillData[q.key]) {
      dur = SkillData[q.key].duration;
    }
    this.currentCast = {
      key: q.key,
      end: Date.now() + dur,
    };
  }
}

