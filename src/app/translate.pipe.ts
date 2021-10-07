import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from './app.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  dct: { [id: string]: string[] } = {};

  /**
   *
   */
  constructor(private service: AppService) {
    this.dct.title = ['TT Matches', 'TT zápasy'];
    this.dct.matches = ['Matches', 'Zápasy'];
    this.dct.tablesCount = ['Tables count', 'Počet stolov'];
    this.dct.addPlayer = ['Add player', 'Pridať hráča'];
    this.dct.theme = ['Dark theme', 'Tmavá téma'];
    this.dct.fullScreen = ['Full screen', 'Na celú obrazovku'];
    this.dct.source = ['Source', 'Zdrojáky'];
    this.dct.deletePlayer  = ['Delete player', 'Zmazať hráča'];
    this.dct.editPlayer  = ['Edit player', 'Editovať hráča'];
    this.dct.selectPlayers  = ['Select players', 'Vybrať hráčov'];
    this.dct.forward  = ['Next round', 'Ďalšie kolo'];
    this.dct.back  = ['Previous round', 'Predošlé kolo'];
    this.dct.cancel  = ['Cancel', 'Naspäť'];
    this.dct.name  = ['Name', 'Meno'];
    this.dct.save  = ['Save', 'Uložiť'];
    this.dct.delete = ['Delete', 'Zmazať'];
    this.dct.newPlayer = ['New player', 'Nový hráč'];

    //    this.dct. = ['', ''];

    

  }

  transform(value: string, ...args: unknown[]): string {
    const kv = this.dct[value];
    if( !kv )
      return value;
    return this.dct[value][this.service.langId];
  }

}
