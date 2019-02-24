import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() closeSidenav = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() miniText = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onClose(e) {
    this.closeSidenav.emit();
    this.miniText.emit(e);
  }

  onLogout() {
    this.logout.emit();
    this.closeSidenav.emit();
  }



}
