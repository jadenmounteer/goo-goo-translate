import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CaptureVideoComponent } from './components/capture-video/capture-video.component';
import { TranslationPageComponent } from './components/translation-page/translation-page.component';

export const routes: Routes = [
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'capture-video',
    component: CaptureVideoComponent,
  },
  {
    path: 'translation-page',
    component: TranslationPageComponent,
  },
  {
    path: '**',
    redirectTo: 'landing-page',
  },
  // Default route must be last
  {
    path: '',
    component: LandingPageComponent,
  },
];
