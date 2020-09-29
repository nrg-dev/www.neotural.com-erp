import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import {MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/common/_services';
import { HeaderComponent } from 'src/app/core/components/header/header.component';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit, AfterViewInit {
  headComp;
  model: any = {};
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  constructor( 
    private authenticationService:AuthenticationService,
    private employeeService: EmployeeService,   
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
    ) { }
  ngOnInit() {
    this.headComp = new HeaderComponent(null,null,null);
    console.log("Add employee");
    //this.addEmplyeeFields();
  }

  ngAfterViewInit() {
    (<HTMLElement>document.querySelector('.mat-dialog-container')).style.background = 'inherit';
   }

  cancelEmployee(){}

  saveEmployee() { 

    this.model.profilepic=this.cardImageBase64;
    this.employeeService.save(this.model)
      .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Success! Register Employee", "", {
            panelClass: ["success"],
            verticalPosition: 'top',
            duration: undefined    
          });
          this.headComp.loadIndexValue();
        });
        this.modalService.dismissAll();
        // this.addEmployeeClose();
      // .. this.employeeService.load();
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

  // addEmployeeClose() {
  //   this.dialogRef.close();
  // }

  resetEmployeeRegistrationForm(form: FormGroup) {
     form.reset();
    // this.model.name = '';
    // this.model.rank = '';
    // this.model.phonenumber = '';
    // this.model.address = '';
    // this.model.email = '';
    // this.model.dob = '';
    // this.model.contractnumber = '';
    // this.model.npwp = '';
    // this.model.bpjs = '';
    // this.model.monthlysalary = '';
    // this.model.workHour = '';
    // this.model.annualLeave = '';
    // this.model.departmentname = '';
    // this.model.location = '';
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 1200;
        const max_width = 600;

        if (fileInput.target.files[0].size > max_size) {
          this.imageError =
              'Maximum size allowed is ' + max_size / 1000 + 'Mb';
          return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
          this.imageError = 'Only Images are allowed ( JPG | PNG )';
          return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
            this.imageError =
                'Maximum dimentions allowed ' +
                max_height +
                '*' +
                max_width +
                'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
          }
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  closeModal() {
    this.activeModal.close();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  
}
