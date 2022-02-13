import * as Tone from "tone";
import {
  createPitchShiftedSampler,
  toss,
  minor7th,
} from "@generative-music/utilities";

import b3 from "./assets/samples/sso-cor-anglais/b3.wav";
import b4 from "./assets/samples/sso-cor-anglais/b4.wav";
import d4 from "./assets/samples/sso-cor-anglais/d4.wav";
import d5 from "./assets/samples/sso-cor-anglais/d5.wav";
import f3 from "./assets/samples/sso-cor-anglais/f3.wav";
import f4 from "./assets/samples/sso-cor-anglais/f4.wav";
import f5 from "./assets/samples/sso-cor-anglais/f5.wav";
import gsharp3 from "./assets/samples/sso-cor-anglais/gsharp3.wav";
import gsharp4 from "./assets/samples/sso-cor-anglais/gsharp4.wav";

const activate = async () => {
  const sampler = await createPitchShiftedSampler({
    samplesByNote: {
      B3: b3,
      B4: b4,
      D4: d4,
      D5: d5,
      F3: f3,
      F4: f4,
      F5: f5,
      "G#3": gsharp3,
      "G#4": gsharp4,
    },
    pitchShift: -24,
    attack: 5,
    release: 5,
    curve: "linear",
    baseUrl: "./assets/samples/sso-cor-anglais/",
  });

  const delayVolume = new Tone.Volume(-28);
  const compressor = new Tone.Compressor();

  const notes = toss(["A#"], [3, 4]).map(minor7th).flat();

  const playChord = (first = false) => {
    console.log("playing chord");

    // grab up to 4 notes
    let chord = notes.filter(() => Math.random() < 0.5).slice(0, 4);
    // make sure the initial chord isn't empty
    while (first && chord.length === 0) {
      chord = notes.filter(() => Math.random() < 0.5).slice(0, 4);
    }

    // select note that MUST play on new chord start
    const immediateNoteIndex = first
      ? Math.floor(Math.random() * chord.length)
      : -1;

    // play notes
    chord.forEach((note, i) => {
      // if not initial note, randomly space out start times
      const time = `+${immediateNoteIndex === i ? 0 : Math.random() * 2}`;
      sampler.triggerAttack(note, time);
    });

    // schedule next chord
    Tone.Transport.scheduleOnce(() => {
      playChord();
    }, `+${Math.random() * 5 + 12}`);
  };

  Tone.loaded().then(() => {
    let destination = Tone.Destination;
    const delay = new Tone.FeedbackDelay({
      feedback: 0.5,
      delayTime: 10,
      maxDelay: 10,
    }).connect(delayVolume);
    sampler.connect(compressor);
    compressor.connect(delay);
    compressor.connect(destination);
    delayVolume.connect(destination);

    playChord(true);
    Tone.Transport.start();
  });
};

document.getElementById("play")?.addEventListener("click", async () => {
  await Tone.start();
  activate();
});

document.getElementById("stop")?.addEventListener("click", async () => {
  Tone.Transport.stop();
});
