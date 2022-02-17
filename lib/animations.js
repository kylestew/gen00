import * as Tone from "tone";

const createAnimations = function (canvasElement) {
  const ctx = canvasElement.getContext("2d");
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  var animations = [];

  const schedule = (instrument, note, time, duration) => {
    animations.push({
      state: "scheduled",
      instrument,
      note,
      time,
      duration: duration + 1.0,
    });
    console.log(animations);
  };

  const loop = () => {
    requestAnimationFrame(loop);

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // clear background
    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fill();

    const time = Tone.now();

    animations.forEach((anim) => {
      if (anim.state == "scheduled") {
        anim.state = "running";
      }

      const perc = Math.min((time - anim.time) / anim.duration, 1);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
      ctx.lineWidth = 12;
      // ctx.save();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 201 - 200 * perc, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();

      if (anim.time + anim.duration < time) {
        anim.state = "finished";
      }

      console.log(perc, anim);
    });

    animations = animations.filter((anim) => anim.state != "finished");
  };

  return {
    schedule,
    loop,
  };
};

export default createAnimations;
