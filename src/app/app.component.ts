import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { RouterModule } from '@angular/router';
import { PromptUpdateService } from './prompt-update.service';
import { ThemeService } from './theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterModule],
    standalone: true
})
export class AppComponent implements OnInit {

  title = 'TT-Draw';

  constructor(
    public service: AppService,
    _promptUpdate: PromptUpdateService,
    _theme: ThemeService,
  ) {
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
