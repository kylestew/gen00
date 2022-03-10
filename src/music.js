import * as Tone from "tone";

import { createBuffers } from "@generative-music/utilities";
import { createPrerenderableSampler } from "@generative-music/utilities";
import { toss } from "@generative-music/utilities";
import { sampleNote } from "@generative-music/utilities";

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

const renderedPitchClasses = ["C", "E", "G"];
const renderedReversePianoNotes = toss(renderedPitchClasses, [3, 4]);

export default class Music {
  constructor(scheduleEvent) {
    this.scheduleEvent = scheduleEvent;
  }

  async _prepareSamples() {
    const samples = {
      "vsco2-trumpet-sus-f": {
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
    };

    // stubbed out for @generative-music/utilities
    const sampleLibrary = {
      save: () => {},
    };

    this.reversePianoBuffers = await createPrerenderableSampler({
      samples,
      sampleLibrary,
      sourceInstrumentName: "vsco2-trumpet-sus-f",
      renderedInstrumentName: "stream-of-consciousness__vsco2-piano-mf-reverse",
      notes: renderedReversePianoNotes,
      reverse: true,
      getDestination: () =>
        new Tone.Reverb(30).set({ wet: 0.75 }).toDestination().generate(),
    });
  }

  _playReversePiano(note, time, duration, dest) {
    const { sampledNote, playbackRate } = sampleNote({
      sampledNotes: renderedReversePianoNotes,
      note,
    });

    // console.log(this.ersePianoBuffers.get);
    // const buffer = this.reversePianoBuffers.get(0);
    // console.log(buffer);
    // const source = new Tone.ToneBufferSource(buffer).set({
    //   playbackRate,
    //   ondended: () => {
    //     console.log("remove source");
    //   },
    // });
    // source.connect(dest);

    // source.start(time, 0);

    this.reversePianoBuffers.connect(dest);
    this.reversePianoBuffers.triggerAttackRelease(["C4"], 4);
  }

  // _musicPhrase() {
  //   const trumpetOct = Math.floor(Math.random() * 2) + 2;
  //   const tromboneOct = 1;
  //   // vary note length on a phrase basis
  //   const trumpetMultiplier = Math.random() * 8 + 4;
  //   const tromboneMultiplier = Math.random() * 8 + 4;
  //   const tromboneDelay = Math.random() * 15 + 15;
  //   const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  //   // randomly cut down the phrase, but tend towards using most of it
  //   const sliceLength = Math.floor(
  //     Math.pow(Math.random(), 0.1) * phrase.length
  //   );

  //   phrase.slice(0, sliceLength).forEach((pc, i) => {
  //     const trumpetScheduleFor = `+${i * trumpetMultiplier}`;
  //     Tone.Transport.scheduleOnce((time) => {
  //       let duration = Math.min(
  //         trumpetMultiplier * Math.pow(Math.random(), 0.5),
  //         6.333
  //       );
  //       this.trumpet.triggerAttackRelease(`${pc}${trumpetOct}`, duration);

  //       Tone.Draw.schedule(() => {
  //         this.scheduleEvent("trumpet", pc, time, duration);
  //       }, time);
  //     }, trumpetScheduleFor);

  //     const tromboneScheduledFor = `+${i * tromboneMultiplier + tromboneDelay}`;
  //     Tone.Transport.scheduleOnce((time) => {
  //       let duration = Math.min(
  //         tromboneMultiplier * Math.pow(Math.random(), 0.5),
  //         8
  //       );
  //       this.trombone.triggerAttackRelease(`${pc}${trumpetOct}`, duration);

  //       Tone.Draw.schedule(() => {
  //         this.scheduleEvent("trombone", pc, time, duration);
  //       }, time);
  //     }, tromboneScheduledFor);
  //   });

  //   const scheduledFor = `+${
  //     sliceLength * trumpetMultiplier + 1 + Math.random() * 12
  //   }`;
  //   console.log("next phrase scheduled for:", scheduledFor);
  //   Tone.Transport.scheduleOnce((time) => {
  //     console.log("next phrase starting:", time);
  //     this._musicPhrase();
  //   }, scheduledFor);
  // }

  _schedule(destination) {
    const pianoAutoFilter = new Tone.AutoFilter(
      Math.random() / 500 + 0.005,
      150,
      6
    ).connect(destination);
    pianoAutoFilter.start();

    this._playReversePiano("C4", "0", "4", pianoAutoFilter);

    Tone.Transport.start();

    // const delay = new Tone.FeedbackDelay(0.2, 0.6).connect(destination);
    // const gain = new Tone.Gain(0.6).toDestination(delay);

    // const trumpetFilter = new Tone.AutoFilter(
    //   Math.random() / 100 + 0.01
    // ).connect(gain);
    // trumpetFilter.start();
    // const trumpetReverb = new Tone.Reverb(45);
    // trumpetReverb.connect(trumpetFilter);
    // this.trumpet.connect(trumpetReverb);

    // const tromboneGain = new Tone.Gain(2.0).toDestination(delay);
    // const tromboneFilter = new Tone.AutoFilter(
    //   Math.random() / 80 + 0.01
    // ).connect(tromboneGain);
    // tromboneFilter.start();
    // const tromboneReverb = new Tone.Reverb(45);
    // tromboneReverb.connect(tromboneFilter);
    // this.trombone.connect(tromboneReverb);

    // const tubaReverb = new Tone.Reverb(45);
    // const tubaFilter = new Tone.AutoFilter(Math.random() / 100 + 0.01).connect(
    //   gain
    // );
    // tubaFilter.start();
    // this.tuba.connect(tubaReverb);
    // tubaReverb.connect(tubaFilter);
  }

  async load() {
    await Tone.start();
    await this._prepareSamples();
    await Tone.loaded();
  }

  play() {
    this._schedule(Tone.Destination);
  }

  stop() {
    // TODO: how to unwire music
  }
}
