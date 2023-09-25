
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Will } from 'src/app/models/will';
import { WillService } from '../services/will.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AccountService } from 'src/app/account/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-will-view',
  templateUrl: './will-view.component.html',
  styleUrls: ['./will-view.component.scss']
})
export class WillViewComponent implements OnInit {

  selectedFile: File;
  willId: number;
  userId: string | undefined;
  will: Will;
  imageUrl: string | ArrayBuffer | null = null;
  base64ImageUrl: string | null = null;
  authorizedState: boolean = true;
  messageContent: string;
  result: number;

  publishDate: string;
  currentDate = new Date().toLocaleString('en-GB',
    { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" });

  editorConfig: AngularEditorConfig = {
    editable: false,
    height: '500px',
    minHeight: '500px',
    showToolbar: false,
    width: '1000px',

  }

  willform = this.fb.group({
    messageContent: new FormControl(''),
    fileContent: new FormControl<File | null>(null),
    date: [new Date()],
  });


  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private datePipe: DatePipe,
    private willService: WillService, public accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.willId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getWill(this.willId);
  }


  getWill(id: number) {
    this.willService.getWillForView(id).subscribe({
      next: (response) => {
        this.will = response.willInfo;
        this.messageContent = response.willInfo.messageContent;
        this.willform.controls.messageContent.setValue(response.willInfo.messageContent);
        this.base64ImageUrl = response.imageData;
        this.publishDate = response.willInfo.publishDate


        console.log(this.currentDate);
        console.log(this.publishDate);

        this.result = this.compareDatesWithTimes(this.currentDate, this.publishDate);

      },
      error: (err) => {
        this.toastr.error(`${err.message}`, 'ERROR',);
      }
    })
  }



  compareDatesWithTimes(currentDate: string, publishDate: string): number {
    const date1Components = currentDate.split(/[,:/]/).map(Number);
    const date2Components = publishDate.split(/[,:/]/).map(Number);

    // Compare year
    if (date1Components[2] < date2Components[2]) {
      return -1;
    } else if (date1Components[2] > date2Components[2]) {
      return 1;
    }

    // Compare month
    if (date1Components[1] < date2Components[1]) {
      return -1;
    } else if (date1Components[1] > date2Components[1]) {
      return 1;
    }

    // Compare day
    if (date1Components[0] < date2Components[0]) {
      return -1;
    } else if (date1Components[0] > date2Components[0]) {
      return 1;
    }

    // Compare hour
    if (date1Components[3] < date2Components[3]) {
      return -1;
    } else if (date1Components[3] > date2Components[3]) {
      return 1;
    }

    // Compare minute
    if (date1Components[4] < date2Components[4]) {
      return -1;
    } else if (date1Components[4] > date2Components[4]) {
      return 1;
    }
    return 0;
  }

}

