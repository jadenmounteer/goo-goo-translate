import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureVideoComponent } from './capture-video.component';

describe('CaptureVideoComponent', () => {
  let component: CaptureVideoComponent;
  let fixture: ComponentFixture<CaptureVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureVideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaptureVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
