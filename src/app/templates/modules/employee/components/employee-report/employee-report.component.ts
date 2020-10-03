import { Component, OnInit, Input, Output, EventEmitter, Optional, Inject } from "@angular/core";
import { EmployeeService } from "../../services/employee.service";
import { CommonService } from "../../../../../core/common/_services/common.service";

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


export interface UsersData{
  employeecode:string;
  date:string;
}

@Component({
  selector: "app-employee-report",
  templateUrl: "./employee-report.component.html",
  styleUrls: ["./employee-report.component.scss"]
})
export class EmployeeReportComponent implements OnInit {
  model: any = {};
  //@Output() closeDailyReport: EventEmitter<any> = new EventEmitter<any>();
  @Input() dailyReportItem: any;
  @Input() getDailyReportDetail: any;
  isSaveDailyReport: boolean = false;
  dailyReportList:any = [];
  btnlabel: any;
  employeecode: any;
  @Input() fromParent: UsersData;
  
  constructor(
    private employeeService: EmployeeService,
    public commonService: CommonService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,    
  ) {

  }

  ngOnInit() { 
    this.getDailyReportLists();
  }

  getDailyReportLists(){  
    this.employeecode = this.fromParent.employeecode;
    this.model.employeecode = this.employeecode;
    //this.model.employeecode = this.dailyReportItem.employeecode;
    this.model.date = this.commonService.getTodayDate();
    let msg = '';
    this.employeeService.getTodayReportLists(this.model)
    .subscribe(
      data => {
        this.dailyReportList = data;
        if(this.dailyReportList.length > 0){
          this.model.report = this.dailyReportList[0].report;
          this.btnlabel = "Update";
          this.model.msg = 'Daily report has been updated Successfully';
        }else{
          setTimeout(() => { 
            this.model.report = this.getDailyReportDetail !== undefined ? this.getDailyReportDetail.report: '';
            this.btnlabel = "Save";
            this.model.msg = 'Daily report has been added Successfully';
          }, 600);
        }
      },
      error => {  }
    );
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  dailyReportClose() { 
    this.activeModal.close();
    //this.closeDailyReport.emit(false);
  }

  saveDailyReport() { 
    //this.model.employeecode = this.dailyReportItem.employeecode;
    this.model.type = this.getDailyReportDetail === undefined ? 'save': 'update';
    this.model.date = this.commonService.getTodayDate();
    this.isSaveDailyReport = true;
    if (this.model.report !== '') { 
          this.employeeService.saveDailyReport(this.model).subscribe((res: any) => {
          this.commonService.getSuccessErrorMsg(res,this.model.msg);
          if (res === null) {
            this.dailyReportClose();
          }
        });
      } 
  
  }
}
