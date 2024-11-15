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
  private translations: Signal<Translation[] | undefined> = toSignal(
    this.translationService.translations$
  );

  protected translation: Signal<Translation | undefined> = computed(() => {
    const translations = this.translations();
    if (translations) {
      const translation =
        this.translationService.chooseRandomTranslation(translations);
      const msg = new SpeechSynthesisUtterance();
      msg.text = translation.phrase;
      window.speechSynthesis.speak(msg);
      return;
    }
    return undefined;
  });

  ngAfterViewInit() {
    this.recordedVideoElement = this.recordedVideoElementRef?.nativeElement;

    if (this.recordedVideoElement) {
      this.recordedVideoElement.src = this.videoService.downloadUrl;
    }
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
