import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { NavComponent } from './nav/nav.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [NavComponent, NgClass]
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
