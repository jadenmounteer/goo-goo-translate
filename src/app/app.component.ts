import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LogoComponent } from './logo/logo/logo.component';
import { SpeechService } from './services/speech.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingPageComponent, LogoComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'goo-goo-translate';

  protected showingDropdown = false;
  protected speechService: SpeechService = inject(SpeechService);

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  private onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown'); // Adjust the selector as necessary
    const cogIcon = document.querySelector('.cog-icon');

    if (
      dropdown &&
      !dropdown.contains(target) &&
      cogIcon &&
      !cogIcon.contains(target)
    ) {
      this.showingDropdown = false;
    }
  }

  protected toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showingDropdown = !this.showingDropdown;
  }

  protected async chooseVoice(voiceName: string): Promise<void> {
    this.speechService.selectVoice(voiceName);

    this.showingDropdown = false;
  }

  protected async testVoice(voiceName: string): Promise<void> {
    await this.speechService.speak('Hello, world!', voiceName);
  }
}
