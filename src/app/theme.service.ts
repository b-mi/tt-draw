import { Injectable, effect, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

const STORAGE_KEY = 'isDarkTheme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkSignal = signal<boolean>(false);

  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      const isDark = this.isDarkSignal();
      this.document.body.classList.toggle('dark-mode', isDark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isDark));
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    const isDark = stored === 'true';
    this.isDarkSignal.set(isDark);
  }

  isDark = () => this.isDarkSignal(); // getter pre binding

  setDark(value: boolean): void {
    this.isDarkSignal.set(value);
  }

  toggle(): void {
    this.isDarkSignal.update(v => !v);
  }
}
