import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PromptUpdateService {
  constructor(swUpdate: SwUpdate) {
    if (swUpdate.isEnabled) {
      swUpdate.checkForUpdate();
    }
    swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(async () => {
        if (confirm('Je k dispozícii nová verzia TT-Draw. Aktualizovať?')) {
          await swUpdate.activateUpdate();
          document.location.reload();
        }
      });
  }
}
