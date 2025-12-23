import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { signupComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "signup",
        component: signupComponent
    },
    {
        path: "user",
        component: UserComponent,
        canActivate: [AuthGuard]
    }
];
