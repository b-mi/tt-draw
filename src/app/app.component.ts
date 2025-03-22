import { Component, inject, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { RouterModule } from '@angular/router';
import { PromptUpdateService } from './prompt-update.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterModule],
    standalone: true
})
export class AppComponent implements OnInit {

  private swUpdate = inject(PromptUpdateService);
  title = 'TT-Draw';

  /**
   *
   */
  constructor(public service: AppService) {
  }
  ngOnInit(): void {
  }
}
