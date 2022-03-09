import * as Tone from "tone";

export default class Visuals {
  constructor(canvasElement) {
    const ctx = canvasElement.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    this.ctx = ctx;
    this.events = [];
  }

  scheduleEvent(instrument, note, time, duration) {
    this.events.push({
      state: "scheduled",
      instrument,
      note,
      time,
      duration: duration + 1.0,
    });
    console.log(this.events);
  }

  loop() {
    requestAnimationFrame(() => {
      this.loop();
    });

    const ctx = this.ctx;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // clear background
    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fill();

    const time = Tone.now();

    this.events.forEach((event) => {
      if (event.state == "scheduled") {
        event.state = "running";
      }

      const perc = Math.min((time - event.time) / event.duration, 1);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
      ctx.lineWidth = 12;
      // ctx.save();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 201 - 200 * perc, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();

      if (event.time + event.duration < time) {
        event.state = "finished";
      }
    });

    this.events = this.events.filter((event) => event.state != "finished");
  }
}
