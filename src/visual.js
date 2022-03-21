import * as Tone from "tone";

import seq0_00 from "../assets/brains/MRI scans_0000s_0000s_0004_Layer 55.jpg";
import seq0_01 from "../assets/brains/MRI scans_0000s_0000s_0003_Layer 56.jpg";
import seq0_02 from "../assets/brains/MRI scans_0000s_0000s_0002_Layer 57.jpg";
import seq0_03 from "../assets/brains/MRI scans_0000s_0000s_0001_Layer 58.jpg";
import seq0_04 from "../assets/brains/MRI scans_0000s_0000s_0000_Layer 59.jpg";
import { lerp, clamp } from "../snod/math";

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
    this.sequences = [
      [
        await loadImage(seq0_00),
        await loadImage(seq0_01),
        await loadImage(seq0_02),
        await loadImage(seq0_03),
        await loadImage(seq0_04),
      ],
    ];
  }

  loop() {
    requestAnimationFrame(() => {
      this.loop();
    });

    const ctx = this.ctx;
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "lighter";

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const drawWidth = 272;
    const drawHeight = 314;

    // clear background
    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fill();

    const time = Tone.now();

    this.events.forEach((event) => {
      if (event.state == "scheduled") {
        event.state = "running";

        // give a random position in canvas
        const w = parseInt(Math.random() * (width - drawWidth));
        const h = parseInt(Math.random() * (height - drawHeight));
        event.pos = [w, h];
      }

      const perc = Math.min((time - event.time) / event.duration, 1);

      const len = this.seq0.length;
      const idx = parseInt(lerp(0, len + 1, perc));
      const alpha = (perc * (len + 1)) % 1;

      // move positions randomly
      // turn back on all notes
      // add more sqeuences

      const [w, h] = event.pos;

      if (idx - 1 >= 0 && idx - 1 < len) {
        // fade out previous
        ctx.globalAlpha = 1.0 - alpha;
        ctx.drawImage(this.seq0[idx - 1], w, h, drawWidth, drawHeight);
      }
      if (idx < len) {
        // fade in new
        ctx.globalAlpha = alpha;
        ctx.drawImage(this.seq0[idx], w, h, drawWidth, drawHeight);
      }

      if (event.time + event.duration < time) {
        event.state = "finished";
      }
    });

    this.events = this.events.filter((event) => event.state != "finished");
  }
}
