import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { VideoService } from '../../services/video-service';
import { FormsModule } from '@angular/forms';
import { SpeechService } from '../../services/speech.service';
import {
  Translation,
  TranslationService,
} from '../../services/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translation-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './translation-page.component.html',
  styleUrl: './translation-page.component.scss',
})
export class TranslationPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('recordedVideo') recordedVideoElementRef: ElementRef | undefined;
  @ViewChild('canvas') canvasElementRef: ElementRef | undefined;
  public recordedVideoElement: HTMLVideoElement | undefined;

  private router: Router = inject(Router);

  protected translation: Translation | undefined;
  protected isEditing: boolean = false;
  private translationSub: Subscription | undefined;
  private mediaRecorder: MediaRecorder | undefined;
  private recordedBlobs: Blob[] = [];

  constructor(
    private videoService: VideoService,
    private translationService: TranslationService,
    private speechService: SpeechService
  ) {
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
      this.recordedVideoElement.onloadeddata = () => {
        this.drawCanvas();
      };
    }
  }

  protected sayTranslation(translation: Translation) {
    this.speechService.speak(translation.phrase);
  }

  protected drawCanvas(): void {
    if (!this.canvasElementRef || !this.recordedVideoElementRef) return;

    const canvas = this.canvasElementRef.nativeElement;
    const video = this.recordedVideoElementRef.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const draw = () => {
      if (video.paused || video.ended) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.font = '30px Arial';
      context.fillStyle = 'white';
      context.fillText(
        this.translation?.phrase || 'Translation Text Here',
        10,
        canvas.height - 30
      );

      requestAnimationFrame(draw);
    };

    draw();
  }

  async downloadVideo() {
    const canvas = this.canvasElementRef?.nativeElement;
    const stream = canvas.captureStream();
    const videoStream = (this.recordedVideoElement as any)?.captureStream();
    // const audioTracks = videoStream?.getAudioTracks();

    // if (audioTracks && audioTracks.length > 0) {
    //   stream.addTrack(audioTracks[0]);
    // }

    this.recordedBlobs = [];
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    this.mediaRecorder.ondataavailable = (event: any) => {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'baby-translation.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    this.mediaRecorder.start();
    setTimeout(
      () => {
        this.mediaRecorder?.stop();
      },
      this.recordedVideoElement ? this.recordedVideoElement.duration * 1000 : 0
    );
  }

  ngOnDestroy() {
    this.translationSub?.unsubscribe();
  }

  private getInitialTranslation(
    translations: Translation[]
  ): Translation | undefined {
    return this.translationService.chooseRandomTranslation(translations);
  }

  protected generateNewTranslation() {
    this.translation = this.translationService.chooseRandomTranslation(
      this.translationService.translationsSubject.value
    );

    this.speechService.speak(this.translation.phrase);
  }

  protected newRecording(): void {
    this.router.navigate(['/capture-video']);
  }
}
