import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ColorScheme {
  name: string;
  colors: { bg: string; text: string; accent: string };
}

@Component({
  selector: 'app-tailwind-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tailwind-demo.component.html',
  styleUrls: ['./tailwind-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindDemoComponent {
  selectedTab = signal<'colors' | 'components' | 'responsive' | 'animations'>('colors');
  selectedColorScheme = signal<'blue' | 'purple' | 'pink'>('blue');
  hoverIndex = signal(-1);

  colorSchemes: Record<string, ColorScheme> = {
    blue: {
      name: 'Blue',
      colors: {
        bg: 'from-blue-600 to-cyan-600',
        text: 'text-blue-600',
        accent: 'bg-blue-500'
      }
    },
    purple: {
      name: 'Purple',
      colors: {
        bg: 'from-purple-600 to-pink-600',
        text: 'text-purple-600',
        accent: 'bg-purple-500'
      }
    },
    pink: {
      name: 'Pink',
      colors: {
        bg: 'from-pink-600 to-rose-600',
        text: 'text-pink-600',
        accent: 'bg-pink-500'
      }
    }
  };

  currentScheme = computed(() => 
    this.colorSchemes[this.selectedColorScheme()]
  );

  buttons = [
    { label: 'Primary', style: 'primary' },
    { label: 'Secondary', style: 'secondary' },
    { label: 'Success', style: 'success' },
    { label: 'Danger', style: 'danger' }
  ];

  cards = [
    {
      title: 'Responsive Design',
      description: 'Mobile-first, responsive utility classes',
      icon: '📱'
    },
    {
      title: 'Dark Mode',
      description: 'Built-in dark mode with dark: prefix',
      icon: '🌙'
    },
    {
      title: 'Custom Config',
      description: 'Highly customizable with tailwind.config.js',
      icon: '⚙️'
    }
  ];

  switchTab(tab: 'colors' | 'components' | 'responsive' | 'animations'): void {
    this.selectedTab.set(tab);
  }

  switchColorScheme(scheme: 'blue' | 'purple' | 'pink'): void {
    this.selectedColorScheme.set(scheme);
  }

  setHoverIndex(index: number): void {
    this.hoverIndex.set(index);
  }
}
