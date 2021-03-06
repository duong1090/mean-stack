import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model';
import { CartService } from '../cart/cart.service';
import { AuthenticationService } from '../login/authenticate.service';

import { ProductService } from '../product-add/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product = {};
  countCart: any = 0;
  id: number = 0;
  currentUser: any = {};

  constructor(
    route: ActivatedRoute,
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private cartService: CartService
  ) {
    route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  getCurrentUser = () => {
    this.currentUser = this.authenticationService.currentUserValue;
    console.log('getCurrentUser:::', this.currentUser);
  };

  delete = (id: any) => {
    this.productService.delete(id).subscribe((data) => {
      if (data) console.log('delete::::');
    });
  };

  addToCart = (item: any) => {
    this.cartService.addToCart(item).subscribe((data) => {
      if (data) {
        // this.getCountCart();
      }
    });
  };

  // getCountCart = () => {
  //   this.cartService.getCart().subscribe((data) => {
  //     if (data) {
  //       this.countCart = data.length;
  //       console.log('getCountCart:::', this.countCart);
  //     }
  //   });
  // };

  ngOnInit(): void {
    this.productService.getProduct(this.id).subscribe((product: Product) => {
      if (product) {
        console.log('onInitititit', product);
        this.product = product;
      }
    });

    this.getCurrentUser();
  }
}
