import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './pages/demo/demo.component';
import { SignalFormDemoComponent } from './pages/signal-form-demo/signal-form-demo.component';
import { Angular21DemoComponent } from './pages/angular21-demo/angular21-demo.component';

const routes: Routes = [
  { path: '', component: DemoComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'signal-forms', component: SignalFormDemoComponent },
  { path: 'angular21', component: Angular21DemoComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
