import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { SalesService } from '../../services/sales.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  MatDialog,
  MatDialogConfig,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { SalesorderComponent } from "../salesorder/salesorder.component";
import { SalesCreateInvoiceComponent } from "./../sales-create-invoice/sales-create-invoice.component";
import { SalesCreateReturnComponent } from '../sales-create-return/sales-create-return.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'promotionlist',
  styleUrls: ['./promotionlist.component.scss'],
  templateUrl: './promotionlist.component.html', 
})
export class PromotionListComponent {
  model: any = {};
  promotionList: any = {};

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(){
    this.getpromotionList();
  }

  getpromotionList(){
    let discount="all"
    this.salesService.loadPromotion(discount)
    .subscribe(
      data => {
        this.promotionList = data;
      },
      error => {
        setTimeout(() => {
          this.snackBar.open("Network error: server is temporarily unavailable", "", {
            panelClass: ["error"],
            verticalPosition: 'top'      
          });
        });  
      }
    );
  }

  closeModal() {
    this.activeModal.close();
  }

}

@Component({
  selector: "app-saleslist",
  templateUrl: "./sales-list.component.html",
  styleUrls: [
    "./sales-list.component.scss"
  ],
  // providers: [NgbModalConfig, NgbModal]
})
export class SalesListComponent implements OnInit, OnDestroy {
  salesOrderList: any;
  dialogConfig = new MatDialogConfig();
  prodArr = [];
  isCheckedArr = [];
  customerArr = [];
  isCreateReturn: boolean = false;
  isDeleteButton: boolean = false;
  isCreateInvoice: boolean = false;
  isShowEditDelete = [];
  isAddSalesOrder: boolean = false;
  isCustomerErrMsg: boolean = false;
  isSortStatusDesc: boolean = false;
  isSortStatusAsc: boolean = true;
  isSortDateDesc: boolean = false;
  isSortDateAsc: boolean = true;
  title: string = "";
  button: string = "";
  checkedInfo: any;

  public salesTable = false;
  soreturnList: any = {};
  filtersalesList: any = {};

  salesInvoiceList:any = {};
  salesReturnList:any = {};
  model:any = {};

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    config: NgbModalConfig, 
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.isCheckedArr = [];
    this.getSalesOrderLists();
   // this.removeScrollBar();
  }

  ngOnDestroy() {
    (<HTMLElement>(
      document.querySelector(".mat-drawer-content")
    )).style.overflow = "auto";
  }

 /* removeScrollBar() {
    setTimeout(function () {
      (<HTMLElement>(
        document.querySelector(".mat-drawer-content")
      )).style.overflow = "inherit";
    }, 300);
  } */
  getDeleteButtonStyle() {
    if (!this.isDeleteButton) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getCreateReturnStyle() {
    if (!this.isCreateReturn) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getCreateInvoiceStyle() {
    if (!this.isCreateInvoice) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }

  getAddSalesOrderStyle() {
    if (this.isAddSalesOrder) {
      let myStyles = {
        color: "gray",
        background: "#1A2D39",
        border: "1px solid #1A2D39",
        display: "none",
      };
      return myStyles;
    }
  }
  
  getSalesOrderLists() {
    this.salesService.getSalesOrderLists().subscribe(
      (res: []) => {
        this.salesOrderList = res;
        this.filtersalesList = this.salesOrderList;
        if(this.salesOrderList.length == 0){
          this.salesTable = false;
        }else{
          this.salesTable = true;
        }
      },
      (error) => {
        setTimeout(() => {
          this.snackBar.open(
            "Network error: server is temporarily unavailable",
            "",
            {
              panelClass: ["error"],
              verticalPosition: "top",
              duration: undefined
            }
          );
        });
      }
    );
  }

  rowSelected(index: number, item: any, isChecked: boolean) {
    this.checkedInfo = isChecked;
    if (isChecked) {
      item.indexVal = index;
      this.prodArr.push(item);
      this.isCheckedArr.push({ checked: true, indexVal: index });
      this.customerArr.push({ customerName: item.customername, indexVal: index });
      this.isShowEditDelete[index] = false;
    } else {
      this.removeItem(this.isCheckedArr, index, "checked");
      this.removeItem(this.prodArr, index, "product");
      this.removeItem(this.customerArr, index, "customer");
    }

    if (this.prodArr.length > 0) {
      this.isAddSalesOrder = true;
      this.prodArr.forEach((item, index) => {
        const status = item.status;
        const customerName = item.customername;
        if (this.prodArr.length > 1) {
          this.isCreateReturn = false;
          if (status !== "Invoiced" && status !== "Returned") {
            let getCustomerName = "";
            this.customerArr.forEach((item, indexCheck) => {
              if (indexCheck > 0) {
                getCustomerName = this.customerArr[indexCheck - 1].customerName;
                if (customerName !== getCustomerName) {
                  this.isCreateInvoice = false;
                  this.isDeleteButton = false;
                  this.getErrorMsg(true);
                } else {
                  this.isDeleteButton = true;
                  this.isCreateInvoice = true;
                  this.isCreateReturn = false;
                  this.getErrorMsg(false);
                }
              }
            });
          }else if (status !== "Returned" && status !== "Open") {
            setTimeout(() => {
              this.snackBar.open("You need to select only one Invoice", "", {
                panelClass: ["warn"],
                verticalPosition: "top",
              });
            });
          } else {
            this.isDeleteButton = false;
            this.isCreateInvoice = false;
          }
        } else {
          this.isDeleteButton = false;
          this.getErrorMsg(false);
          if (status === "Open" && this.isCheckedArr[0].checked) {
            this.isCreateInvoice = true;
          } else {
            this.isCreateInvoice = false;
          }
          if (status === "Invoiced" && this.isCheckedArr[0].checked) {
            this.salesService.loadReturn()
              .subscribe(res => { 
                this.soreturnList = res;
                if(this.soreturnList.length == 0){
                  this.isCreateReturn = true;
                }else{
                  for(let i=0; i<this.soreturnList.length; i++){
                    if(this.soreturnList[i].socode == this.prodArr[0].socode ){
                      this.isCreateReturn = false;
                      setTimeout(() => {
                        this.snackBar.open("Sales was Returned already.", "", {
                          panelClass: ["warn"],
                          verticalPosition: "top",
                          duration: undefined
                        });
                      });
                      break;  
                    }else{
                      this.isCreateReturn = true;
                    }
                  }
                }
                                
              },
              error => { }
            );
          } else {
            this.isCreateReturn = false;
          }
        }
      });
    } else {
      this.isCreateInvoice = false;
      this.isCreateReturn = false;
      this.isDeleteButton = false;
      this.isAddSalesOrder = false;
    }
  }
 
  addSalesOrder(id: string, item: any) {
    const modalRef = this.modalService.open(SalesorderComponent, { windowClass: 'modal-class'});

    let data: any;
    if (id !== null) {
      this.title = "Edit Sales Order";
      this.button = "Update";
      item.dialogTitle = this.title;
      item.dialogText = this.button;
      item.selected = false;
      item.selected = true;
      data = item;
    } else {
      this.title = "Add Sales Order";
      this.button = "Add Cart";
      data = { dialogTitle: this.title, dialogText: this.button };
    }

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      //this.getSalesOrderLists();
    }, (reason) => {
      this.getSalesOrderLists();
    }); 
    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      top: "1000",
      left: "100",
    };
    let dialogRef = this.dialog
      .open(SalesorderComponent, {
        panelClass: "addpromotion",
        width:'200vh',
        //height:'400vh',
        data: data,
        disableClose: true,
       // hasBackdrop: true
      })
      dialogRef.backdropClick().subscribe(result => {
        console.log('Sales Order backdropClick');
        this.ngOnInit();
      });                
      dialogRef.afterClosed().subscribe(result => {
        console.log('The Sales Order dialog was closed');
        this.ngOnInit();
      }); */
      this.checkedInfo.target.checked = false;
      this.isAddSalesOrder = true;
  }

  getErrorMsg(isErrMsg: boolean) {
    // console.log('isErrMsg', isErrMsg)
    if (isErrMsg) {
      setTimeout(() => {
        this.snackBar.open("Select only one customer", "", {
          panelClass: ["warn"],
          verticalPosition: "top",
        });
      });
    } else {
      return "";
    }
  }

  removeItem(isCheckedArr: any, index: number, type: string) {
    // console.log('isCheckedArr', isCheckedArr)
    // console.log('index12', index)
    isCheckedArr.forEach((item, indexCheck) => {
      // console.log('indexVal', item.indexVal)
      // console.log('index', index)
      if (item.indexVal === index) {
        isCheckedArr.splice(indexCheck, 1);
      }
    });

    if (type === "checked") {
      this.isCheckedArr = isCheckedArr;
    } else if (type === "product") {
      this.prodArr = isCheckedArr;
    } else {
      this.customerArr = isCheckedArr;
    }
  }

  sortByOrder(column: string, order: string) {
    if (column === "status" && order === "desc") {
      this.isSortStatusDesc = true;
      this.isSortStatusAsc = false;
      this.salesOrderList.sort((a, b) => b.status.localeCompare(a.status));
    } else if (column === "status" && order === "asc") {
      this.isSortStatusDesc = false;
      this.isSortStatusAsc = true;
      this.salesOrderList.sort((a, b) => a.status.localeCompare(b.status));
    } else if (column === "date" && order === "desc") {
      this.isSortDateDesc = true;
      this.isSortDateAsc = false;
      this.salesOrderList.sort((a, b) => b.date.localeCompare(a.date));
    } else {
      this.isSortDateDesc = false;
      this.isSortDateAsc = true;
      this.salesOrderList.sort((a, b) => a.date.localeCompare(b.date));
    }
  }

  removeSalesOrder(id: string) {
    this.salesService.removeSalesOrder(id).subscribe((data: any) => {
      if (data === null) {
        setTimeout(() => {
          this.snackBar.open(
            "Sales order has been deleted successfully",
            "",
            {
              panelClass: ["success"],
              verticalPosition: "top",
            }
          );
        });
        this.getSalesOrderLists();
      } else if (data === 500) {
        setTimeout(() => {
          this.snackBar.open("Internal server error", "", {
            panelClass: ["error"],
            verticalPosition: "top",
          });
        });
      } else {
        setTimeout(() => {
          this.snackBar.open("Bad request data", "", {
            panelClass: ["error"],
            verticalPosition: "top",
          });
        });
      }
    });
  }

  createInvoice() {
    let data: any;
    data = {
      dialogPaneTitle: "Sales Orders",
      dialogInvoiceTitle: "Create Invoice",
      dialogText: "Add",
      invoiceItems: this.prodArr,
      customerName: this.prodArr[0].customername,
      date: new Date()
    };

    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
      top: "1000",
      left: "100",
    };

    let dialogRef = this.dialog.open(SalesCreateInvoiceComponent, {
      height: "400px",
      width: "600px",
      panelClass: "purchaseCreateInvoice",
      data: data,
    })
    dialogRef.backdropClick().subscribe(result => {
      console.log('Sales Invoice backdropClick');
      this.ngOnInit();
    });                
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Sales Invoice dialog was closed');
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].socode);
      this.prodArr.splice(indexx, 1);
      this.isCreateInvoice = false;
      this.isDeleteButton = false;
      this.isAddSalesOrder = true; 
    });
    this.checkedInfo.target.checked = false;
    this.isAddSalesOrder = true;
  }

  createReturn() {
    console.log("createReturn");
    const modalRef = this.modalService.open(SalesCreateReturnComponent, { windowClass: 'modal-class'});
    let data: any;
    data = {
      customername: this.prodArr[0].customername,
      customercode: this.prodArr[0].customercode,
      productname: this.prodArr[0].productname,
      invqty: this.prodArr[0].qty,
      date: this.prodArr[0].date,
      subtotal: this.prodArr[0].subtotal,
      socode: this.prodArr[0].socode
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      /* this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].socode);
      this.prodArr.splice(indexx, 1);
      this.isCreateReturn = false;
      this.isAddSalesOrder = true; */
    }, (reason) => {
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].socode);
      this.prodArr.splice(indexx, 1);
      this.isCreateReturn = false;
      this.isAddSalesOrder = true;
    }); 
    /* this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.position = {
    };

    let dialogRef = this.dialog.open(SalesCreateReturnComponent, {
      panelClass: "purchaseCreateReturn",
      width:'120vh',
      //height:'200vh',
      data: data,
    })
    dialogRef.backdropClick().subscribe(result => {
      console.log('Sales Return backdropClick');
      this.ngOnInit();
    });                
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Sales Return dialog was closed');
      this.ngOnInit();
      let indexx = this.prodArr.indexOf(this.prodArr[0].socode);
      this.prodArr.splice(indexx, 1);
      this.isCreateReturn = false;
      this.isAddSalesOrder = true; 
    }); */
    this.checkedInfo.target.checked = false;
    this.isAddSalesOrder = true;
  }

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    this.salesOrderList = this.filtersalesList.filter(sales =>
    sales.customername.toLowerCase().indexOf(searchValue.toLowerCase()) !==-1)
  }

  
  salesflow(detailContent,item: any){
    this.model.type = '';
    this.model.rettype = '';
    this.model.invoicedate = '';
    this.model.returndate = '';
    this.model.orderdate = '';

    this.model.status = item.status;
    this.model.orderdate = item.date;

    if(item.status == "Invoiced"){

      this.salesService.loadInvoice().subscribe(
        (res) => {
          this.salesInvoiceList = res;
          if(this.salesInvoiceList.length > 0){
            for(let i=0; i<this.salesInvoiceList.length; i++){
              if(item.invoicenumber === this.salesInvoiceList[i].invoicenumber){
                this.model.invoicedate = this.salesInvoiceList[i].invoicedate;
                this.model.type = "Invoice";
              }
            }
          }
        },
        (error) => {  });

    }
    
    if(item.status == "Returned"){

      this.salesService.loadInvoice().subscribe(
        (res) => {
          this.salesInvoiceList = res;
          if(this.salesInvoiceList.length > 0){
            for(let i=0; i<this.salesInvoiceList.length; i++){
              if(item.invoicenumber === this.salesInvoiceList[i].invoicenumber){
                this.model.invoicedate = this.salesInvoiceList[i].invoicedate;
                this.model.type = "Invoice";
              }
            }
          }
        },
        (error) => {  });

      this.salesService.loadReturn().subscribe(
        (res) => {
          this.salesReturnList = res;
          if(this.salesReturnList.length > 0){
            for(let i=0; i<this.salesReturnList.length; i++){
              if(item.socode == this.salesReturnList[i].socode){
                this.model.returndate = this.salesReturnList[i].createddate;
                this.model.rettype = "Return";
              }
            }
          }
        },
        (error) => {  });

    }

    this.modalService.open(detailContent, { windowClass: 'modal-class'});

  }

  getPromotion(){
    const modalRef = this.modalService.open(PromotionListComponent, { windowClass: 'promotion-class'});
    let data: any;
    data = {
      customername: this.prodArr[0].customername,
    };

    modalRef.componentInstance.fromParent = data;
  }

}
