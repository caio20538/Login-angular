import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { NgOptimizedImage } from "@angular/common";
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface LoginForm{
  email: FormControl,
  password: FormControl
}

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => this.toastService.success("Login feito com sucesso"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde.")
    })
    //o subscribe pega a resposta da requisição, logica no service
    //o uso do httpClient precisa mexer no app.config.ts para add ele lá
  }

  navigate(){
    this.router.navigate(["signup"])
  }
}
