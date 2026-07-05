import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  RobinPlayer,
  SIT_OUT_DISPLAY_NAME,
  SIT_OUT_PLAYER_ID,
} from './player.model';

const BASE_ROBIN_NAMES: RobinPlayer[] = [
  { id: 1, table: '1', name: 'Peter K.' },
  { id: 2, table: '1', name: 'Bohuš M.' },
  { id: 3, table: '2', name: 'Ivan' },
  { id: 4, table: '2', name: 'Zuzka' },
  { id: 5, table: '3', name: 'Vilo' },
  { id: 6, table: '3', name: 'Peter D.' },
  { id: 7, table: '0', name: 'Emil' },
  { id: 8, table: '0', name: 'Mišo' },
  { id: 9, table: '0', name: 'Martin' },
];

@Injectable({
  providedIn: 'root'
})
export class AppService {

  langKey = 'tt-lang';
  tableCountKey = 'tt-table-count';

  langId = 1;
  baseApiAddr: any = 'https://arxa.eu/rootapi';

  isSitOut(p: RobinPlayer): boolean {
    return p.isSitOut === true || p.id === SIT_OUT_PLAYER_ID || p.name === '-';
  }

  isRealPlayer(p: RobinPlayer): boolean {
    return !this.isSitOut(p);
  }

  isActiveInDraw(p: RobinPlayer): boolean {
    return !!p.table && p.table !== '0';
  }

  createSitOutPlayer(): RobinPlayer {
    return {
      id: SIT_OUT_PLAYER_ID,
      name: SIT_OUT_DISPLAY_NAME,
      isSitOut: true,
      table: '',
    };
  }

  getActiveWithTable(list: RobinPlayer[]): RobinPlayer[] {
    return list.filter(p => this.isActiveInDraw(p));
  }

  getDrawPlayers(list: RobinPlayer[]): RobinPlayer[] {
    const active = this.getActiveWithTable(list);
    const realActive = active.filter(p => this.isRealPlayer(p));
    const sitOut = active.find(p => this.isSitOut(p));
    const realCount = realActive.length;

    if (realCount % 2 === 0) {
      return realActive;
    }
    return sitOut ? [...realActive, sitOut] : realActive;
  }

  ensureSitOutPlayer(list: RobinPlayer[]): RobinPlayer[] {
    const result = list.map(p => ({ ...p }));
    let changed = false;

    const sitOutIndices: number[] = [];
    for (let i = 0; i < result.length; i++) {
      if (this.isSitOut(result[i])) {
        sitOutIndices.push(i);
      }
    }

    if (sitOutIndices.length === 0) {
      result.push(this.createSitOutPlayer());
      changed = true;
    } else {
      const keepIdx = sitOutIndices[0];
      const kept = result[keepIdx];
      if (kept.id !== SIT_OUT_PLAYER_ID || !kept.isSitOut || kept.name === '-') {
        result[keepIdx] = {
          ...kept,
          id: SIT_OUT_PLAYER_ID,
          name: SIT_OUT_DISPLAY_NAME,
          isSitOut: true,
        };
        changed = true;
      }
      for (let i = sitOutIndices.length - 1; i > 0; i--) {
        result.splice(sitOutIndices[i], 1);
        changed = true;
      }
    }

    if (changed) {
      this.saveRobinNames(result);
    }
    return result;
  }

  getTableCount(fallback: number): number {
    const stored = localStorage.getItem(this.tableCountKey);
    if (stored) {
      const n = Number.parseInt(stored, 10);
      if (!Number.isNaN(n) && n > 0) {
        return n;
      }
    }
    return fallback;
  }

  saveTableCount(n: number): void {
    localStorage.setItem(this.tableCountKey, String(n));
  }

  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {
    const lgi = localStorage.getItem(this.langKey);
    if (lgi) {
      this.langId = Number.parseInt(lgi);
    }
  }

  fullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const doce = document.body;
      let methodToBeInvoked = doce.requestFullscreen
        ||
        doce['requestFullscreen'];
      if (methodToBeInvoked) {
        methodToBeInvoked.call(doce);
      }
    }
  }

  getRobinNames(): RobinPlayer[] {
    try {
      const json = localStorage.getItem('robin-names');
      if (json) {
        return JSON.parse(json) as RobinPlayer[];
      }
    } catch (e) {
      console.error('Error parsing robin-names from localStorage', e);
    }
    return [...BASE_ROBIN_NAMES, this.createSitOutPlayer()];
  }

  saveRobinNames(data: RobinPlayer[]) {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem('robin-names', json);
    } catch (e) {
      console.error('Error saving robin-names to localStorage', e);
    }
  }

}
