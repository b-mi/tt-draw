import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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

  //   displayedColumns: string[] = ['select', 'name', 'table', 'star'];
  //   selection = new SelectionModel<any>(true, []);
  loaded = false;
  names: any[] = [];
  tableCount = 3;
  constructor(public service: AppService, public dialog: MatDialog) {
    this.reload();
    this.tableCount = this.service.getRobinNames().filter(r => r.table).length / 2;
  }

  ngOnInit() {
    this.setTblCount(this.tableCount);
    this.loaded = true;
  }

  reload() {
    this.names = this.service.getRobinNames();
  }

  save() {
    this.service.saveRobinNames(this.names);
    this.reload();
  }

  delete(element: any) {

    this.openDlg('deletePlayer', '', 'delete', element.name).subscribe(delName => {
      if (delName) {
        const index = this.names.indexOf(element, 0);
        if (index > -1) {
          this.names.splice(index, 1);
          this.save();
        }
      }
    });

  }

  edit(element: any) {
    this.openDlg('editPlayer', '', 'save', element.name).subscribe(updName => {
      if (updName) {
        element.name = updName;
        this.save();
      }
    });
  }


  add() {
    this.openDlg('newPlayer', '', 'save', '').subscribe(newName => {
      if (newName) {
        const max = Math.max.apply(Math, this.names.map(function (o) { return o.id; }))
        const newRow = { name: newName, id: max + 1 };
        this.names.push(newRow);
        this.save();
      }
    });

  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.names, event.previousIndex, event.currentIndex);
    this.setTblCount(this.tableCount);
    this.save();
  }

  setTblCount(tblCount: number) {
    this.tableCount = tblCount;
    const len = this.names.length;
    this.names.forEach(nm => nm.table = '');
    for (let index = 0; index < tblCount; index++) {
      const idx1 = index * 2;
      const idx2 = idx1 + 1;
      if (idx1 < len)
        this.names[idx1].table = (index + 1).toString();
      if (idx2 < len)
        this.names[idx2].table = (index + 1).toString();

    }
    this.save();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOneStringComponent, {
      width: '290px',
      data: { title: 'Player name', subtitle: 'sub', okTitle: 'Save', name: 'bbb' }
    });

    dialogRef.afterClosed().subscribe(result => {
      const rtn = result;
    });
  }


  openDlg(title: string, subtitle: string, okTitle: string, stringData: string): Observable<any> {
    const dialogRef = this.dialog.open(DialogOneStringComponent, {
      width: '290px',
      data: { title: title, subtitle: subtitle, okTitle: okTitle, name: stringData }
    });
    return dialogRef.afterClosed();
    dialogRef.afterClosed().subscribe(result => {
      const rtn = result;
    });
  }

  moveTo(fromIdx: number, toTable: number) {
    const toIdx = toTable === 99 ? this.names.length - 1 : (toTable - 1 ) * 2;
    const item = this.names[fromIdx];
    this.names.splice(fromIdx, 1);
    this.names.splice(toIdx, 0, item);
    this.setTblCount(this.tableCount);
    this.save();
  }
}
