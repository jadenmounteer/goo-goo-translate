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
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { SpeechService } from '../../services/speech.service';

@Component({
  selector: 'app-translation-page',
  standalone: true,
  imports: [],
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
    const msg = new SpeechSynthesisUtterance();
    msg.text = translation.phrase;
    window.speechSynthesis.speak(msg);
  }

  ngOnDestroy() {
    this.translationSub?.unsubscribe();
  }

  private getInitialTranslation(translations: Translation[]): Translation {
    return this.translationService.chooseRandomTranslation(translations);
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
