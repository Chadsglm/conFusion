import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';

import { Promotion } from '../shared/promotion';
import { Dish } from '../shared/dish';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  dishErrMess: string;
  promoErrMess: string;
  leaderErrMess: string;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
        .subscribe(dish => this.dish = dish,
                   errMessage => this.dishErrMess = <any>errMessage.message);
    this.promotionService.getFeaturedPromotion()
        .subscribe(promotion => this.promotion = promotion,
                   errMessage => this.promoErrMess = <any>errMessage.message);
    this.leaderService.getFeaturedLeader()
        .subscribe(leader => this.leader = leader,
                   errMessage => this.leaderErrMess = <any>errMessage.message);
  }

}
