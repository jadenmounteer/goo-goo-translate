import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-translation-page',
  standalone: true,
  imports: [],
  templateUrl: './translation-page.component.html',
  styleUrl: './translation-page.component.scss',
})
export class TranslationPageComponent {
  @ViewChild('recordedVideo') recordedVideoElementRef: ElementRef | undefined;

  constructor() {}
}
