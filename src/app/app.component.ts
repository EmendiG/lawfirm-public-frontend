import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { environment } from '../environments/environment';
import { FireAuthService } from './services/fire-auth.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'kancelaria-frontend';
  router: string = '';

  @ViewChild("contact", { static: false }) contact;
  trackingCode = environment.googleAnalyticsKey;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private readonly renderer: Renderer2,
              private readonly el: ElementRef,
              public authService: FireAuthService ,
              public _router: Router,
              private ccService: NgcCookieConsentService
              ) {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      script.src = `//www.googletagmanager.com/gtag/js?id=${this.trackingCode}`;
      script.async = true;
      this.renderer.appendChild(this.el.nativeElement, script);

      const script2 = this.renderer.createElement('script') as HTMLScriptElement;
      const scriptBody = this.renderer.createText(`
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', '${this.trackingCode}');
      `);
      this.renderer.appendChild(script2, scriptBody);
      this.renderer.appendChild(this.el.nativeElement, script2);

      this._router.events.subscribe(event => {
        if(event instanceof NavigationEnd){
          gtag('config', `${this.trackingCode}`,
            {
              'page_path': event.urlAfterRedirects
            }
          );
        }
      })
    }
  }

  ngOnInit() {
    this.authService.autoLogin();
  }
}
