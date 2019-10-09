import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map } from 'rxjs/operators';

import { Promotion } from '../shared/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private restAngular: Restangular) { }

  getPromotions(): Observable<Promotion[]> {
    return this.restAngular.all('promotions').getList();
  }

  getPromotion(id: number): Observable<Promotion> {
    return  this.restAngular.one('promotions', id).get();
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.restAngular.all('promotions').getList({featured: true})
        .pipe(map(dishes => dishes[0]));
  }
}

