import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsOfTheYearComponent } from './albums-of-the-year.component';

describe('AlbumsOfTheYearComponent', () => {
  let component: AlbumsOfTheYearComponent;
  let fixture: ComponentFixture<AlbumsOfTheYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumsOfTheYearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumsOfTheYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
