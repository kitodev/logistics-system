import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserSettingsService } from '../../system/user-settings.service';
import { SettingsSections } from '../../system/local-storage.service';
import { Subject } from 'rxjs';
import { debounceTime, repeat, takeUntil } from 'rxjs/operators';
import { TableCol } from '../../table/TableCol';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-settings-list',
  templateUrl: './user-settings-list.component.html',
  styleUrls: ['./user-settings-list.component.scss'],
})
export class UserSettingsListComponent implements OnInit, OnDestroy {
  protected unsubscribe = new Subject<void>();
  protected userSettings: {};
  public userColOrder: Array<TableCol<any>>;

  private pendingColumnSettings: Array<{ field: string; hidden: boolean }> = [];
  private settingChange: Subject<void> = new Subject<void>();
  private resetEventHappened: Subject<void> = new Subject<void>();

  constructor(
    private section: SettingsSections,
    private userSettingsService: UserSettingsService
  ) {
    this.userSettings = this.userSettingsService.getUserColumnSettings(section);
    this.userColOrder = this.userSettingsService.getUserColumnOrder(section);
  }

  ngOnInit(): void {
    this.settingChange
      .pipe(
        debounceTime(1000),
        takeUntil(this.resetEventHappened),
        repeat(),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.saveUserSettings();
      });
  }

  private saveUserSettings(): void {
    this.pendingColumnSettings.forEach((setting) => {
      this.userSettings[setting.field] = setting.hidden;
    });
    this.userSettingsService.saveUserColumnSettings(
      this.section,
      this.userSettings
    );
    this.pendingColumnSettings = [];
  }

  addPendingColumnSetting(hidden: boolean, field: string): void {
    this.pendingColumnSettings.push({ field, hidden });
    this.settingChange.next();
  }

  resetPendingSettings(): void {
    this.resetEventHappened.next();
    this.pendingColumnSettings = [];
  }

  onTableHeaderColumnDrop(event: CdkDragDrop<Array<TableCol<any>>>): void {
    const hiddenCount = this.userColOrder.filter((item) => item.hidden).length;
    const newIndex = (hiddenCount && event.previousIndex > event.currentIndex) ?
      event.item.data-(event.previousIndex-event.currentIndex) :
      event.currentIndex;

    moveItemInArray(
      this.userColOrder,
      event.item.data,
      newIndex
    );
    this.saveColumnOrder();
  }

  private saveColumnOrder() {
    this.userSettingsService.saveUserColumnOrder(
      this.section,
      this.userColOrder
    );
  }

  ngOnDestroy(): void {
    this.resetEventHappened.complete();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
