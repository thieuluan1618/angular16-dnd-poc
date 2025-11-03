import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './pages/demo/demo.component';
import { TestTreeComponent } from './pages/test-tree/test-tree.component';

const routes: Routes = [
  { path: '', component: DemoComponent },
  { path: 'test', component: TestTreeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
