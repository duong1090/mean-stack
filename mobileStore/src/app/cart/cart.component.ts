import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  itemsList: any = [];
  totalPrice: any = 0;

  constructor(private cartService: CartService, private router: Router) {}

  onRemove = (item: any, index: any) => {
    this.cartService.removeCart(item).subscribe((data) => {
      if (data) {
        console.log('removeCartSuccess:::');
        if (this.itemsList.length) {
          this.itemsList.splice(index, 1);
          this.updateTotalPrice();
        }
      }
    });
  };

  onRemoveAll = () => {
    this.cartService.removeAll().subscribe((data) => {
      if (data) {
        this.itemsList = [];
        this.updateTotalPrice();
      }
    });
  };

  getCart = () => {
    this.cartService.getCart().subscribe((data) => {
      if (data && data.length) {
        this.itemsList = data;
        this.updateTotalPrice();
      }
    });
  };

  updateTotalPrice = () => {
    this.totalPrice = this.itemsList.reduce((sum: any, item: any) => {
      return (sum += parseInt(item.totalPrice));
    }, 0);
  };

  gotoList = () => {
    this.router.navigateByUrl('/product/list');
  };

  ngOnInit(): void {
    this.getCart();
  }
}
