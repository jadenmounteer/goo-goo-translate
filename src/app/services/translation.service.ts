import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';

interface Translation {
  phrase: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public translationsLoading: boolean = true;
  private listOfTranslations: Observable<Translation[]>;

  constructor() {
    this.listOfTranslations = from(this.fetchAllTranslations());
  }

  // public chooseRandomTranslation(): void {
  //   const randomIndex = Math.floor(
  //     Math.random() * this.listOfTranslations.length
  //   );
  //   this.translation = of(this.listOfTranslations[randomIndex]);
  // }

  private async fetchAllTranslations(): Promise<Translation[]> {
    const response = await fetch('assets/translations.json');
    const translations: Promise<Translation[]> = response.json();
    return translations;
  }
}
