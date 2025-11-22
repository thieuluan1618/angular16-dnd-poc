import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './pages/demo/demo.component';
import { SignalFormDemoComponent } from './pages/signal-form-demo/signal-form-demo.component';
import { Angular21DemoComponent } from './pages/angular21-demo/angular21-demo.component';
import { TailwindDemoComponent } from './pages/tailwind-demo/tailwind-demo.component';

const routes: Routes = [
  { path: '', redirectTo: 'angular21', pathMatch: 'full' },
  { path: 'demo', component: DemoComponent },
  { path: 'signal-forms', component: SignalFormDemoComponent },
  { path: 'angular21', component: Angular21DemoComponent },
  { path: 'tailwind', component: TailwindDemoComponent },
  { path: '**', redirectTo: 'angular21' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
