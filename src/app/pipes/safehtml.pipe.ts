import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  pure: true
})
export class SafehtmlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  transform(htmlContent: any) {
    let sanitizeHtmlContent = this.domSanitizer.bypassSecurityTrustHtml(htmlContent);
    return sanitizeHtmlContent;
  }

}
