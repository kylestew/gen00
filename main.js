import * as Tone from "tone";
import {
  createPitchShiftedSampler,
  toss,
  minor7th,
} from "@generative-music/utilities";

const activate = async () => {
  const sampler = await createPitchShiftedSampler({
    samplesByNote: {
      B3: "./assets/samples/sso-cor-anglais/b3.wav",
      B4: "./assets/samples/sso-cor-anglais/b4.wav",
      D4: "./assets/samples/sso-cor-anglais/d4.wav",
      D5: "./assets/samples/sso-cor-anglais/d5.wav",
      F3: "./assets/samples/sso-cor-anglais/f3.wav",
      F4: "./assets/samples/sso-cor-anglais/f4.wav",
      F5: "./assets/samples/sso-cor-anglais/f5.wav",
      "G#3": "./assets/samples/sso-cor-anglais/gsharp3.wav",
      "G#4": "./assets/samples/sso-cor-anglais/gsharp4.wav",
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
