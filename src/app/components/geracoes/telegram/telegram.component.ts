import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss']
})
export class TelegramComponent implements OnInit {
choice = '1';


  constructor( private dialogRef: MatDialogRef<TelegramComponent>,){

  }

  ngOnInit(){

  }

  send(){
    this.dialogRef.close(this.choice);
  }

}
