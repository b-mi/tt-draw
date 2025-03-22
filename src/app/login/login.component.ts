import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  accounts: any[];
  onSubmit() {
  }

  username: string = '';
  password: string = '';

  constructor(private service: AppService) { }

  async ngOnInit() {
    // this.accounts = await this.service.ttGetAccs();
  }

}
