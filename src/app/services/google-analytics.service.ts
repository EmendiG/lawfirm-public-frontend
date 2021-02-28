import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class GoogleAnalyticsService {

  constructor() { }

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null )
    {
      let gtag:Function;

      gtag('event', eventName, {
              eventCategory: eventCategory,
              eventLabel: eventLabel,
              eventAction: eventAction,
              eventValue: eventValue
      })
    }
}
