import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  public voices: SpeechSynthesisVoice[] = [];
  public selectedVoice: string | undefined;
  public rate = 1;
  public pitch = 1;
  public volume = 1;

  constructor() {
    this.loadVoices().then((voices) => {
      const voiceFromLocalStorage = localStorage.getItem('selectedVoice');

      if (voiceFromLocalStorage) {
        this.selectedVoice = voiceFromLocalStorage;
      } else {
        this.selectedVoice = voices[0].name;
      }

      console.log(voices);
      // Filter voices by lang = eng-US
      voices = voices.filter((voice) => voice.lang === 'en-US');
      this.voices = voices;
    });
  }

  private loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    });
  }

  public selectVoice(voiceName: string) {
    localStorage.setItem('selectedVoice', voiceName);
    this.selectedVoice = voiceName;
  }

  async speak(text: string, voiceName?: string) {
    await this.loadVoices(); // Ensure voices are loaded

    const voiceNameToUse = voiceName || this.selectedVoice;
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceFound = this.voices.find(
      (voice) => voice.name === voiceNameToUse
    );
    if (voiceFound) {
      utterance.voice = voiceFound;
      console.log(utterance);
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;
    }
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    window.speechSynthesis.cancel();
  }
}
