import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime } from 'rxjs/operators';
import { BlogCategoryEnum } from '../../../models/blog-category.enum';
import { SpringBlogService } from '../../../services/spring-blog.service';

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

@Component({
  selector: 'app-blog-navbar',
  templateUrl: './blog-navbar.component.html',
  styleUrls: ['./blog-navbar.component.css'],
  animations: [
    trigger('toggle', [
      state(
        'hidden',
          style({ opacity: 0, transform: 'translateY(-100%)' })
      ),
      state(
        'visible',
          style({ opacity: 1, transform: 'translateY(0)' })
      ),
      transition('* => *', animate('200ms ease-in'))
    ])
  ]
})
export class BlogNavbarComponent implements AfterViewInit {

  blogTopics = [ ];

  isVisible: boolean = true;
  navbarOpen:boolean = false;

  disNav = 'visible';

  currentCategory = undefined;

  constructor( @Inject(PLATFORM_ID) private platformId: any,
              private springBlogService: SpringBlogService,
              private router: Router,
              private route: ActivatedRoute)
  {
    this.springBlogService.fetchCategories().subscribe( (res : []) => {
      this.blogTopics.push("All categories")
      for (let blogCategory of res) {
        this.blogTopics.push(BlogCategoryEnum[blogCategory])
      }
    })

    this.route.queryParams.subscribe( () => {
      if (this.route.snapshot.queryParams.category) {
        this.currentCategory = BlogCategoryEnum[this.route.snapshot.queryParams.category];
      } else {
        this.currentCategory = "All categories";
      }
    })
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }


  ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)) {
      const scroll$ = fromEvent(window, 'scroll', { passive: true }).pipe(
        throttleTime(10),
        map(() => window.pageYOffset),
        pairwise(),
        map(([y1, y2]): Direction => (y2 < y1  ? Direction.Up : Direction.Down)),
        distinctUntilChanged(),
        share()
      );

      const scrollUp$ = scroll$.pipe(
        filter(direction => direction === Direction.Up)
      );

      const scrollDown = scroll$.pipe(
        filter(direction => direction === Direction.Down)
      );

      scrollUp$.subscribe(() => {
        this.isVisible = true;
        this.disNav = 'visible';
      });
      scrollDown.subscribe(() => {
        this.isVisible = false;
        this.disNav = 'hidden';
      });
    }
  }

  onChosenCategory(category) {
    let postsCategory = this.getEnumKeyByEnumValue(BlogCategoryEnum, category);
    this.router.navigate(["."], { queryParams: { category: postsCategory, page : 1 }, relativeTo: this.route })
  }

  getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }


}

