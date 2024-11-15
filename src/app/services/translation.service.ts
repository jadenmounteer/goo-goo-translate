import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Translation {
  phrase: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public translationsLoading: boolean = true;

  public listOfTranslations: Translation[] = [];

  public translation: Translation = {} as Translation;

  async ngOnInit() {
    this.listOfTranslations = await this.fetchAllTranslations();
    this.chooseRandomTranslation();
    this.translationsLoading = false;
  }

  public chooseRandomTranslation(): void {
    const randomIndex = Math.floor(
      Math.random() * this.listOfTranslations.length
    );
    this.translation = this.listOfTranslations[randomIndex];
  }

  private async fetchAllTranslations(): Promise<Translation[]> {
    const response = await fetch('assets/translations.json');
    const translations: Translation[] = await response.json();
    return translations;
  }
}
