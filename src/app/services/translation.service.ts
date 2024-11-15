import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  phrase: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translationsSubject = new BehaviorSubject<Translation[]>([]);
  translations$ = this.translationsSubject.asObservable();

  constructor() {
    this.fetchAllTranslations();
  }

  private async fetchAllTranslations(): Promise<void> {
    const response = await fetch('assets/translations.json');
    const translations: Translation[] = await response.json();
    this.translationsSubject.next(translations);
  }

  public chooseRandomTranslation(Translations: Translation[]): Translation {
    const randomIndex = Math.floor(Math.random() * Translations.length);
    return Translations[randomIndex];
  }
}
