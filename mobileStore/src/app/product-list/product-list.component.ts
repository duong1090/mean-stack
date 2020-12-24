import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model';
import { ProductService } from '../product-add/product.service';
import { CartService } from '../cart/cart.service';
import { AuthenticationService } from '../login/authenticate.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productList: Product[] = [];
  countCart: any = 0;
  currentUser: any = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authenticationService: AuthenticationService
  ) {}

  getListProduct = () => {
    this.productService.getListProduct().subscribe((productList: Product[]) => {
      console.log('getListProduct', typeof productList[0].image);
      this.productList = productList;
    });
  };

  addToCart = (item: any) => {
    this.cartService.addToCart(item).subscribe((data) => {
      if (data) {
        this.getCountCart();
      }
    });
  };

  getCountCart = () => {
    this.cartService.getCart().subscribe((data) => {
      if (data) {
        this.countCart = data.length;
        console.log('getCountCart:::', this.countCart);
      }
    });
  };

  getCurrentUser = () => {
    this.currentUser = this.authenticationService.currentUserValue;
    console.log('getCurrentUser:::', this.currentUser);
  };

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getListProduct();
    this.getCountCart();
    this.getCurrentUser();
  }
}
