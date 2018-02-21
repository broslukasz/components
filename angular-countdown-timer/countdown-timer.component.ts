import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';
import {Subscription} from 'rxjs/Subscription';
import {CountDownTime} from './countdown-time';

const countdownInterval = 1000;

@Component({
  selector: 'lubros-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  private countDownObservable: Subscription;
  private timerInitialValueInMinutes: number;
  public timeLeft: CountDownTime;

  @Input ('minutes')
  set _timerInitialValueInMinutes(value: number) {
    this.timerInitialValueInMinutes = value * 60;
  }

  get _timerInitialValueInMinutes(): number {
    return this.timerInitialValueInMinutes;
  }

  constructor() { }

  ngOnInit() {
    this.countDownObservable = this.runCountDown(this.timerInitialValueInMinutes);
  }

  ngOnDestroy() {
    this.countDownObservable.unsubscribe();
  }

  private runCountDown(timerInitialValue: number): Subscription {
    return Observable
      .timer(0, countdownInterval)
      .map((timerSequenceNumber) => timerInitialValue - timerSequenceNumber)
      .take(timerInitialValue + 1)
      .subscribe((calculatedTimeLeft: number): void => {
        this.calculateTimeLeft(calculatedTimeLeft);
      });
  }

  private calculateTimeLeft(calculatedTimeLeft: number): void {
    this.timeLeft = new CountDownTime();
    this.timeLeft.hours = this.getHours(calculatedTimeLeft);
    this.timeLeft.minutes = this.getMinutes(calculatedTimeLeft);
    this.timeLeft.seconds = this.getSeconds(calculatedTimeLeft);
  }

  private getSeconds(ticks: number) {
    return ticks % 60;
  }

  private getMinutes(ticks: number) {
    return (Math.floor(ticks / 60)) % 60;
  }

  private getHours(ticks: number) {
    return Math.floor((ticks / 60) / 60);
  }
}
