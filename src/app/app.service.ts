import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

const BASE_ROBIN_NAMES: any[] = [
  { id: 0, table: '0', name: '-' },
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

  themeChecked: boolean = true;
  themeName = '';
  themeKey = 'tt-draw-theme';
  langKey = 'tt-lang';

  langId = 1;
  baseApiAddr: any = 'https://arxa.eu/rootapi';

  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {
    const th = localStorage.getItem(this.themeKey);
    this.themeChecked = th === 'true';
    this.setTheme(this.themeChecked);

    const lgi = localStorage.getItem(this.langKey);
    if (lgi) {
      this.langId = Number.parseInt(lgi);
    }

  }

  setTheme(checked: any) {
    localStorage.setItem(this.themeKey, checked);
    this.themeName = checked === true ? 'dark-theme' : 'light-theme';
    this.themeChecked = checked;
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

  getRobinNames(): any[] {
    // return BASE_ROBIN_NAMES; // reset
    const json = localStorage.getItem('robin-names');
    var a = 1;
    if (json) {
      const data = (JSON.parse(json) as any[]);
      return data;
    } else {
      return BASE_ROBIN_NAMES;
    }
  }

  saveRobinNames(data: any[]) {
    const json = JSON.stringify(data);
    localStorage.setItem('robin-names', json);
    const val = localStorage.getItem('robin-names');
    // this.showMessage('Uložené')
  }

  // async ttGetAccs(): any[] {
  //   return await lastValueFrom(this.http.get(`${this.baseApiAddr}/api/tt/get-accs`));
  // }


}
