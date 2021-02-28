import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollSpyService } from '../services/scroll-spy.service';

@Directive({
  selector: '[appScrollSpyElement]'
})
export class ScrollSpyElementDirective implements OnInit, OnDestroy, AfterViewInit   {

  @Input() private scrollSpyId: string;
  private fragment: string;

  constructor(
    private elementRef: ElementRef,
    private scrollSpy: ScrollSpyService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
      this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  public ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.scrollSpy.addElement(this.elementRef.nativeElement, this.scrollSpyId);
    }
  }

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      try {
        const anchor = document.querySelector<HTMLAnchorElement>('#' + this.fragment);
        anchor.focus();
        anchor.scrollIntoView( {behavior: "smooth", block: "start"} );
      } catch (e) { }
    }
  }

  public ngOnDestroy(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.scrollSpy.removeElement(this.elementRef.nativeElement, this.scrollSpyId);
    }
  }

}
