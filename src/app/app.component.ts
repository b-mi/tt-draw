import { Component, inject, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { RouterModule } from '@angular/router';
// import { PromptUpdateService } from './prompt-update.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterModule],
    standalone: true
})
export class AppComponent implements OnInit {

  private updates = inject(SwUpdate);
  title = 'TT-Draw';

  constructor(public service: AppService) {
    this.checkUpdate(this.updates);
  }


  private checkUpdate(updates: SwUpdate) {
    console.log('UpdateService: Constructor', updates.isEnabled);

    if (updates.isEnabled) {
      // cyklicke zistovanie - ale moze byt neziaduce d
      // This shouldn't be necessary but is a try to get the versionUpdates. Doesn't do it either.
      // interval(20000).subscribe(() => {
      console.log('UpdateService: Checking for Updates');
      updates.checkForUpdate();
      // });
      updates.versionUpdates.subscribe(async (evt) => {
        console.log('UpdateService: versionUpdates', evt);
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log(`Downloading new app version: ${evt.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`Current app version: ${evt.currentVersion.hash}`);
            console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
            await updates.activateUpdate();
            location.reload();
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
            break;
        }
      });
    }
  }

  ngOnInit(): void {
  }

  onSwipeLeft() {
    console.log('Swipe doľava');
  }

  onSwipeRight() {
    console.log('Swipe doprava');
  }
}
