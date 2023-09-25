import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Will } from 'src/app/models/will';
import { WillService } from '../services/will.service';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AccountService } from 'src/app/account/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-will-details',
  templateUrl: './will-details.component.html',
  styleUrls: ['./will-details.component.scss']
})
export class WillDetailsComponent implements OnInit {
  selectedFile: File;
  formData = new FormData();
  willId: number;
  userId: string | undefined;
  deleteButton: boolean = false;
  will: Will;
  imageUrl: string | ArrayBuffer | null = null;
  base64ImageUrl: string | null = null;
  authorizedState: boolean = true;
  visible: boolean = false;
  publishDate = new Date().toLocaleString('en-GB',
    { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" });


  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    spellcheck: true,
    height: '300px',
    minHeight: '5rem',
    translate: 'no',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo']
    ],
  }

  willform = this.fb.group({
    messageContent: new FormControl(''),
    fileContent: new FormControl<File | null>(null),
    date: [new Date()],
  });


  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private datePipe: DatePipe,
    private willService: WillService, public accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: (res) => {
        this.userId = res?.userId;
        if (this.activatedRoute.snapshot.paramMap.get('id') == 'new') {
          this.deleteButton = false;
        } else {
          this.willId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
          this.deleteButton = true;
          this.getWill(this.willId);
        }
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.base64ImageUrl = null;
      };
    }

  }

  publish() {
    if (Number.isInteger(this.willId) && !this.selectedFile) {
      this.formData.set('messageContent', this.willform.get('messageContent')?.value as string);
      const formattedDate = this.datePipe.transform(this.willform.get('date')?.value, 'dd/MM/yyyy, HH:mm');
      this.formData.set('publishDate', formattedDate?.toString() as string);
      this.publishDate = formattedDate?.toString() as string;

      this.willService.updateWithPatch(this.formData, this.willId).subscribe({
        next: (response) => {
          this.showSuccessMessage('Updated');
          this.visible = true;
        },
        error: (error) => this.showErrorMessage(error.message)
      });
      return;
    }
    if (!this.selectedFile) {
      alert('No image selected');
      return;
    } else {
      this.formData.set('userId', this.userId as string);
      this.formData.set('image', this.selectedFile);
      this.formData.set('messageContent', this.willform.get('messageContent')?.value as string);
      this.formData.set('filePath', 'new');
      this.formData.set('fileName', this.selectedFile.name);
      const formattedDate = this.datePipe.transform(this.willform.get('date')?.value, 'dd/MM/yyyy, HH:mm');
      this.publishDate = this.willform.get('date')?.value?.toString() as string;
      this.formData.set('publishDate', formattedDate as string);
    }
    this.postWill();
  }

  getWill(id: number) {
    this.willService.getWillById(id).subscribe({
      next: (response) => {
        this.will = response.willInfo;
        this.willform.controls.messageContent.setValue(response.willInfo.messageContent);
        this.base64ImageUrl = response.imageData;
        this.publishDate = response.willInfo.publishDate
        this.authorizedState = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 401 || err.status == 404) {
          this.authorizedState = true;
        }
      }
    })
  }

  postWill() {
    if (Number.isInteger(this.willId)) {
      this.updateWill();    //  <<<<<<  Update Mode   >>>>>> 
    } else {
      this.createWill();    //  <<<<<<  Create Mode   >>>>>> 
    }
  }

  createWill() {
    this.willService.createWill(this.formData).subscribe({
      next: (response) => {
        this.showSuccessMessage('Created');
        this.visible = true;
        this.router.navigateByUrl('');

      },
      error: (error) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  updateWill() {
    this.willService.updateWill(this.formData, this.willId).subscribe({
      next: (response) => {
        this.showSuccessMessage('Updated');
        this.visible = true;
      },
      error: (error) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  deleteWill() {
    this.willService.deleteWill(this.willId).subscribe({
      next: (response) => {
        this.showSuccessMessage('Deleted');
        this.router.navigateByUrl('');
      },
      error: (error) => {
        this.showErrorMessage(error.message);
      }
    });
  }

  showSuccessMessage(operation: string) {
    this.toastr.success(`${operation} successfully`, 'Success');
  }

  showErrorMessage(error: string) {
    this.toastr.error(`${error}`, 'ERROR',);
  }
}
