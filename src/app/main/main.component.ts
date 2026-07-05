import { Component, inject, OnInit } from '@angular/core';
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
import { ThemeService } from '../theme.service';
import { MatButtonModule } from '@angular/material/button';
import { VERSION } from '../../version';
import { RobinPlayer } from '../player.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [MatCardModule, FormsModule, MatFormFieldModule, MatDividerModule,
    ReactiveFormsModule, NgClass, MatTooltipModule, TranslatePipe,
    MatIconModule, MatToolbarModule, RouterModule,
    MatButtonModule
  ]
})
export class MainComponent implements OnInit {

  public themeService = inject(ThemeService);
  rounds: any[] = [];
  round = 0;
  roundsCount = 0;
  playersCount = 8;
  tablesCount = 0;
  roundData = [];
  playerNames: { [pid: string]: RobinPlayer } = {};
  // playerNames = {};
  playerList: RobinPlayer[] = [];

  robin2Player: { [key: string]: RobinPlayer } = {};


  form!: UntypedFormGroup;
  version: string = '';
  warningMessage = '';

  constructor(private fb: UntypedFormBuilder, private service: AppService) { }

  ngOnInit() {
    this.version = VERSION;
    this.loadPlayers();
    this.calc();
  }

  cntChanged(event: any) {
    this.playersCount = event.value;
    this.calc();
  }

  calc() {
    this.rounds = this.roundrobin(this.playersCount, []);
    this.roundsCount = this.rounds.length;
    this.tablesCount = 0;
    this.form = new UntypedFormGroup({});
    this.robin2Player = {};

    if (this.rounds.length === 0) {
      this.roundData = [];
      this.checkWarnings();
      return;
    }

    this.tablesCount = this.rounds[0].length;
    this.roundData = this.rounds[this.round];

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

    this.checkWarnings();
  }

  checkWarnings(): void {
    const all = this.service.ensureSitOutPlayer(this.service.getRobinNames());
    const realActive = this.service.getActiveWithTable(all).filter(p => this.service.isRealPlayer(p));
    const sitOutActive = this.service.getActiveWithTable(all).some(p => this.service.isSitOut(p));

    if (realActive.length % 2 === 1 && !sitOutActive) {
      this.warningMessage = 'Presuň sediaceho hráča medzi dnešných a priraď stôl (nepárny počet).';
      console.warn(this.warningMessage);
      return;
    }

    for (const rnd of this.rounds) {
      for (const [a, b] of rnd) {
        if (!this.robin2Player[a] || !this.robin2Player[b]) {
          this.warningMessage = 'Skontroluj usadenie pri stoloch.';
          console.warn(this.warningMessage);
          return;
        }
      }
    }

    this.warningMessage = '';
  }

  isSitOutPlayer(player: RobinPlayer | undefined): boolean {
    return !!player && this.service.isSitOut(player);
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
    const all = this.service.ensureSitOutPlayer(this.service.getRobinNames());
    this.playerList = this.service.getDrawPlayers(all);
    this.playerNames = {};
    this.playerList.forEach(element => {
      this.playerNames[element.id] = element;
    });
    this.playersCount = this.playerList.length;
  }

  onSwipeLeft(event: any) {
    console.log('left');

    if (this.round < this.roundsCount - 1) {
      this.setRound(1)
    }
  }

  onSwipeRight(event: any) {
    console.log('right');
    if (this.round > 0) {
      this.setRound(-1)
    }

  }




  roundrobin(n: number, ps: any[]) {  // n = num players
    const DUMMY = -1;
    const rs: any[] = [];                  // rs = round array
    ps = [];
    for (let k = 1; k <= n; k += 1) {
      ps.push(k);
    }

    if (n % 2 === 1) {
      ps.push(DUMMY); // so we can match algorithm for even numbers
      n += 1;
    }
    for (let j = 0; j < n - 1; j += 1) {
      rs[j] = []; // create inner match array for round j
      for (let i = 0; i < n / 2; i += 1) {
        const o = n - 1 - i;
        if (ps[i] !== DUMMY && ps[o] !== DUMMY) {
          // flip orders to ensure everyone gets roughly n/2 home matches
          const isHome = i === 0 && j % 2 === 1;
          // insert pair as a match - [ away, home ]
          rs[j].push([isHome ? ps[o] : ps[i], isHome ? ps[i] : ps[o]]);
        }
      }
      ps.splice(1, 0, ps.pop()); // permutate for next round
    }
    return rs;
  };


}
