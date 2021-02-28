import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subscription, BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { animationFrameScheduler } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface ScrollSpy {
  elements: HTMLElement[];
  currentSectionId: string;
  subject: BehaviorSubject<string>;
}

interface ScrollSpies {
  [scrollSpyId: string]: ScrollSpy;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollSpyService implements OnDestroy {
  private readonly defaultId: string = 'default';
  private scrollSpies: ScrollSpies = {};
  private scrollSubscription: Subscription;

  public sectionSub = new BehaviorSubject<string>('');

  constructor( @Inject(PLATFORM_ID) private platformId: any) {
    this.subscribeScroll();
  }

  public ngOnDestroy(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.scrollSubscription.unsubscribe();
    }
  }

  public getCurrentSection$(scrollSpyId: string = this.defaultId) {
    if(isPlatformBrowser(this.platformId)) {
      return this.scrollSpies[scrollSpyId].subject
    }
  }


  public addElement(element: HTMLElement, scrollSpyId: string = this.defaultId): void {
    if(isPlatformBrowser(this.platformId)) {
      if (!this.scrollSpies[scrollSpyId]) {
        this.scrollSpies[scrollSpyId] = {
          elements: [],
          subject: new BehaviorSubject<string>(scrollSpyId),
        } as ScrollSpy;
      }

      if (this.hasElement(element.id, scrollSpyId)) {
        return;
      }

      const elements: HTMLElement[] = this.scrollSpies[scrollSpyId].elements;
      elements.push(element);
      elements.sort((a: HTMLElement, b: HTMLElement): number => b.getBoundingClientRect().top - a.getBoundingClientRect().top);

      this.scrollSpies[scrollSpyId].elements = elements;
    }
  }

  public removeElement(element: HTMLElement, scrollSpyId: string = this.defaultId): void {
    const elements: HTMLElement[] = this.scrollSpies[scrollSpyId].elements.filter((el: HTMLElement): boolean => el.id !== element.id);

    if (!elements.length) {
      delete this.scrollSpies[scrollSpyId];
      return;
    }

    this.scrollSpies[scrollSpyId].elements = elements;
  }

  private hasElement(elementId: string, scrollSpyId: string): boolean {
    return this.scrollSpies[scrollSpyId].elements.some((element: HTMLElement): boolean => element.id === elementId);
  }

  private subscribeScroll(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.scrollSubscription = fromEvent(window, 'scroll', { passive: true })
        .pipe(throttleTime(0, animationFrameScheduler))
        .subscribe((): void => {
          Object.keys(this.scrollSpies).forEach((key: string): void => {
            const { currentSectionId, elements, subject } = this.scrollSpies[key];
            const topElementInView: HTMLElement = elements.filter((element: HTMLElement): boolean => element.getBoundingClientRect().top <= 100)[0];

            if (!topElementInView) {
              return;
            }

            const topElementId: string = topElementInView.id;

            if (topElementId !== currentSectionId) {
              this.scrollSpies[key].currentSectionId = topElementId;
              subject.next(topElementId);
            }
          });
        });
    }
  }

}
