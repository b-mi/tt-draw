import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatCardModule, FormsModule, MatFormFieldModule]
})
export class LoginComponent implements OnInit {
  onSubmit() {
  }

  username: string = '';
  password: string = '';

  constructor(private service: AppService) { }

  async ngOnInit() {
    // this.accounts = await this.service.ttGetAccs();
  }

}
