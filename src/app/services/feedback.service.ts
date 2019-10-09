import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs';

import { Feedback } from '../shared/feedback';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private restAngular: Restangular) { }

  getFeedback(): Observable<Feedback> {
    return this.restAngular.all('feedback').getList();
  }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.restAngular.all('feedback').post(feedback);
  }
}
