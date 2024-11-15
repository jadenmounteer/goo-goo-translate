import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  public canChangeVoice = false;
  public voices: SpeechSynthesisVoice[] | undefined;

  constructor() {
    this.canChangeVoice = this.checkIfCanChangeVoice();
    if (this.canChangeVoice) {
      this.voices = window.speechSynthesis.getVoices();
      console.log(this.voices);
    }
  }

  private checkIfCanChangeVoice(): boolean {
    // Android doesn't support this. https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis
    if (
      /Android/i.test(
        navigator.userAgent ||
          (typeof window.speechSynthesis.onvoiceschanged == 'undefined'
            ? ''
            : 'undefined')
      )
    ) {
      return false;
    }

    return true;
  }
}
