const createAnimations = function (canvasElement) {
  const ctx = canvasElement.getContext("2d");
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  var animations = [];

  const schedule = (instrument, note, time, duration) => {
    animations.push({ state: "scheduled", instrument, note, time, duration });
    console.log(animations);
  };

  const loop = () => {
    requestAnimationFrame(loop);

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fill();

    // ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    // ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
    // ctx.save();

    // const time = Tone.now();
  };

  return {
    schedule,
    loop,
  };
};

/*
const animationLoop = () => {


  animations.forEach((anim) => {
    if (anim.state == "scheduled") {
      anim.state = "running";
    }

    const perc = Math.min((time - anim.time) / anim.duration, 1);

    ctx.beginPath();
    ctx.arc(150, 150, 101 - 100 * perc, 0, Math.PI * 2, false);
    ctx.fill();

    if (anim.time + anim.duration < time) {
      anim.state = "finished";
    }

    console.log(perc, anim);
  });

  animations = animations.filter((anim) => anim.state != "finished");
};
*/

export default createAnimations;
