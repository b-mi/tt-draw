import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DialogOneStringComponent } from '../dialog-one-string/dialog-one-string.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../translate.pipe';
import { NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RobinPlayer } from '../player.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  imports: [MatToolbarModule, MatIconModule, RouterModule, MatTooltipModule,
    TranslatePipe, NgClass, MatMenuModule, MatDividerModule, MatButtonModule,
    DragDropModule
  ]
})
export class PlayersComponent implements OnInit {

  private readonly splitStorageKey = 'tt-players-split';

  loaded = false;
  tonightPool: RobinPlayer[] = [];
  others: RobinPlayer[] = [];
  tableCount = 3;
  tonightPaneHeight = 280;

  constructor(public service: AppService, public dialog: MatDialog) {
  }

  ngOnInit() {
    const all = this.service.ensureSitOutPlayer(this.service.getRobinNames());
    this.tableCount = this.service.getTableCount(3);
    this.splitLists(this.tableCount, all);
    this.restorePaneHeight();
    this.loaded = true;
  }

  get poolSize(): number {
    return this.tableCount * 2;
  }

  get emptySlotCount(): number {
    return Math.max(0, this.poolSize - this.tonightPool.length);
  }

  splitLists(tblCount: number, all?: RobinPlayer[]) {
    const list = all ?? this.mergeLists();
    const size = tblCount * 2;

    const pool: RobinPlayer[] = [];
    const poolIds = new Set<number>();

    for (const p of list) {
      if (pool.length >= size) {
        break;
      }
      if (this.service.isActiveInDraw(p)) {
        pool.push(p);
        poolIds.add(p.id);
      }
    }

    this.tonightPool = pool;
    this.others = list.filter(p => !poolIds.has(p.id));
    this.syncTablesFromOrder();
  }

  mergeLists(): RobinPlayer[] {
    return [...this.tonightPool, ...this.others];
  }

  assignTables() {
    this.syncTablesFromOrder();
  }

  private syncTablesFromOrder() {
    this.tonightPool.forEach(p => { p.table = ''; });
    this.others.forEach(p => { p.table = ''; });

    for (let i = 0; i < this.tonightPool.length && i < this.poolSize; i++) {
      this.tonightPool[i].table = (Math.floor(i / 2) + 1).toString();
    }
    this.persist();
  }

  persist() {
    this.service.saveRobinNames(this.mergeLists());
  }

  save() {
    this.persist();
  }

  isSitOut(player: RobinPlayer): boolean {
    return this.service.isSitOut(player);
  }

  setTblCount(tblCount: number) {
    this.tableCount = tblCount;
    this.service.saveTableCount(tblCount);
    const newSize = tblCount * 2;
    if (this.tonightPool.length > newSize) {
      const moved = this.tonightPool.splice(newSize);
      const sitOutIdx = this.others.findIndex(p => this.service.isSitOut(p));
      if (sitOutIdx >= 0) {
        this.others.splice(sitOutIdx, 0, ...moved);
      } else {
        this.others.unshift(...moved);
      }
    }
    this.assignTables();
  }

  dropTonight(event: CdkDragDrop<RobinPlayer[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.tonightPool, event.previousIndex, event.currentIndex);
    this.assignTables();
  }

  demote(index: number) {
    if (index < 0 || index >= this.tonightPool.length) {
      return;
    }
    const [player] = this.tonightPool.splice(index, 1);
    const sitOutIdx = this.others.findIndex(p => this.service.isSitOut(p));
    if (sitOutIdx >= 0) {
      this.others.splice(sitOutIdx, 0, player);
    } else {
      this.others.unshift(player);
    }
    this.assignTables();
  }

  promote(player: RobinPlayer) {
    const idx = this.others.indexOf(player);
    if (idx < 0) {
      return;
    }

    if (this.tonightPool.length >= this.poolSize) {
      const last = this.tonightPool.pop()!;
      this.others.splice(idx, 1);
      this.tonightPool.push(player);
      const sitOutPos = this.others.findIndex(p => this.service.isSitOut(p));
      if (sitOutPos >= 0) {
        this.others.splice(sitOutPos, 0, last);
      } else {
        this.others.push(last);
      }
    } else {
      this.others.splice(idx, 1);
      this.tonightPool.push(player);
    }
    this.assignTables();
  }

  delete(player: RobinPlayer) {
    if (this.isSitOut(player)) {
      return;
    }
    this.openDlg('deletePlayer', '', 'delete', player.name).subscribe(delName => {
      if (delName) {
        const inTonight = this.tonightPool.indexOf(player);
        if (inTonight >= 0) {
          this.tonightPool.splice(inTonight, 1);
        } else {
          const inOthers = this.others.indexOf(player);
          if (inOthers >= 0) {
            this.others.splice(inOthers, 1);
          }
        }
        this.assignTables();
      }
    });
  }

  edit(player: RobinPlayer) {
    if (this.isSitOut(player)) {
      return;
    }
    this.openDlg('editPlayer', '', 'save', player.name).subscribe(updName => {
      if (updName) {
        player.name = updName;
        this.persist();
      }
    });
  }

  add() {
    this.openDlg('newPlayer', '', 'save', '').subscribe(newName => {
      if (newName) {
        const all = this.mergeLists();
        const ids = all.map(o => o.id);
        const max = ids.length > 0 ? Math.max.apply(Math, ids) : 0;
        const newRow: RobinPlayer = { name: newName, id: max + 1 };
        this.others.unshift(newRow);
        this.persist();
      }
    });
  }

  startPaneResize(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    const startY = this.pointerY(event);
    const startHeight = this.tonightPaneHeight;

    const onMove = (e: MouseEvent | TouchEvent) => {
      this.tonightPaneHeight = this.clampPaneHeight(startHeight + this.pointerY(e) - startY);
    };

    const onEnd = () => {
      document.removeEventListener('mousemove', onMove as EventListener);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove as EventListener);
      document.removeEventListener('touchend', onEnd);
      localStorage.setItem(this.splitStorageKey, String(this.tonightPaneHeight));
    };

    document.addEventListener('mousemove', onMove as EventListener);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove as EventListener, { passive: false });
    document.addEventListener('touchend', onEnd);
  }

  private restorePaneHeight() {
    const saved = localStorage.getItem(this.splitStorageKey);
    if (saved) {
      const height = parseInt(saved, 10);
      if (!isNaN(height)) {
        this.tonightPaneHeight = this.clampPaneHeight(height);
        return;
      }
    }
    this.tonightPaneHeight = this.defaultPaneHeight();
  }

  private defaultPaneHeight(): number {
    return Math.round((window.innerHeight - 64) * 0.45);
  }

  private clampPaneHeight(height: number): number {
    const max = window.innerHeight - 64 - 100;
    return Math.max(100, Math.min(max, height));
  }

  private pointerY(event: MouseEvent | TouchEvent): number {
    return 'touches' in event ? event.touches[0].clientY : event.clientY;
  }

  openDlg(title: string, subtitle: string, okTitle: string, stringData: string): Observable<string | undefined> {
    const dialogRef = this.dialog.open(DialogOneStringComponent, {
      width: '290px',
      data: { title: title, subtitle: subtitle, okTitle: okTitle, name: stringData }
    });
    return dialogRef.afterClosed();
  }
}
