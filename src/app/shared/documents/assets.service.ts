import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../system/http.service';

enum Endpoints {
  ASSET = '/asset',
  FILES = '/files',
}

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(private assetBEService: AssetBEService, private http: HttpService) {}

  getCompanyDirectories(companyId: string): Observable<DirectoryDto[]> {
    return this.assetBEService.getCompanyDirectories(companyId);
  }

  getFiles(query: QueryDto, directoryId: string): Observable<PageAssetDto> {
    return this.assetBEService.getDirectoryAssets(directoryId, query);
  }

  getDocuments(id: string, type: string): Observable<AssetDto[]> {
    switch (type) {
      case AssetTypes.COMPANY:
        return this.assetBEService.getCompanyAssets(id);
      case AssetTypes.CONSIGNMENT:
        return this.assetBEService.getConsignmentAssets(id);
      case AssetTypes.EMPLOYEE:
        return this.assetBEService.getEmployeeAssets(id);
      case AssetTypes.LINE:
        return this.assetBEService.getLineAssets(id);
      case AssetTypes.OFFER:
        return this.assetBEService.getOfferAssets(id);
      case AssetTypes.VEHICLE:
        return this.assetBEService.getVehicleAssets(id);
    }
  }

  deleteFile(id: string): Observable<unknown> {
    return this.assetBEService.deleteAssetById(id);
  }

  downloadFile(id: string): any {
    //return this.assetBEService.readFile(id, DownloadFormat.ATTACHMENT);
     return this.http.get(
    `${Endpoints.ASSET}/${id}?format=ATTACHMENT`,
    { responseType: 'blob' },
    'blob'
    );
  }

  exportCsv(endpoint: string): Observable<any> {
    // TODO: check
    return this.http.get(
      `${endpoint}/export`,
      { responseType: 'blob' },
      'blob'
    );
  }

  sendFileToPartner(id: string, partnerId: string): Observable<string> {
    return this.assetBEService.forward(id, partnerId);
  }
}

export enum AssetTypes {
  EMPLOYEE = 'employee',
  VEHICLE = 'vehicle',
  LINE = 'line',
  CONSIGNMENT = 'consignment',
  OFFER = 'offer',
  COMPANY = 'company',
}
