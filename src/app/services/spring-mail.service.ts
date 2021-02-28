import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Details } from '../models/details.model';

@Injectable({
  providedIn: 'root'
})
export class SpringMailService {

  private baseUrl = environment.baseUrl;

  constructor(private https: HttpClient) { }

  sendMail( dataset : Details  ) {
    return this.https.post<Details>(this.baseUrl + `/sendMail`, dataset);
  }
}
