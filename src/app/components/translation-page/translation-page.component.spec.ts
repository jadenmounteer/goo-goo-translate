import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationPageComponent } from './translation-page.component';

describe('TranslationPageComponent', () => {
  let component: TranslationPageComponent;
  let fixture: ComponentFixture<TranslationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranslationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
