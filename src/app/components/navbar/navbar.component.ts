import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() closeSidenav = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  @Input() isAdmin: string;
  @Input() isUser: string;
  constructor() { }

  ngOnInit() {
  }

  onClose(e) {
    this.closeSidenav.emit();

  }

  onLogout() {
    this.logout.emit();
    this.closeSidenav.emit();
  }



}
