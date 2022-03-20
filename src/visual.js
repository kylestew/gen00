import * as Tone from "tone";

import seq0_00 from "../assets/brains/MRI scans_0000s_0000s_0004_Layer 55.jpg";
import seq0_01 from "../assets/brains/MRI scans_0000s_0000s_0003_Layer 56.jpg";
import seq0_02 from "../assets/brains/MRI scans_0000s_0000s_0002_Layer 57.jpg";
import seq0_03 from "../assets/brains/MRI scans_0000s_0000s_0001_Layer 58.jpg";
import seq0_04 from "../assets/brains/MRI scans_0000s_0000s_0000_Layer 59.jpg";

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = url;
  });

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
  }

  async load() {
    this.seq0 = [
      await loadImage(seq0_00),
      await loadImage(seq0_01),
      await loadImage(seq0_02),
      await loadImage(seq0_03),
      await loadImage(seq0_04),
    ];
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

    // TODO - fade/interpolate between images
    // blend modes? color hue shifts?

    this.events.forEach((event) => {
      if (event.state == "scheduled") {
        event.state = "running";
      }

      const perc = Math.min((time - event.time) / event.duration, 1);

      console.log(perc);

      ctx.drawImage(this.seq0[0], 0, 0, 272, 314);

      //   ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      //   ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
      //   ctx.lineWidth = 12;
      //   // ctx.save();

      //   ctx.beginPath();
      //   ctx.arc(width / 2, height / 2, 201 - 200 * perc, 0, Math.PI * 2, false);
      //   ctx.fill();
      //   ctx.stroke();

      if (event.time + event.duration < time) {
        event.state = "finished";
      }
    });

    this.events = this.events.filter((event) => event.state != "finished");
  }
}
