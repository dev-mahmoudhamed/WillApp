import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  errors: string[] | null = null;

  constructor(private fb: FormBuilder, private accountservice: AccountService, private router: Router) { }

  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  onSubmit() {
    this.accountservice.register(this.registerForm.value as User).subscribe({

      next: () => {
        this.router.navigateByUrl('');
      },
      error: err => this.errors = err.errors
    });
  }
}