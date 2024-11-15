import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LogoComponent } from '../../logo/logo/logo.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  private router: Router = inject(Router);

  protected beginTranslation(): void {
    this.router.navigate(['/capture-video']);
  }
}
