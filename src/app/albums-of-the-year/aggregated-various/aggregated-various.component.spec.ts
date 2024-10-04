import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedVariousComponent } from './aggregated-various.component';

describe('AggregatedVariousComponent', () => {
  let component: AggregatedVariousComponent;
  let fixture: ComponentFixture<AggregatedVariousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregatedVariousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggregatedVariousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
