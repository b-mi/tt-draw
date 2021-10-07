import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
declare var require: any
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  robin: any;
  rounds = [];
  round = 0;
  roundsCount = 0;
  playersCount = 8;
  tablesCount = 0;
  roundData = [];
  // playerNames: { [pid: string]: string } = {};
  playerNames = {};
  playerList = [];

  robin2Player = {};
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: AppService) { }

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
    this.form = new FormGroup({});
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
      this.form.addControl(id, new FormControl(this.robin2Player[pId]));
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

  onSwipeLeft(event) {
    if (this.round < this.roundsCount - 1) {
      this.setRound(1)
    }
  }

  onSwipeRight(event) {
    if (this.round > 0) {
      this.setRound(-1)
    }

  }

}
