import {
  Component,
  computed,
  ElementRef,
  inject,
  Signal,
  ViewChild,
} from '@angular/core';
import { VideoService } from '../../services/video-service';
import {
  Translation,
  TranslationService,
} from '../../services/translation.service';

import { Subscription } from 'rxjs';
import { SpeechService } from '../../services/speech.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-translation-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './translation-page.component.html',
  styleUrl: './translation-page.component.scss',
})
export class TranslationPageComponent {
  @ViewChild('recordedVideo') recordedVideoElementRef: ElementRef | undefined;
  private videoService: VideoService = inject(VideoService);
  public recordedVideoElement: HTMLVideoElement | undefined;
  private translationService: TranslationService = inject(TranslationService);
  private speechService: SpeechService = inject(SpeechService);

  protected translation: Translation | undefined;
  private translationSub: Subscription | undefined;
  protected isEditing: boolean = false;

  constructor() {
    this.translationSub = this.translationService.translations$.subscribe(
      (translations) => {
        this.translation = this.getInitialTranslation(translations);
        if (this.translation) {
          this.sayTranslation(this.translation);
        }
      }
    );
  }

  ngAfterViewInit() {
    this.recordedVideoElement = this.recordedVideoElementRef?.nativeElement;

    if (this.recordedVideoElement) {
      this.recordedVideoElement.src = this.videoService.downloadUrl;
    }
  }

  protected sayTranslation(translation: Translation) {
    this.speechService.speak(translation.phrase);
  }

  ngOnDestroy() {
    this.translationSub?.unsubscribe();
    this.speechService.stopSpeaking();
  }

  private getInitialTranslation(translations: Translation[]): Translation {
    return this.translationService.chooseRandomTranslation(translations);
  }

  protected editPhrase() {
    this.isEditing = true;
  }
  // We can use this if we don't want it to autoplay
  // protected playRecording() {
  //   if (
  //     !this.videoService.recordedBlobs ||
  //     !this.videoService.recordedBlobs.length
  //   ) {
  //     alert('cannot play.');
  //     return;
  //   }
  //   this.recordedVideoElement?.play();
  // }
}
