import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-capture-video',
  standalone: true,
  imports: [],
  templateUrl: './capture-video.component.html',
  styleUrl: './capture-video.component.scss',
})
export class CaptureVideoComponent {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef | undefined;
  @ViewChild('video') videoElementRef: ElementRef | undefined;

  videoElement: HTMLVideoElement | undefined;
  recordVideoElement: HTMLVideoElement | undefined;
  mediaRecorder: any;
  recordedBlobs: Blob[] = [];
  isRecording: boolean = false;
  downloadUrl: string = '';
  stream: MediaStream | undefined;

  constructor() {}

  async ngOnInit() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 360,
        },
      })
      .then((stream) => {
        if (this.videoElement) {
          this.videoElement = this.videoElementRef?.nativeElement;
          this.recordVideoElement = this.recordVideoElementRef?.nativeElement;

          this.stream = stream;
          if (this.videoElement?.srcObject) {
            this.videoElement.srcObject = this.stream;
          }
        }
      });
  }

  startRecording() {
    this.recordedBlobs = [];
    let options: any = { mimeType: 'video/webm' };

    try {
      if (this.stream) {
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      } else {
        console.error('Stream is undefined');
      }
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = !this.isRecording;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.recordedBlobs);
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.');
      return;
    }
    this.recordVideoElement?.play();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.recordedBlobs, {
          type: 'video/webm',
        });
        this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag

        if (this.recordVideoElement) {
          this.recordVideoElement.src = this.downloadUrl;
        }
      };
    } catch (error) {
      console.log(error);
    }
  }
}
