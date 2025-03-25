import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './Modules/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AssetComponent } from './Modules/asset/asset.component';
import { EnrichComponent } from './Modules/enrich/enrich.component';
import { CapacityComponent } from './Modules/capacity/capacity.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsermanageComponent } from './Modules/usermanage/usermanage.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';



export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full',
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',
        component:LayoutComponent,
        children:[
            {
               path:'home',
               component:HomeComponent
            },
            {
               path:'asset',
               component:AssetComponent
            },
            {
                path:'enrich',
                component:EnrichComponent
            },
            {
                path:'capacitymap',
                component:CapacityComponent
            },
            {
                path:'reports',
                component:ReportsComponent
            },
            {
                path:'usermanage',
                component:UsermanageComponent
            },
            {
                path:'edit/:id',
                component:UsermanageComponent
            },
            {
                path:'chatbot',
                component:ChatbotComponent
            }
        ]
    }
];
