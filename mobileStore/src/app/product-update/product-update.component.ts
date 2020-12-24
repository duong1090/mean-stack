import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product-add/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
})
export class ProductUpdateComponent implements OnInit {
  id: any = 0;

  product = {
    name: '',
    price: '',
    amount: '',
    description: '',
    manufacturer: '',
    caregory: '',
    status: '',
  };
  imageFile: any;
  submitted: boolean = false;

  constructor(
    route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    this.productService.getProduct(this.id).subscribe((product: any) => {
      if (product) {
        this.product = product;
      }
    });
  }

  updateProduct(): void {
    var product = new FormData();
    product.append('id', this.id);
    product.append('name', this.product.name);
    product.append('price', this.product.price);
    product.append('amount', this.product.amount);
    product.append('description', this.product.description);
    product.append('manufacturer', this.product.manufacturer);
    product.append('caregory', this.product.category);
    product.append('status', this.product.status);
    product.append('image', this.imageFile);

    this.productService.update(product).subscribe(
      (response) => {
        console.log(response);
        this.submitted = true;
        this.router.navigateByUrl('/product/list');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  uploadFile(event: any) {
    if (event.target) {
      const file = (event.target as HTMLInputElement).files[0];
      this.imageFile = file;
    }
  }
  newProduct(): void {
    this.submitted = false;
    this.product = {
      name: '',
      price: '',
      amount: '',
      description: '',
      manufacturer: '',
      caregory: '',
      status: '',
    };
  }
}
