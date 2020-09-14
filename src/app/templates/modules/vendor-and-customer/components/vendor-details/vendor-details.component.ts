import { Component, Inject, ElementRef, OnInit, HostListener, ViewChild, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from "@angular/material/snack-bar";

import { AddnewproductComponent } from './../addnewproduct/addnewproduct.component';
import { VendorDetailsService } from './../../services/vendorDetails.service';
import { Vendor } from 'src/app/core/common/_models';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductSlideComponent } from './../productslide/productslide.component';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  @ViewChild('dropDwn', {static:true}) dropDwn:ElementRef;

  allCategoryItems = [];
  backAllCategoryItems = [];
  filteredItems = [];
  categoriesForFilter:any = [];
  selectedCategoryInFilter:any;
  dropDownView = false;
  selectedCategory = "All Category";
  editIndex = -1;
  onEdit = -1;
  isLabelEdited = false;
  labelNewText="";
  isAddCategory = false;
  newCateogry = "";
  vendor:Vendor = new Vendor;
  prodheaderlabel:any;
  prodbtnlabel:any;
  allproduclist: any = {};
  model: any = {};

  @HostListener('document:click', ['$event']) closeNaviOnOutClick(event) {

    const parent = this.dropDwn.nativeElement;

    if(parent.contains(event.target)){
      return;
    }

    if(this.dropDownView) {
      this.dropDownView = false;
      this.isAddCategory = false;
    }
    return;
  }

  constructor(
    private dialogRef: MatDialogRef<VendorDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private _sanitizer: DomSanitizer,
    private vendorDetailsService:VendorDetailsService,
    private snackBar: MatSnackBar,
    config: NgbModalConfig, private modalService: NgbModal,

    ) {
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
    console.log("Data e-->"+this.data);
    console.log("Vendor code-->"+this.data['vendorcode']);
     this.vendorDetailsService.loadsidepanel(this.data.vendorcode).subscribe(data => {
       console.log(data);
       this.data.editable = false;
     })
    let id = this.data['vendorcode'];
    this.vendorDetailsService.loadallcategoryitems(id).subscribe((data:any) => {
        if(!data.length) return;
        this.backAllCategoryItems = data;
        this.filterItems({ categorycode:null});
    })

    this.getCategoryItems();

  }
  
  getCategoryItems() {
    this.vendorDetailsService.loadallcategories().subscribe((data: any) => {
      this.categoriesForFilter = data;
    });
  }


  searchItems(event) {

    const searchPhrase = String(event.target.value).trim().toLocaleLowerCase();
    const itemsToSearch = this.filteredItems || [];

    const searchResult = itemsToSearch.filter((item) => {
      return String(item.productname).trim().toLocaleLowerCase().includes(searchPhrase);
    });

    this.allCategoryItems = searchResult;
  }

  filterItems({ categorycode }) {

    if(!categorycode){
      this.allCategoryItems = this.backAllCategoryItems;
      this.filteredItems = this.backAllCategoryItems;
      return;
    }
    this.allCategoryItems = this.backAllCategoryItems.filter((item) => item.categorycode === categorycode);
    this.filteredItems = this.allCategoryItems;
  }

  vendorDetailsClose(): void {
    this.dialogRef.close();
  }

  categoyDropDownHandler():void {
    this.dropDownView = !this.dropDownView;
    this.editMenu(-1);
    this.isLabelEdited = false;
  }

  selectCategory(item):void {
    this.dropDownView = false;
    this.selectedCategory = item.name;
    this.filterItems(item);
  }

  showEditMenu(index){
    this.editIndex = index;
  }

  editMenu(i){
    this.onEdit = i;
    this.dropDownView = true;
    this.isAddCategory = false;
    this.newCateogry = "";
  }

  menuLabelChange(event){

    if (!event.target.value.trim()) {
      this.isLabelEdited = false;
      this.labelNewText = "";
      return;
    }
    this.isLabelEdited = true;
    this.labelNewText = event.target.value;
    
  }

  updateMenu(category){
    const newCategory = {
      "categorycode": category.categorycode,
      "name": this.labelNewText,
    }
    this.categoyDropDownEditor(newCategory);
    this.dropDownView = false;
  }

  showAddCategory() {
    this.isAddCategory = true;
    this.editIndex = -1;
    this.onEdit = -1;
  }

  addCategory() {

    if (!this.newCateogry.trim().length) return;
    
    const newCategory = {
      "name": this.newCateogry
    }

    this.categoyDropDownEditor(newCategory);
    
  }

  getImage(imgData) {
    if (Array.isArray(imgData)){
      return this._sanitizer.bypassSecurityTrustResourceUrl(imgData[0]);
    }    
  }

  categoyDropDownEditor(newCategory){
    this.vendorDetailsService.postnewcategories(newCategory)
      .subscribe((respose) => {
        if (respose === null) {

          this.getCategoryItems();
          this.newCateogry = "";
          this.dropDownView = false;
          this.isAddCategory = false;

          setTimeout(() => {
            this.snackBar.open(
              "Category added Successfully",
              "",
              {
                panelClass: ["success"],
                verticalPosition: "top",
              }
            );

          });
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
              }
            );
          });
        })
  }

  editVendor(data: any){
    data.editable = !data.editable;
  }

  update(data: any){
    this.vendorDetailsService.updateVendor(data)
		.subscribe(
			data => {
				this.vendor =  data; 
				setTimeout(() => {
					this.snackBar.open("Vendor Updated Successfully", "", {
						panelClass: ["success"],
						verticalPosition: 'top'      
					});
				});
				this.ngOnInit();
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

  cancelVendor(data: any){
    data.editable = false;
  }

  deleteVendor(vendorcode:string) {
    this.vendorDetailsService.removeVendor(vendorcode)
    .subscribe(
      data => {
        setTimeout(() => {
          this.snackBar.open("Vendor Removed Successfully", "", {
            panelClass: ["success"],
            verticalPosition: 'top'      
          });
        });
        this.vendorDetailsClose();
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

  addProduct(vendata: any){

    this.prodheaderlabel = "Add New Product";
    this.prodbtnlabel = "Add";
    let data = { prodheaderlabel: this.prodheaderlabel, prodbtnlabel: this.prodbtnlabel,vendorcode: vendata.vendorcode, vendorName: vendata.vendorName }
    
    const modalRef = this.modalService.open(AddnewproductComponent, { windowClass: 'addproduct-class'});
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      //this.ngOnInit();
    }, (reason) => {
      this.ngOnInit();
    }); 
  }

  slideshow(vendorcode:string,prodcode:string){    
    this.vendorDetailsService.loadEditItem(vendorcode)
    .subscribe(
      data => {
        this.allproduclist = data;
        for(let k=0;k<this.allproduclist.length;k++){
          if(this.allproduclist[k].prodcode==prodcode){
            this.model.productImage=this.allproduclist[k].productImage;
            this.model.productname=this.allproduclist[k].productname;
            this.model.prodcode=this.allproduclist[k].prodcode;
            this.model.categoryname=this.allproduclist[k].categoryname;
            this.model.price=this.allproduclist[k].price;
            this.model.unit=this.allproduclist[k].unit;
            this.model.tax=this.allproduclist[k].tax;
            this.model.margin=this.allproduclist[k].margin;
            this.model.sellingprice=this.allproduclist[k].sellingprice;
            this.model.description=this.allproduclist[k].description;
            this.model.createddate=this.allproduclist[k].createddate;

            let data = { productImage: this.model.productImage,productname: this.model.productname,productcode: this.model.prodcode,
              categoryname: this.model.categoryname,price: this.model.price,unit: this.model.unit,tax: this.model.tax,margin: this.model.margin,
              sellingprice: this.model.sellingprice,description: this.model.description,createddate: this.model.createddate }
            
            const modalRef = this.modalService.open(ProductSlideComponent, { windowClass: 'productsilde-class'});
            modalRef.componentInstance.fromParent = data;
            
          }
        }
      },
      error => {	}
    );
    
  }

}
