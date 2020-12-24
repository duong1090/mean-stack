import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login/authenticate.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() button = '';
  @Input() countCart: any = 0;
  currentUser: any = {};

  constructor(
    private authenticationService: AuthenticationService,
    private cartService: CartService,
    private router: Router
  ) {}

  getCart = () => {
    this.cartService.getCart().subscribe((data) => {
      if (data) {
        this.countCart = data.length;
      }
    });
  };

  gotoCart = () => {
    this.router.navigateByUrl('/cart');
  };

  ngOnInit(): void {
    this.getCart();
  }

  getCurrentUser = () => {
    this.currentUser = this.authenticationService.currentUserValue;
    console.log('getCurrentUser:::', this.currentUser);
  };

  onLogout = () => {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
    this.getCurrentUser();
  };
}
