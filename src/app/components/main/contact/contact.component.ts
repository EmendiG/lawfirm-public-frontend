import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  zoom: number = 15;
  lat: number = 52.24010736900461;
  lng: number = 20.971418150829944;
  title: 'Lawfirm: St. XXXXXXXX XXX';
  icon = {
    url: '/assets/Locpin.svg',
    scaledSize: {height: 45, width: 27}
  };
  styles = [{
    featureType: 'all',
    elementType: 'all',
    stylers: [{ saturation: -100 }]
  }];

  onMapReady( map )
  {
    if(map) {
      map.setOptions({
        streetViewControl: false
      });
    }
  }

}
