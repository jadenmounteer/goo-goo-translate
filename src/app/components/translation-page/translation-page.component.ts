import {
  Component,
  computed,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/video-service';
import { TranslationService } from '../../services/translation.service';

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
  protected translationService: TranslationService = inject(TranslationService);

  ngAfterViewInit() {
    console.log('TranslationPageComponent ngAfterViewInit');
    this.recordedVideoElement = this.recordedVideoElementRef?.nativeElement;

    if (this.recordedVideoElement) {
      this.recordedVideoElement.src = this.videoService.downloadUrl;
    }
  }

  playRecording() {
    if (
      !this.videoService.recordedBlobs ||
      !this.videoService.recordedBlobs.length
    ) {
      alert('cannot play.');
      return;
    }
    this.recordedVideoElement?.play();
  }
}
