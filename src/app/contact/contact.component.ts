import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ContactType, Feedback } from '../shared/feedback';
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {
  @ViewChild('fForm', {static: true}) feedbackFormDirective;

  feedbackForm: FormGroup;
  contactType = ContactType;

  submissionResult: Feedback;
  feedbackErrMess: string;
  submission = false;
  showSubmitted = false;
  visibility = 'shown';

  formErrors = {
    'firstName': '',
    'lastName': '',
    'telNum': '',
    'email': ''
  };

  validationMessages = {
    'firstName': {
      'required':      'First Name is required.',
      'minLength':     'First Name must be at least 2 characters long.',
      'maxLength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastName': {
      'required':      'Last Name is required.',
      'minLength':     'Last Name must be at least 2 characters long.',
      'maxLength':     'Last Name cannot be more than 25 characters long.'
    },
    'telNum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(
    private feedbackService: FeedbackService,
    private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telNum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contactType: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
  }

  onSubmit() {
    this.submission = true;
    this.showSubmitted = true;
    this.visibility = 'shown';
    const feedback = this.feedbackForm.value;

    this.feedbackService.submitFeedback(feedback)
        .subscribe(feedback => {
          this.submissionResult = feedback;
          this.submission = false;
          setTimeout(() => this.resetForm(), 5000);
        });
  }

  resetForm() {
    this.showSubmitted = false;
    this.submissionResult = null;
    this.feedbackForm.reset({
      firstName: '',
      lastName: '',
      telNum: '',
      email: '',
      agree: false,
      contactType: 'None',
      message: ''
    });
  }


  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
}
