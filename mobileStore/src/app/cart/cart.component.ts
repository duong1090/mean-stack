import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  increaseAmount = (item: any, index: any) => {
    this.cartService.increaseAmount(item).subscribe((data) => {
      console.log('hihih', data);
      this.itemsList[index].count++;
      this.itemsList[index].totalPrice =
        item.unitPrice * this.itemsList[index].count;
      this.updateTotalPrice();
    });
  };

  decreaseAmount = (item: any, index: any) => {
    if (item.count > 0) {
      this.cartService.decreaseAmount(item).subscribe((data) => {
        this.itemsList[index].count--;
        this.itemsList[index].totalPrice =
          item.unitPrice * this.itemsList[index].count;
        this.updateTotalPrice();
      });
    }
  };

  checkOutCart = () => {
    this.cartService.checkOutCart().subscribe((data) => {
      console.log('checkOutCart:::', data);
      this.updateTotalPrice();
      window.alert(`Thanh toán thành công. Tổng tiền: ${this.totalPrice}`);
      this.itemsList = [];
      this.updateTotalPrice();
    });
  };

  gotoList = () => {
    this.router.navigateByUrl('/product/list');
  };

  ngOnInit(): void {
    this.getCart();
  }
}
