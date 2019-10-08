import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Restangular } from 'ngx-restangular';

import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { baseURL } from '../shared/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(
    private restAngular: Restangular) { }

    getDishes(): Observable<Dish[]> {
      return this.restAngular.all('dishes').getList();
    }

    getDish(id: number): Observable<Dish> {
      return  this.restAngular.one('dishes', id).get();
    }

    getFeaturedDish(): Observable<Dish> {
      return this.restAngular.all('dishes').getList({featured: true})
        .pipe(map(dishes => dishes[0]));
    }

    getDishIds(): Observable<number[] | any> {
      return this.getDishes()
        .pipe(map(dishes => dishes.map(dish => dish.id)),
                  catchError(error => error ));
    }
}
