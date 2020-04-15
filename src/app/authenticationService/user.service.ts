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
  public exportAsExcelFile(json: any[], excelFileName: string): void {
  /*** 
  *We haven't done anything just yet so let's just pass json in utils.json_to_sheet() for now
  */
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
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
