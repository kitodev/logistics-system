import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../system/http.service';

export enum Endpoints {
  DOCUMENT = '/add-document',
  COMPANY = '/company',
  EMPLOYEE = '/employee',
  VEHICLE = '/vehicle',
  CONSIGNMENT = '/consignment',
  LINE = '/lines',
  // OFFER = '/offer',
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpService) {}

  addDocument(file: File, documentName: string, type: string, endpoint: Endpoints, id: string): Observable<string> {
    return this.http.post<string>(
      `${endpoint}/${id}/add-document`,
      FileUploadService.createDocumentFormData(file, documentName, type)
    );
  }

  //type: 'companyDocument'

  private static createDocumentFormData(
    doc: File,
    documentName: string,
    type: string
  ): FormData {
    const formData = new FormData();
    if (doc && doc.size > 0) {
      formData.append(type, doc);
      formData.append('documentName', documentName);
    }
    return formData;
  }
}
