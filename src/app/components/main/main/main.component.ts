import { AfterViewInit, Component, Inject, OnChanges, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ScrollSpyService } from '../../../services/scroll-spy.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnDestroy, OnInit {
  opinionsArray = [
    {
      path: '/assets/images/anna-removebg-preview.png',
      name: 'AnnaLewandowska',
      content: 'Jest w pyte, polecam. Takiego allegrowicza, traktować jak Królewicza, konkretnie szybka wpłata nie jak inni płacą w ratach.',
      job: 'influencerka dancerka'
    },
    {
      path: '/assets/images/krzysztof-removebg-preview.png',
      name: 'Krzysztof Sztacheta',
      content: 'Kiedyś, gdy będę już za stary by handlować na Allegro , zasiądę przy kominku , zapalę fajkę i opowiem wnukom o aukcji z Tym Człowiekiem! To Lśniący Diament wśród Allegrowiczów. Dziękuję i pozdrawiam',
      job: 'operator koparki ręcznej'
    },
    {
      // brak
      name: 'Agnieszka Figiel',
      content: 'Pełen profesjonalizm. Na bieżąco byłam informowana o tym co się dzieje mojej w sprawie i czego mogę oczekiwać. Udało się nie tylko zrealizować zamierzony cel ale również znacząco ograniczyć stres podczas całego procesu.',
      job: 'Firma Sp. z.o.o.'
    },
    {
      path: '/assets/images/jaak-removebg-preview.png',
      name: 'Jaak',
      content:
        'W sklepie zakupiłem przedmiot na prezent oraz poprosiłem o dołączenie krótkiego tekstu z życzeniami. Moja prośba została potraktowana bardzo poważnie, a efekt końcowy był lepszy niż się spodziewałem! Osoba obdarowana była bardzo mile zaskoczona, a ja bardzo zadowolony. Serdecznie polecam! ;)',
      job: 'architekt systemów IT'
    },
  ];

  scroll:boolean=false;
  sectionSub : Subscription;

  constructor(private location: Location,
              @Inject(PLATFORM_ID) private platformId: any) { }

  ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.sectionSub = NavbarComponent.scrollSpyService.getCurrentSection$().subscribe(  (section: string) => {
        NavbarComponent.scrollSpyService.sectionSub.next(section);
      })
    }
  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.scrolling, {passive: true})
    }
  }

  ngOnDestroy() {
    if(isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
      window.removeEventListener('scroll', this.scrolling);
      if (this.sectionSub) {
        NavbarComponent.scrollSpyService.sectionSub.next('');
        this.sectionSub.unsubscribe();
      }
    }
  }

  scrolling=(s)=>{
    if (window.scrollY < 300) {
      this.location.go('#');
    }
  }
}
