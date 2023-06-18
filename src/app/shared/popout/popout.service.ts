import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
} from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import {
  POPOUT_MODAL_DATA,
  POPOUT_MODALS,
  PopoutData,
  PopoutModalName,
} from './PopoutModalData';
import { QrLotComponent } from '../../consignment/lots/qr-lot/qr-lot.component';
import { StationConsignmentsComponent } from 'src/app/line-management/line/line-consignments/station-consignments/station-consignments.component';

@Injectable({
  providedIn: 'root',
})
export class PopoutService {
  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef
  ) {}

  openPopoutModal(data: PopoutData): void {
    const windowInstance = PopoutService.openOnce(
      'assets/popout.html',
      `${data.modalName}`
    );

    setTimeout(() => {
      this.createCDKPortal(data, windowInstance);
    }, 800);
  }

  closePopoutModal(): void {
    Object.keys(POPOUT_MODALS).forEach((modalName) => {
      if (POPOUT_MODALS['windowInstance']) {
        POPOUT_MODALS['windowInstance'].close();
      }
    });
  }

  private createCDKPortal(data: PopoutData, windowInstance: Window): void {
    if (windowInstance) {
      windowInstance.document.body.innerText = '';
      // Create a portal outlet with the body of the new window document
      const outlet = new DomPortalOutlet(
        windowInstance.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
      );

      // Clear popout modal content
      windowInstance.document.body.innerText = '';

      // Create an injector with modal data
      const injector = this.createInjector(data);

      // Attach the portal
      let componentInstance;
      if (data.modalName === PopoutModalName.LOT_QR) {
        windowInstance.document.title = `${data.lot.lotIdentifier}_QR_label`;
        componentInstance = PopoutService.attachQrLotContainer(
          outlet,
          injector
        );
        setTimeout(() => {
          windowInstance.print();
        }, 1000);
      } else if (data.modalName === PopoutModalName.CONSIGNMENTS) {
        windowInstance.document.title = `${data.text}`;

        componentInstance = PopoutService.attachLineConsignmentsContainer(
          outlet,
          injector
        );
        setTimeout(() => {
          windowInstance.print();
        }, 1000);

      }

      POPOUT_MODALS[data.modalName] = {
        windowInstance,
        outlet,
        componentInstance,
      };
      // };

    }
  }

  private createInjector(data): Injector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(POPOUT_MODAL_DATA, data);
    return Injector.create({
      parent: this.injector,
      providers: [{ provide: POPOUT_MODAL_DATA, useValue: data }],
    });
  }

  private static openOnce(url, target): Window {
    const winRef = window.open('', target, '');
    if (winRef.location.href === 'about:blank') {
      winRef.location.href = url;
    }
    return winRef;
  }

  private static attachQrLotContainer(
    outlet: DomPortalOutlet,
    injector: Injector
  ): QrLotComponent {
    const containerPortal = new ComponentPortal(QrLotComponent, null, injector);
    const containerRef: ComponentRef<QrLotComponent> = outlet.attach(
      containerPortal
    );
    return containerRef.instance;
  }

  private static attachLineConsignmentsContainer(
    outlet: DomPortalOutlet,
    injector: Injector
  ): StationConsignmentsComponent {
    const containerPortal = new ComponentPortal(StationConsignmentsComponent, null, injector);
    const containerRef: ComponentRef<StationConsignmentsComponent> = outlet.attach(
      containerPortal
    );
    return containerRef.instance;
  }

}
