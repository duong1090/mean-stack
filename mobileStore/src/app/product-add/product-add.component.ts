import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
  product = {
    name: '',
    price: '',
    amount: '',
    description: '',
    manufacturer: '',
    category: '',
    status: '',
  };
  imageFile: any;
  submitted: boolean = false;
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {}

  createProduct(): void {
    var product = new FormData();
    product.append('name', this.product.name);
    product.append('price', this.product.price);
    product.append('amount', this.product.amount);
    product.append('description', this.product.description);
    product.append('manufacturer', this.product.manufacturer);
    product.append('category', this.product.category);
    product.append('status', this.product.status);
    product.append('image', this.imageFile);

    this.productService.create(product).subscribe(
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
      category: '',
      status: '',
    };
  }
}
