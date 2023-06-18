import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CsvDownloadService {

  constructor() { }

  export(header: string[], data: any[], fileName: string): void {
    const replacer = (key, value) => value === null ? '' : value;

    const csv: string[] = data.map((row: any) => header.map(fieldName => {
        const fieldNames = fieldName.split('.');
        if (fieldNames.length === 2) {
          return JSON.stringify(row[fieldNames[0]][fieldNames[1]], replacer);
        }
        if (fieldNames.length === 3) {
          return JSON.stringify(row[fieldNames[0]][fieldNames[1]][fieldNames[2]], replacer);
        }
        if (fieldNames.length === 4) {
          return JSON.stringify(row[fieldNames[0]][fieldNames[1]][fieldNames[2]][fieldNames[3]], replacer);
        }
        return JSON.stringify(row[fieldNames[0]], replacer);
    }).join(','));

    csv.unshift(header.join(','));
    const csvArray = '\ufeff'+csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, fileName);
  }
}
