import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  public recordedBlobs: Blob[] = [];
  public downloadUrl: string = '';
  constructor() {}
}
