import "./style.css";

import Music from "./src/music";
const music = new Music();

// import createAnimations from "./src/visual";
// const canvasElement = document.getElementById("canvas");
// const animations = createAnimations(canvasElement);

const playButton = document.getElementById("play");
playButton?.addEventListener("click", async () => {
  playButton.value = "LOADING...";

  music.load();
  music.play();

  setInterval(() => {
    playButton?.remove();
  }, 500);
});
