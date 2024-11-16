import {
  Component,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '../../services/video-service';

@Component({
  selector: 'app-capture-video',
  standalone: true,
  imports: [],
  templateUrl: './capture-video.component.html',
  styleUrl: './capture-video.component.scss',
})
export class CaptureVideoComponent {
  @ViewChild('video') videoElementRef: ElementRef | undefined;

  protected loading = true;
  private router: Router = inject(Router);
  private ngZone: NgZone = inject(NgZone);
  private videoService: VideoService = inject(VideoService);

  videoElement: HTMLVideoElement | undefined;

  mediaRecorder: any;

  isRecording: boolean = false;

  stream: MediaStream | undefined;

  constructor() {}

  async ngAfterViewInit() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 360,
      },
    });

    if (this.videoElementRef) {
      this.videoElement = this.videoElementRef?.nativeElement;

      this.stream = stream;

      this.videoElement!.srcObject = this.stream;
    }
    this.loading = false;
  }

  startRecording() {
    this.videoService.recordedBlobs = [];
    let options: any = { mimeType: 'video/mp4' };

    try {
      if (this.stream) {
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      } else {
        alert('Stream is undefined');
      }
    } catch (err) {
      alert('error on line 54');
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = !this.isRecording;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.videoService.recordedBlobs);
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.videoService.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      alert('error on line 85');
    }
  }

  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.videoService.recordedBlobs, {
          type: 'video/mp4',
        });
        this.videoService.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag

        this.ngZone.run(() => {
          this.router.navigate([`translation-page`]);
        });
      };
    } catch (error) {
      alert('error on line 102');
    }
  }
}
