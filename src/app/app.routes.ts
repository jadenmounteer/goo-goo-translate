import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'translate',
    component: TranslateComponent,
  }
  // Default route must be last
  {
    path: '',
    component: LandingPageComponent,
  },
];
