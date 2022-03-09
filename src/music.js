import * as Tone from "tone";

import trumpet_a2 from "../assets/samples/vsco2-trumpet-sus-f/a2.wav";
import trumpet_a4 from "../assets/samples/vsco2-trumpet-sus-f/a4.wav";
import trumpet_asharp3 from "../assets/samples/vsco2-trumpet-sus-f/asharp3.wav";
import trumpet_c3 from "../assets/samples/vsco2-trumpet-sus-f/c3.wav";
import trumpet_c5 from "../assets/samples/vsco2-trumpet-sus-f/c5.wav";
import trumpet_d4 from "../assets/samples/vsco2-trumpet-sus-f/d4.wav";
import trumpet_dsharp3 from "../assets/samples/vsco2-trumpet-sus-f/dsharp3.wav";
import trumpet_f2 from "../assets/samples/vsco2-trumpet-sus-f/f2.wav";
import trumpet_f4 from "../assets/samples/vsco2-trumpet-sus-f/f4.wav";
import trumpet_g3 from "../assets/samples/vsco2-trumpet-sus-f/g3.wav";

import trombone_asharp0 from "../assets/samples/vsco2-trombone-sus-mf/asharp0.wav";
import trombone_asharp1 from "../assets/samples/vsco2-trombone-sus-mf/asharp1.wav";
import trombone_c3 from "../assets/samples/vsco2-trombone-sus-mf/c3.wav";
import trombone_csharp1 from "../assets/samples/vsco2-trombone-sus-mf/csharp1.wav";
import trombone_csharp3 from "../assets/samples/vsco2-trombone-sus-mf/csharp3.wav";
import trombone_d2 from "../assets/samples/vsco2-trombone-sus-mf/d2.wav";
import trombone_dsharp1 from "../assets/samples/vsco2-trombone-sus-mf/dsharp1.wav";
import trombone_dsharp3 from "../assets/samples/vsco2-trombone-sus-mf/dsharp3.wav";
import trombone_f1 from "../assets/samples/vsco2-trombone-sus-mf/f1.wav";
import trombone_f2 from "../assets/samples/vsco2-trombone-sus-mf/f2.wav";
import trombone_f3 from "../assets/samples/vsco2-trombone-sus-mf/f3.wav";

import tuba_asharp0 from "../assets/samples/vsco2-tuba-sus-mf/asharp0.wav";

const phrases = [
  ["A#", "F", "G#", "C#"],
  ["A#", "F", "D"],
  ["D", "D#", "F"],
  ["C", "D#", "D"],
  ["A#", "F", "G", "D"],
];

export default class Music {
  constructor(scheduleEvent) {
    this._prepSamples();
    this.scheduleEvent = scheduleEvent;
  }

  _prepSamples() {
    this.trumpet = new Tone.Sampler({
      urls: {
        A2: trumpet_a2,
        A4: trumpet_a4,
        "A#3": trumpet_asharp3,
        C3: trumpet_c3,
        C5: trumpet_c5,
        D3: trumpet_d4,
        "D#3": trumpet_dsharp3,
        F2: trumpet_f2,
        F4: trumpet_f4,
        G3: trumpet_g3,
      },
      release: 1,
    });

    this.trombone = new Tone.Sampler({
      urls: {
        "A#0": trombone_asharp0,
        "A#1": trombone_asharp1,
        C3: trombone_c3,
        "C#1": trombone_csharp1,
        "C#3": trombone_csharp3,
        D2: trombone_d2,
        "D#1": trombone_dsharp1,
        "D#3": trombone_dsharp3,
        F1: trombone_f1,
        F2: trombone_f2,
        F3: trombone_f3,
      },
      release: 1,
    });

    this.tuba = new Tone.Sampler({
      urls: {
        "A#0": tuba_asharp0,
      },
      release: 1,
    });
  }

  _droneTuba(note) {
    this.tuba.triggerAttack(note, "+1");
    Tone.Transport.scheduleOnce(() => {
      this._droneTuba(note);
    }, `+${Math.random() * 3 + 2}`);
  }

  _musicPhrase() {
    const trumpetOct = Math.floor(Math.random() * 2) + 2;
    const tromboneOct = 1;
    // vary note length on a phrase basis
    const trumpetMultiplier = Math.random() * 8 + 4;
    const tromboneMultiplier = Math.random() * 8 + 4;
    const tromboneDelay = Math.random() * 15 + 15;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    // randomly cut down the phrase, but tend towards using most of it
    const sliceLength = Math.floor(
      Math.pow(Math.random(), 0.1) * phrase.length
    );

    phrase.slice(0, sliceLength).forEach((pc, i) => {
      const trumpetScheduleFor = `+${i * trumpetMultiplier}`;
      Tone.Transport.scheduleOnce((time) => {
        let duration = Math.min(
          trumpetMultiplier * Math.pow(Math.random(), 0.5),
          6.333
        );
        this.trumpet.triggerAttackRelease(`${pc}${trumpetOct}`, duration);

        Tone.Draw.schedule(() => {
          this.scheduleEvent("trumpet", pc, time, duration);
        }, time);
      }, trumpetScheduleFor);

      const tromboneScheduledFor = `+${i * tromboneMultiplier + tromboneDelay}`;
      Tone.Transport.scheduleOnce((time) => {
        let duration = Math.min(
          tromboneMultiplier * Math.pow(Math.random(), 0.5),
          8
        );
        this.trombone.triggerAttackRelease(`${pc}${trumpetOct}`, duration);

        Tone.Draw.schedule(() => {
          this.scheduleEvent("trombone", pc, time, duration);
        }, time);
      }, tromboneScheduledFor);
    });

    const scheduledFor = `+${
      sliceLength * trumpetMultiplier + 1 + Math.random() * 12
    }`;
    console.log("next phrase scheduled for:", scheduledFor);
    Tone.Transport.scheduleOnce((time) => {
      console.log("next phrase starting:", time);
      this._musicPhrase();
    }, scheduledFor);
  }

  _schedule() {
    this._droneTuba("A#0");
    this._musicPhrase();

    Tone.Transport.start();
  }

  _activate() {
    let destination = Tone.Destination;
    const delay = new Tone.FeedbackDelay(0.2, 0.6).connect(destination);
    const gain = new Tone.Gain(0.6).toDestination(delay);

    const trumpetFilter = new Tone.AutoFilter(
      Math.random() / 100 + 0.01
    ).connect(gain);
    trumpetFilter.start();
    const trumpetReverb = new Tone.Reverb(45);
    trumpetReverb.connect(trumpetFilter);
    this.trumpet.connect(trumpetReverb);

    const tromboneGain = new Tone.Gain(2.0).toDestination(delay);
    const tromboneFilter = new Tone.AutoFilter(
      Math.random() / 80 + 0.01
    ).connect(tromboneGain);
    tromboneFilter.start();
    const tromboneReverb = new Tone.Reverb(45);
    tromboneReverb.connect(tromboneFilter);
    this.trombone.connect(tromboneReverb);

    const tubaReverb = new Tone.Reverb(45);
    const tubaFilter = new Tone.AutoFilter(Math.random() / 100 + 0.01).connect(
      gain
    );
    tubaFilter.start();
    this.tuba.connect(tubaReverb);
    tubaReverb.connect(tubaFilter);
  }

  async load() {
    Tone.start();
    Tone.loaded();
  }

  play() {
    this._activate();
    this._schedule();
  }

  stop() {
    // TODO: how to unwire music
  }
}
