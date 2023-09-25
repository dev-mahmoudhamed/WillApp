import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { WillService } from '../core/services/will.service';
import { Will } from '../models/will';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  willsList: Will[] = [];
  userId: string | undefined;

  constructor(public accountService: AccountService, private willService: WillService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (res) => {
        this.userId = res?.userId;
        this.getAllWills();
      }
    });
  }

  getAllWills() {
    this.willService.getAllWills(this.userId as string).subscribe({
      next: (response) => this.willsList = response,
      error: (err) => console.log(err)
    });
  }
}
