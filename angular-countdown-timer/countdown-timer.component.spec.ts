import {async, ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed} from '@angular/core/testing';

import { CountdownTimerComponent } from './countdown-timer.component';
import {tick} from '@angular/core/testing';
import {isUndefined} from 'util';

describe('CountdownTimerComponent', () => {
  let component: CountdownTimerComponent;
  let fixture: ComponentFixture<CountdownTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownTimerComponent ],
      providers: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have timeLeft assigned when after component init', fakeAsync(() => {
    // given
    const initialTimeLeft = component._timerInitialValueInMinutes;
    component._timerInitialValueInMinutes = 80;

    // when
    component.ngOnInit();
    tick();

    // then
    expect(isUndefined(initialTimeLeft)).toBeTruthy();
    expect(isUndefined(component.timeLeft)).toBeFalsy();
    discardPeriodicTasks();
  }));

  it('should decrement properly the value of timeLeft after given time period',
    fakeAsync(() => {
    // given
    const waitingTimeInSeconds = 4;
    let initialTimeLeft: number;
    component._timerInitialValueInMinutes = 80;

    // when
    component.ngOnInit();
    tick(0);
    initialTimeLeft = component.timeLeft.seconds;

    tick(waitingTimeInSeconds * 1000);

    // then
    expect(calculateTimePeriodPassed(initialTimeLeft, waitingTimeInSeconds)).toBe(waitingTimeInSeconds);
    discardPeriodicTasks();
    }),
  );

  it('should have proper time values when the countdown starts', fakeAsync((() => {
    // given
    component._timerInitialValueInMinutes = 80;

    // when
    component.ngOnInit();
    tick(0);

    // then

    expect(component.timeLeft.hours).toBe(1);
    expect(component.timeLeft.minutes).toBe(20);
    expect(component.timeLeft.seconds).toBe(0);
    discardPeriodicTasks();
    }),
  ));
});

function calculateTimePeriodPassed(initialTimeLeft: number, waitingTimeInSeconds: number) {
  return Math.abs(initialTimeLeft - waitingTimeInSeconds);
}
