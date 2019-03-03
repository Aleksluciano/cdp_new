import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() miniText = new EventEmitter<string>();

  @Input() loggedInUser: string;


  constructor() { }

  ngOnInit() {
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.logout.emit();
  }

 changeMiniHeader(e) {
  this.miniText.emit(e);

 }

}
