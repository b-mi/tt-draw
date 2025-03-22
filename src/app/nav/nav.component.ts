import { Component, viewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppService } from '../app.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '../translate.pipe';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatSlideToggleModule,
      TranslatePipe, AsyncPipe, MatIconModule, RouterModule
    ]
})
export class NavComponent {
  readonly drawer = viewChild<any>('drawer');
  matches: any;
  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver,
    public service: AppService) { 

      this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(
        map(result => {
          this.matches = result.matches;
          return result.matches;
        }),
        shareReplay()
      );

    }

  closeSideNav() {
    const drawer = this.drawer();
    if (drawer._mode == 'over') {
      drawer.close();
    }
  }

  themeChange(event: any) {
    this.service.setTheme(event.checked);
  }


}
