import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ActivatedRoute} from "@angular/router";

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [ {provide: ActivatedRoute, useValue: fakeActivatedRoute} ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
