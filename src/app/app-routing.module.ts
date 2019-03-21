import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './pages/list/list.module#ListPageModule'
  },  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'statistics', loadChildren: './pages/statistics/statistics.module#StatisticsPageModule' },
  { path: 'training-plan', loadChildren: './pages/training-plan/training-plan.module#TrainingPlanPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
