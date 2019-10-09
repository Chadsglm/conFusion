import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { visibility, flyInOut, expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  @ViewChild('fForm', {static: false}) commentFormDirective;

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;

  errMess: string;
  dishCopy = null;
  visibility = 'shown';

  commentForm: FormGroup;
  comment: Comment;
  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
    'date': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author name is required.',
      'minLength':     'Author name must be at least 2 characters long.',
      'maxLength':     'Author name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minLength':     'Comment must be at least 3 characters long.',
      'maxLength':     'Comment name cannot be more than 50 characters long.'
    },
    'rating': {
      'required':      'Rating is required.',
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) { }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
        .pipe(switchMap((params: Params) => { this.visibility = 'hidden';
                                              return this.dishService.getDish(+params['id']); }))
        .subscribe(dish => { this.dish = dish;
                             this.dishCopy = dish;
                             this.setPrevNext(dish.id);
                             this.visibility = 'shown'; },
                             errMessage => { this.dish = null; this.errMess = <any>errMessage.message; });
                            //  errMessage => this.errMess = <any>errMessage.message);
    this.createComment();
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createComment(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: ['' , [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)] ],
      date: new Date(),
    });

    this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    // console.log(this.comment);
    this.dishCopy.comments.push(this.comment);
    this.dishCopy.save()
        .subscribe(dish => this.dish = dish);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: '',
      date: new Date().toISOString()
    });
    this.commentFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

}
