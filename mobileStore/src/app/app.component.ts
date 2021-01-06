import { style } from '@angular/animations';
import { Component } from '@angular/core';
import * as styleNoti from 'angular-notifier/styles';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', styleNoti],
})
export class AppComponent {
  title = 'mobileStore';
}
