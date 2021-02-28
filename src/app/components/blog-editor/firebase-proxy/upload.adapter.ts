
import { FirebaseProxyComponent } from '../firebase-proxy/firebase-proxy.component';

export class MyUploadAdapter {

  constructor(private loader ) {}

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          FirebaseProxyComponent.ftpService.getPromise(resolve, reject, file);
        })
    );
  }

}
