import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
import { AppRouteGuard } from '../shared/auth/auth-route-guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'app',
                component: CoreComponent,
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    // {
                    //     path: '',
                    //     children: [
                    //         { path: 'notifications', component: NotificationsComponent },
                    //         { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' }
                    //     ]
                    // },
                    {
                        path: 'main',
                        loadChildren: './main/main.module#MainModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'admin',
                        loadChildren: './admin/admin.module#AdminModule', // Lazy load admin module
                        data: { preload: true }
                    }, {
                        path: '**', redirectTo: 'notifications'
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
