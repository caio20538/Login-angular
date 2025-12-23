import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { NgOptimizedImage } from "@angular/common";
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface SignupForm{
  name: FormControl,
  email: FormControl,
  password: FormControl,
  passwordConfirm: FormControl,
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    NgOptimizedImage
  ],
  providers: [
    LoginService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class signupComponent {
  singupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.singupForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ]),
        passwordConfirm: new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
      },
      {
        validators: this.passwordMatchValidator('password', 'passwordConfirm')
      }
    );

    // Força revalidação em tempo real
    this.singupForm.get('password')?.valueChanges.subscribe(() => {
      this.singupForm.updateValueAndValidity({ onlySelf: true });
    });

    this.singupForm.get('passwordConfirm')?.valueChanges.subscribe(() => {
      this.singupForm.updateValueAndValidity({ onlySelf: true });
    });
  }

  submit(): void {
    if (this.singupForm.invalid) return;

    const { name, email, password } = this.singupForm.value;

    this.loginService.singup(name, email, password).subscribe({
      next: () => this.toastService.success('Cadastro realizado com sucesso'),
      error: () =>
        this.toastService.error(
          'Erro inesperado! Tente novamente mais tarde.'
        )
    });
  }

  navigate(): void {
    this.router.navigate(['login']);
  }

  // Validator customizado (no mesmo component)
  passwordMatchValidator(
    passwordKey: string,
    confirmKey: string
  ): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get(passwordKey)?.value;
      const confirm = form.get(confirmKey)?.value;

      if (!password || !confirm) {
        return null;
      }

      return password === confirm
        ? null
        : { passwordMismatch: true };
    };
  }

  // Getter para uso no template
  get passwordMismatch() {
    return (
      this.singupForm.hasError('passwordMismatch') &&
      (this.singupForm.get('passwordConfirm')?.dirty ||
        this.singupForm.get('passwordConfirm')?.touched)
    );
  }
}
