import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { AboutComponent } from './components/main/about/about.component';
import { ContactComponent } from './components/main/contact/contact.component';
import { MainComponent } from './components/main/main/main.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { PrivatePolicyComponent } from './components/main/private-policy/private-policy.component';
import { AngularFireModule } from '@angular/fire';
import { AuthInterceptorService } from './components/auth/auth-interceptor/auth-interceptor.service';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ContactPlaceholderComponent } from './components/main/contact/contact-placeholder/contact-placeholder.component';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';
import { ServiceWorkerModule } from '@angular/service-worker';


const appRoutes: Routes = [

  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactPlaceholderComponent  },
  { path: 'privacy', component: PrivatePolicyComponent },
  {
    path: 'service',
    loadChildren: () => import('./components/main/law-services/law.module').then(m => m.LawServiceModule),
  },
  {
    path: 'blog',
    loadChildren: () => import('./components/blog/blog.module').then(m => m.BlogModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/blog-editor/blog-editor.module').then(m => m.BlogEditorModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
  },

  { path: '', pathMatch: 'full', component: MainComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full'}
];

const buttonCustomConfig = {
  // debug: true,
  prop: {
    facebook: {
      text: 'Poleć'
    },
    twitter: {
      text: 'Tweetnij'
    },
    linkedin: {
      text: 'Poleć'
    },
    messenger: {
      text: 'Wyślij'
    },
    copy: {
      text: 'Skopiuj link'
    },
    email: {
      text: 'Wyślij email'
    }
  }
};

const cookieConfig:NgcCookieConsentConfig = {
  "cookie": {
    "domain": " "
  },
  "position": "bottom",
  "theme": "block",
  "palette": {
    "popup": {
      "background": "#0a2746",
      "text": "#ffffff",
      "link": "#ffffff"
    },
    "button": {
      "background": "#e6a513",
      "text": "#000000",
      "border": "transparent"
    }
  },
  "type": "info",
  "content": {
    "message": "Strona, na której się znajdujesz używa plików Cookies. Używamy informacji zapisanych za pomocą Cookies i podobnych technologii m.in. w celach statystycznych i marketingowych oraz w celu dostosowania naszych serwerów do indywidualnych potrzeb użytkowników. Używamy stałych plików cookies, przechowywanych na urządzeniu końcowym użytkownika. W programie służącym do obsługi Internetu można zmienić ustawienia dotyczące cookies. Korzystanie z naszych serwisów internetowych bez zmiany ustawień dotyczących cookies oznacza, że będą one zapisane w pamięci urządzenia.",
    "dismiss": "Akceptuję",
    "link": "Dowiedz się więcej",
    "href": " ",
    "policy": "Cookie Policy"
  }
};
@NgModule({
  declarations: [
    AppComponent,

    MainComponent,
    NavbarComponent,
    AboutComponent,
    ContactComponent,

    PrivatePolicyComponent,

    ContactPlaceholderComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      useHash: false,
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollOffset: [0, 0],
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabled'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig, 'firebase'),
    ShareButtonsModule.withConfig(buttonCustomConfig),
    NgcCookieConsentModule.forRoot(cookieConfig),
    NgbModule,
    AgmCoreModule.forRoot({ apiKey: environment.googleMapsApiKey }),

    SharedModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately'  })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
