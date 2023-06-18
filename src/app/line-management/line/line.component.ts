import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LineService } from '../line.service';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkedAlt';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnDestroy {
  faArrowLeft = faArrowLeft;
  faTable = faTable;
  faRoute = faRoute;
  faMap = faMapMarkedAlt;
  faFile = faFileAlt;
  faCoins = faCoins;

  private unsubscribe = new Subject<void>();

  line: LineDto;
  faBoxes = faBoxes;

  constructor(
    private route: ActivatedRoute,
    private lineService: LineService,
    private title: Title,
    private translationService: TranslocoService
  ) {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params.get('id') != 'new') {
          this.lineService
            .getLine(params.get('id'))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((response) => {
              this.line = response;
            });
        }
      });
    translationService
      .selectTranslate('header.lines')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
