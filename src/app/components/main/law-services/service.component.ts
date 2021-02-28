import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {


  constructor() { }


  ngOnInit(): void {
  }

  forceScrollToTop() {
    // force scrolling to top because of bug with smooth scrolling <- action trigger (i++) required!
    let i = 1;
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (i < 3) {
        window.scroll(0, i++);
      } else if (i > 10) {
        i = 0;
      }

      if (pos < 2) {
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 30);
  }
}
