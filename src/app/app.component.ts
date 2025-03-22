import { Component, inject, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { RouterModule } from '@angular/router';
// import { PromptUpdateService } from './prompt-update.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

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

  /**
   *
   */
  constructor(public service: AppService) {
  }
  ngOnInit(): void {
    if (this.updates.isEnabled) {
      this.updates.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
        )
        .subscribe(() => {
          if (confirm("Nová verzia aplikácie je dostupná. Chceš aktualizovať?")) {
            this.updates.activateUpdate().then(() => document.location.reload());
          }
        });
    }
  }
}
