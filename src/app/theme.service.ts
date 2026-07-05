import { Injectable, effect, signal, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const STORAGE_KEY = 'isDarkTheme';

function readDarkThemePreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return false;
    }
    if (stored === 'true') {
      return true;
    }
    if (stored === 'false') {
      return false;
    }
    return JSON.parse(stored) === true;
  } catch {
    return false;
  }
}

function applyTheme(doc: Document, isDark: boolean): void {
  doc.documentElement.dataset['theme'] = isDark ? 'dark' : 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkSignal = signal(readDarkThemePreference());

  constructor(@Inject(DOCUMENT) private document: Document) {
    applyTheme(this.document, this.isDarkSignal());

    effect(() => {
      const isDark = this.isDarkSignal();
      applyTheme(this.document, isDark);
      localStorage.setItem(STORAGE_KEY, isDark ? 'true' : 'false');
    });
  }

  isDark = () => this.isDarkSignal();

  setDark(value: boolean): void {
    this.isDarkSignal.set(value);
  }

  toggle(): void {
    this.isDarkSignal.update(v => !v);
  }
}
