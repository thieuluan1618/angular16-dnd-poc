import { Component } from '@angular/core';
import { DemoComponent } from './pages/demo/demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DemoComponent],
  template: '<app-demo></app-demo>',
  styles: []
})
export class AppComponent {
  title = 'angular16-dnd-poc';
}
