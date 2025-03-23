import 'hammerjs';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { AppService } from './app/app.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MyHammerConfig } from './hammer.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    AppService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(HammerModule),
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled:  !isDevMode(),
      registrationStrategy: 'registerImmediately'
    })
  ]
}).catch(err => console.error(err));
