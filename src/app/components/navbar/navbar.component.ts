import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { isPlatformBrowser, Location } from '@angular/common';
import { ScrollSpyService } from '../../services/scroll-spy.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('svgLogo', [
      state(
        'normal',
        style({
          transform: 'translateY(-25%) scale(1.4)',
        })
      ),
      state(
        'small',
        style({
          transform: 'translateY(5%)',
        })
      ),
      transition('normal <=> small', animate(200)),
    ]),
    trigger('safariNav', [
      state(
        'safariNormal',
        style({
          position: 'sticky',
        })
      ),
      state(
        'safariSmall',
        style({
          position: 'fixed',
        })
      ),
      transition('normal <=> small', animate(0)),
    ]),
    trigger('logoLabel', [
      state('normal',
        style({
          transform: 'translateY(-70%)',
          fontSize: '1rem',
          marginBottom: '0.2em',
        })
      ),
      state(
        'small',
        style({
          marginBottom: '0em',
          transform: 'translateX(-4%) ',
        })
      ),
      transition('normal <=> small', animate(200)),
    ]),
    trigger('svgLogoLaw', [
      state(
        'normal',
        style({
          transform: 'translateY(-20%)',
        })
      ),
      state(
        'small',
        style({
          transform: 'translateY(10%) ',
        })
      ),
      transition('normal <=> small', animate(200)),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  logo = 'normal';
  isSafari : boolean = false;
  safariNav = "safariNormal";
  navbarOpen = false;
  public section: string = '';

  static scrollSpyService : ScrollSpyService;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public scrollSpy: ScrollSpyService,
    private location: Location
  ) {

    if(isPlatformBrowser(this.platformId)) {
      NavbarComponent.scrollSpyService = this.scrollSpy;
      NavbarComponent.scrollSpyService.sectionSub.subscribe( (val : string) => {
        if ( val !== "default" && val !== '' ) {
          this.section = val;
          this.location.go('#' + val);
        } else {
          this.section = '';
        }
      })
    }

  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.scrolling, {passive: true});

      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
        } else {
          this.isSafari = true;
        }
      }
    }
  }

  goPageStart() {
    window.scroll(0, 0);
  }

  scrolling=(s)=>{
    let element = document.querySelector('.navbar');
    if (window.scrollY > element.scrollHeight) {
      this.logo = 'small';
      if (this.isSafari) {
        this.safariNav = "safariSmall";
      }
    } else {
      this.logo = 'normal';
      if (this.isSafari) {
        this.safariNav = "safariNormal";
      }
    }
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}


