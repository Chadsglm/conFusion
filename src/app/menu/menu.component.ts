import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { flyInOut,  expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class MenuComponent implements OnInit {
  dishes: Dish[];
  selectedDish: Dish;
  errMess: string;

  constructor(
    private dishService: DishService,
    @Inject('BaseURL') public BaseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
        .subscribe(dishes => this.dishes = dishes,
                   errMessage => this.errMess = <any> errMessage.message);

  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }

}
