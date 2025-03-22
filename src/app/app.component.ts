import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterModule]
})
export class AppComponent implements OnInit {
  title = 'TT-Draw';

  /**
   *
   */
  constructor(public service: AppService) {
  }
  ngOnInit(): void {
  }
}
