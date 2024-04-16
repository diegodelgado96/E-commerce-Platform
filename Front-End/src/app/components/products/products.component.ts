import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductInterface } from '../../Interfaces/productInterface';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { UtilityService } from '../../Services/utility.service';
import { ProductService } from '../../Services/product.service';
import { SharedModule } from '../../Modules/shared/shared.module';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [
    ProductService
  ]
})
export class ProductsComponent implements OnInit, AfterViewInit{

  columnsTable: string[] = [
    "ProductId",
    "Name",
    "Description",
    "Price",
    "Stock"
  ]

  dataInicio: ProductInterface[] = [];
  dataListProducts = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator)paginationTable!: MatPaginator;

  constructor(private dialog:MatDialog, private evento: ProductService, private utility: UtilityService)
  {
  }

  getEventos() {
    this.evento.list().subscribe({
      next: (response) => {
        if(response.success) {
          this.dataListProducts.data = response.value;
        }
        else {
          this.utility.alertView("No se encontraron eventos", "Ooops");
        }
      },
      error: (e) => {
        console.log(e)
        console.error(e)
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataListProducts.paginator = this.paginationTable;
  }

  ngOnInit(): void {
    this.getEventos();
  }

  filterFunc(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListProducts.filter = filterValue.trim().toLocaleLowerCase();
  }
}
