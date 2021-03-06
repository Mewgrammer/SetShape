import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '*', redirectTo: '' },
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule',  },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'training-day', loadChildren: './pages/training-day/training-day.module#TrainingDayPageModule' },
  { path: 'workout', loadChildren: './pages/workout/workout.module#WorkoutPageModule' },
  { path: 'workout-history', loadChildren: './pages/workout-history/workout-history.module#WorkoutHistoryPageModule' },
  { path: 'timer', loadChildren: './pages/timer/timer.module#TimerPageModule' },
  { path: 'statistics', loadChildren: './pages/statistics/statistics.module#StatisticsPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
