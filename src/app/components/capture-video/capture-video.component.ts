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
  protected timer: number = 10;
  private intervalId: any;

  videoElement: HTMLVideoElement | undefined;

  mediaRecorder: any;

  isRecording: boolean = false;

  stream: MediaStream | undefined;

  facingMode: 'user' | 'environment' = 'user'; // Track the current camera direction

  constructor() {}

  async ngAfterViewInit() {
    await this.startCamera();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 360,
          facingMode: this.facingMode, // Use the current facing mode
        },
      });

      if (this.videoElementRef) {
        this.videoElement = this.videoElementRef.nativeElement;
        this.stream = stream;
        if (this.videoElement) {
          this.videoElement.srcObject = this.stream;
        }
      }
      this.loading = false;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      this.loading = false;
    }
  }

  protected async changeCameraDirection() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'; // Toggle the facing mode
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop()); // Stop the current stream
    }
    await this.startCamera(); // Restart the camera with the new facing mode
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
      alert('Error initializing MediaRecorder: ' + err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = true;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();

    // Start the timer
    this.timer = 10;
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.stopRecording();
      }
    }, 1000);
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.intervalId);
      console.log('Recorded Blobs: ', this.videoService.recordedBlobs);
    }
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.videoService.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      alert('Error handling data available event: ' + error);
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
      alert('Error handling stop recording event: ' + error);
    }
  }
}
