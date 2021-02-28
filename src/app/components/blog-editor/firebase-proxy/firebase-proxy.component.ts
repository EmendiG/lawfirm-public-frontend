import { Component } from '@angular/core';
import { FileUploadService } from '../../../services/fire-upload.service';

@Component({
  selector: 'app-firebase-proxy',
  templateUrl: './firebase-proxy.component.html'
})
export class FirebaseProxyComponent {
  // proxy instance required to reach FileUploadService in UploadAdapter

  static ftpService: any;
  constructor(private fileUploadService: FileUploadService)
  {
    FirebaseProxyComponent.ftpService = fileUploadService;
  }

}
