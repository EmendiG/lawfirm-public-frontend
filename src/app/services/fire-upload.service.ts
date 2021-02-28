import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { FileUpload } from '../models/file-upload.model';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'any'
})
export class FileUploadService {
  public basePath = '/uploads';

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  getPromise(resolve, reject, file : File) {

    let fileUpload = new FileUpload(file)
    let basePath = this.basePath;
    const filePath = `${basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.saveFileData(fileUpload);
            resolve({
              default: fileUpload.url
            })
            return downloadURL;
          });
      })
    ).subscribe();
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

}
