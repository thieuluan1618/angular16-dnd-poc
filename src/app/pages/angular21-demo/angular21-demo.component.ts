import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-angular21-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './angular21-demo.component.html',
  styleUrls: ['./angular21-demo.component.scss']
})
export class Angular21DemoComponent {
  // Signal: Reactive state
  count = signal(0);
  inputText = signal('');
  selectedTab = signal<'signals' | 'control-flow' | 'performance'>('signals');
  items = signal(['Angular 21', 'TypeScript 5.9', 'RxJS 7.8']);

  // Computed: Derived state
  doubleCount = computed(() => this.count() * 2);
  tripleCount = computed(() => this.count() * 3);
  formattedCount = computed(() => `Count is ${this.count()}`);
  characterCount = computed(() => this.inputText().length);
  displayItems = computed(() => 
    this.items().filter(item => 
      item.toLowerCase().includes(this.inputText().toLowerCase())
    )
  );

  constructor() {
    // Effect: Run side effects when signals change
    effect(() => {
      const count = this.count();
      console.log(`Count changed to: ${count}`);
    });
  }

  // Actions
  increment(): void {
    this.count.update(v => v + 1);
  }

  decrement(): void {
    this.count.update(v => Math.max(0, v - 1));
  }

  reset(): void {
    this.count.set(0);
  }

  addItem(): void {
    const newItem = prompt('Enter new item:');
    if (newItem) {
      this.items.update(items => [...items, newItem]);
    }
  }

  removeItem(index: number): void {
    this.items.update(items => items.filter((_, i) => i !== index));
  }

  switchTab(tab: 'signals' | 'control-flow' | 'performance'): void {
    this.selectedTab.set(tab);
  }
}
