import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  public canChangeVoice = false;

  constructor() {
    this.canChangeVoice = this.checkIfCanChangeVoice();
  }

  private checkIfCanChangeVoice(): boolean {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent ||
          (typeof window.speechSynthesis.onvoiceschanged == 'undefined'
            ? ''
            : 'undefined')
      )
    ) {
      alert("Can't change voice!");
      return false;
    }
    alert('Can change voice!');
    return true;
  }
}
