import * as Tone from "tone";
import { Player } from "tone";

import pad01url from "./assets/snips/1-Synth_Pad_1_Cooked_1.wav";
import pad02url from "./assets/snips/1-Synth_Pad_1_Cooked_2.wav";
import pad03url from "./assets/snips/1-Synth_Pad_1_Cooked_3.wav";
import pad04url from "./assets/snips/1-Synth_Pad_1_Cooked_4.wav";

import drum01url from "./assets/snips/4-Castle_Kit_1.wav";
import drum02url from "./assets/snips/4-Castle_Kit_2.wav";
import drum03url from "./assets/snips/4-Castle_Kit_3.wav";
import drum04url from "./assets/snips/4-Castle_Kit_4.wav";

const pad01 = new Tone.Player(pad01url).toDestination();
const pad02 = new Tone.Player(pad02url).toDestination();
const pad03 = new Tone.Player(pad03url).toDestination();
const pad04 = new Tone.Player(pad04url).toDestination();
pad01.loop = true;
pad02.loop = true;
pad03.loop = true;
pad04.loop = true;
const pads = [pad01, pad02, pad03, pad04];

const drums01 = new Tone.Player(drum01url).toDestination();
const drums02 = new Tone.Player(drum02url).toDestination();
const drums03 = new Tone.Player(drum03url).toDestination();
const drums04 = new Tone.Player(drum04url).toDestination();
drums01.loop = true;
drums02.loop = true;
drums03.loop = true;
drums04.loop = true;
const drums = [drums01, drums02, drums03, drums04];

import bass01url from "./assets/snips/3-Bass_F_Fly_1.wav";
import bass02url from "./assets/snips/3-Bass_F_Fly_2.wav";
import bass03url from "./assets/snips/3-Bass_F_Fly_3.wav";
import bass04url from "./assets/snips/3-Bass_F_Fly_4.wav";

const bass01 = new Tone.Player(bass01url).toDestination();
const bass02 = new Tone.Player(bass02url).toDestination();
const bass03 = new Tone.Player(bass03url).toDestination();
const bass04 = new Tone.Player(bass04url).toDestination();
bass01.loop = true;
bass02.loop = true;
bass03.loop = true;
bass04.loop = true;
const bass = [bass01, bass02, bass03, bass04];

import lead01url from "./assets/snips/2-Synth_Lead_1.wav";
import lead02url from "./assets/snips/2-Synth_Lead_2.wav";
import lead03url from "./assets/snips/2-Synth_Lead_3.wav";
import lead04url from "./assets/snips/2-Synth_Lead_4.wav";

const lead01 = new Tone.Player(lead01url).toDestination();
const lead02 = new Tone.Player(lead02url).toDestination();
const lead03 = new Tone.Player(lead03url).toDestination();
const lead04 = new Tone.Player(lead04url).toDestination();
lead01.loop = true;
lead02.loop = true;
lead03.loop = true;
lead04.loop = true;
const lead = [lead01, lead02, lead03, lead04];

const takeABreak = (perc) => {
  return Math.random() < perc;
};

const stopAll = (players) => {
  players.forEach((player) => player.stop());
};

const randomInArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateLoops = () => {
  // DRUMS - 2 measure loops x 8 plays
  new Tone.Loop((time) => {
    stopAll(drums);

    if (!takeABreak(0.1)) {
      randomInArray(drums).start();
      console.log("drums", time, Tone.Transport.bpm.value);
    } else {
      console.log("drums paused");
    }
  }, "16m").start(0);

  // PADS - 4 measure loops x 2 plays
  new Tone.Loop((time) => {
    stopAll(bass);

    if (!takeABreak(0.2)) {
      randomInArray(bass).start();
      console.log("bass", time, Tone.Transport.bpm.value);
    } else {
      console.log("bass paused");
    }
  }, "8m").start("4m");

  // PADS - 2 measure loops x 2 plays - comes in late
  new Tone.Loop((time) => {
    stopAll(pads);

    if (!takeABreak(0.3)) {
      randomInArray(pads).start();
      console.log("pads", time, Tone.Transport.bpm.value);
    } else {
      console.log("pads paused");
    }
  }, "4m").start("8m");

  // LEAD - 2 measure loops x 2 plays - comes in REAL late
  new Tone.Loop((time) => {
    stopAll(lead);

    if (!takeABreak(0.4)) {
      randomInArray(lead).start();
      console.log("lead", time, Tone.Transport.bpm.value);
    } else {
      console.log("lead paused");
    }
  }, "4m").start("12m");
};

const startPlaying = () => {
  Tone.loaded().then(() => {
    generateLoops();

    Tone.Transport.bpm.value = 112;
    Tone.Transport.start();
  });
};

document.getElementById("play")?.addEventListener("click", async () => {
  await Tone.start();
  startPlaying();
});

document.getElementById("stop")?.addEventListener("click", async () => {
  Tone.Transport.stop();
});
