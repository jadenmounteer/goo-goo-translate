import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Translation {
  phrase: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public translationText = '';
  constructor() {}
  private async fetchAllTranslations(): Promise<Observable<Translation[]>> {
    const response = await fetch('assets/trnslations.json');
    const translations: Translation[] = await response.json();
    return of(translations);
  }
}
