import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommentApis } from 'src/app/shared/components/comments/comment.service';
import { Role } from '../../../auth/Role';
import { ResourceRule } from '../../../auth/employee-role.directive';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
})
export class CompanyDetailsComponent implements OnDestroy {
  companyId: string;
  isNew = false;
  private unsubscribe = new Subject<void>();

  readonly commentApi = CommentApis.COMPANY_ENDPOINT;
  Role = Role;
  ResourceRule = ResourceRule;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.companyId = params.get('id') == 'new' ? null : params.get('id');
        this.isNew = !this.companyId;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
