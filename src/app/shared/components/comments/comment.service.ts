import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../system/http.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private static readonly COMMENT = '/comment';

  constructor(private commentBEService: CommentBEService, private http: HttpService) {}

  getComments(
    apiEndpoint: string,
    id: string | number
  ): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(
      `${CommentService.COMMENT}/${apiEndpoint}/${id}`
    );
  }

  createComment(
    apiEndpoint: string,
    id: string | number,
    comment: string
  ): Observable<unknown> {
    switch (apiEndpoint) {
      case CommentApis.COMPANY_ENDPOINT:
        return this.commentBEService.addCommentToCompany(id as string, comment);
      case CommentApis.CONSIGNMENT_ENDPOINT:
        return this.commentBEService.addCommentToConsignment(id as string, comment);
      case CommentApis.EMPLOYEE_ENDPOINT:
        return this.commentBEService.addCommentToEmployee(id as string, comment);
      case CommentApis.LINE_ENDPOINT:
        return this.commentBEService.addCommentToLine(id as string, comment);
      case CommentApis.LOCATION_ENDPOINT:
        return this.commentBEService.addCommentToLocation(id as string, comment);
      case CommentApis.LOT_ENDPOINT:
        return this.commentBEService.addCommentToLot(id as string, comment);
      case CommentApis.OFFER_REQUEST_ENDPOINT:
        return this.commentBEService.addCommentToOfferRequest(id as string, comment);
      case CommentApis.PREMISE_ENDPOINT:
        return this.commentBEService.addCommentToPremise(id as string, comment);
      case CommentApis.VEHICLE_ENDPOINT:
        return this.commentBEService.addCommentToVehicle(id as string, comment);
    }
  }
}

export enum CommentApis {
  LOT_ENDPOINT = 'lot',
  PREMISE_ENDPOINT = 'premise',
  CONSIGNMENT_ENDPOINT = 'consignment',
  LOCATION_ENDPOINT = 'location',
  VEHICLE_ENDPOINT = 'vehicle',
  OFFER_REQUEST_ENDPOINT = 'offer-request',
  COMPANY_ENDPOINT = 'company',
  LINE_ENDPOINT = 'lines',
  EMPLOYEE_ENDPOINT = 'employee',
}
