import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsOfTheWeekComponent } from './songs-of-the-week.component';

describe('SongsOfTheWeekComponent', () => {
  let component: SongsOfTheWeekComponent;
  let fixture: ComponentFixture<SongsOfTheWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsOfTheWeekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsOfTheWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
