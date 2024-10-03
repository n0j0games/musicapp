import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedDecadeComponent } from './aggregated-decade.component';

describe('AggregatedDecadeComponent', () => {
  let component: AggregatedDecadeComponent;
  let fixture: ComponentFixture<AggregatedDecadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregatedDecadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggregatedDecadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
