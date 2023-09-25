import { Component } from '@angular/core';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Will_UI';

  constructor(private accountService: AccountService) { }
  ngOnInit(): void {
    this.loadCurrentUser();
  }


  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe();

  }


}
