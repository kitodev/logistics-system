import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { SettingsComponent } from '../settings/settings.component';
import { UserSettingsListComponent } from '../shared/components/user-settings-list/user-settings-list.component';
import { SettingsSections } from '../shared/system/local-storage.service';
import { UserSettingsService } from '../shared/system/user-settings.service';
import { single } from './data';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent {

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    title: Title,
    private translationService: TranslocoService,
  ) {

    translationService
      .selectTranslate('header.statistics')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => title.setTitle(value));
      Object.assign(this, { single })
  }
  view: any[];
  single: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  doughnut = true;
  //xAxisLabel = 'Country';
  showYAxisLabel = false;
  //yAxisLabel: string;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

}
