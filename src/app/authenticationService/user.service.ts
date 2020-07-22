import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
// INITIAL AN EMPTY ARRAY FOR DATA'S CUSTOMIZATION (we'll comeback // to this file in future steps below)
const mappedJson = [];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }
  public exportAsExcelFile(json: any[], json2: any[], json3: any[], json4: any[], json5: any[], json6: any[], excelFileName: string): void {
  /*** 
  *We haven't done anything just yet so let's just pass json in utils.json_to_sheet() for now
  */
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json2);
  const worksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json3);
  const worksheet4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json4);
  const worksheet5: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json5);
  const worksheet6: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json6);
  const workbook: XLSX.WorkBook = { Sheets: { 'Drilling': worksheet,'Services': worksheet2,'Equipment': worksheet3,'Materials Consumed': worksheet4,'Payroll': worksheet5, 'Employees': worksheet6 }, SheetNames: ['Drilling','Services','Equipment','Materials Consumed','Payroll','Employees'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  /***********
  YOUR EXCEL FILE'S NAME
  */
  FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  }


//   var wb = XLSX.utils.book_new();
// for (var i = 0; i < sheetName.length; i++) {
// 	var ws = XLSX.utils.json_to_sheet(dataFinal[i],{skipHeader: 1});
// 	XLSX.utils.book_append_sheet(wb, ws, sheetName[i]);
// }
// XLSX.writeFile(wb, "excel_name.xlsx");