import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../translate.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
declare var require: any
@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    imports: [MatCardModule, FormsModule, MatFormFieldModule, MatDividerModule,
      ReactiveFormsModule, NgClass, MatTooltipModule, TranslatePipe,
      MatIconModule, MatToolbarModule, RouterModule
    ]
})
export class MainComponent implements OnInit {

  robin: any;
  rounds: any[] = [];
  round = 0;
  roundsCount = 0;
  playersCount = 8;
  tablesCount = 0;
  roundData = [];
  playerNames: { [pid: string]: string } = {};
  // playerNames = {};
  playerList: any[] = [];

  robin2Player: { [key: string]: any } = {};


  form!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private service: AppService) { }

  ngOnInit() {
    this.robin = require('roundrobin');
    this.loadPlayers();
    this.calc();
  }

  cntChanged(event: any) {
    this.playersCount = event.value;
    this.calc();
  }

  calc() {
    this.rounds = this.robin(this.playersCount);
    this.roundsCount = this.rounds.length;
    this.tablesCount = 0;
    this.tablesCount = this.rounds[0].length;
    this.roundData = this.rounds[this.round];
    this.form = new UntypedFormGroup({});
    this.robin2Player = {};

    const rnd1 = this.rounds[0];
    for (let tbl = 1; tbl <= this.tablesCount; tbl++) {
      const plsForTable = this.playerList.filter(r => r.table === tbl.toString());
      const rndTbl = rnd1[tbl - 1];
      if (plsForTable.length > 0) {
        this.robin2Player[rndTbl[0]] = plsForTable[0];
      }
      if (plsForTable.length > 1) {
        this.robin2Player[rndTbl[1]] = plsForTable[1];
      }
    }

    for (let pId = 1; pId <= this.playersCount; pId++) {
      const id = `p${pId}`;
      this.form.addControl(id, new UntypedFormControl(this.robin2Player[pId]));
    }
  }

  setRound(by: number) {
    this.round += by;
    this.roundData = this.rounds[this.round];
  }

  save() {
    const str = JSON.stringify(this.form.value);
    localStorage.setItem('robinsimpleform', str);
  }

  loadPlayers() {
    this.playerList = this.service.getRobinNames().filter(r => r.table);
    this.playerNames = {};
    this.playerList.forEach(element => {
      this.playerNames[element.id] = element;
    });
    this.playersCount = this.playerList.length;

  }

  onSwipeLeft(event: any) {
    if (this.round < this.roundsCount - 1) {
      this.setRound(1)
    }
  }

  onSwipeRight(event: any) {
    if (this.round > 0) {
      this.setRound(-1)
    }

  }

}
