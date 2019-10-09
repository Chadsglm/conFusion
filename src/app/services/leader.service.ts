import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restangular } from 'ngx-restangular';
import { map } from 'rxjs/operators';

import { Leader } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private restAngular: Restangular) { }

  getLeaders(): Observable<Leader[]> {
    return this.restAngular.all('leaders').getList();
  }

  getLeader(id: number): Observable<Leader> {
    return  this.restAngular.one('leaders', id).get();
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.restAngular.all('leaders').getList({featured: true})
        .pipe(map(dishes => dishes[0]));
  }
}
