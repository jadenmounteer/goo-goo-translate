import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  public voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadVoices().then((voices) => {
      console.log(voices);
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

  async speak(text: string) {
    await this.loadVoices(); // Ensure voices are loaded
    const voiceName = localStorage.getItem('selectedVoice');
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = this.voices.find((voice) => voice.name === voiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}
