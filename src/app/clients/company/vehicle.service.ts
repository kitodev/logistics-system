import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { FormSelectItem } from '../../shared/form/select/FormSelectItem';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(
    private vehicleOfCompanyBEService: VehicleOfCompanyBEService,
    private translationService: TranslocoService
  ) {}

  public getVehicleTypes(): FormSelectItem<VehicleTypeEnum>[] {
    return Object.keys(VehicleTypeEnum).map((key) => ({
      value: VehicleTypeEnum[key],
      label: this.translationService.translate(
        'company.vehicle.vehicleTypes.' + VehicleTypeEnum[key]
      ),
    }));
  }

  public getFullWeightTypes(): FormSelectItem<JarmuOsszTomegEnum>[] {
    return Object.keys(JarmuOsszTomegEnum).map((key) => ({
      value: JarmuOsszTomegEnum[key],
      label: this.translationService.translate(
        'company.vehicle.fullWeightTypes.' + JarmuOsszTomegEnum[key]
      ),
    }));
  }

  public getStructureTypes(): FormSelectItem<JarmuFelepitmenyEnum>[] {
    return Object.keys(JarmuFelepitmenyEnum).map((key) => ({
      value: JarmuFelepitmenyEnum[key],
      label: this.translationService.translate(
        'company.vehicle.structureTypes.' + JarmuFelepitmenyEnum[key]
      ),
    }));
  }

  createVehicle(
    companyId: string,
    vehicle: Omit<VehicleDto, 'id' | 'version'>
  ): Observable<VehicleDto> {
    return this.vehicleOfCompanyBEService.createVehicle(companyId, vehicle);
  }

  getVehicles(companyId: string, query: QueryDto): Observable<PageVehicleDto> {
    return this.vehicleOfCompanyBEService.readAllVehiclesByFilter(companyId, query);
  }

  getVehiclesByCompanyId(companyId): Observable<VehicleDto[]> {
    return this.vehicleOfCompanyBEService.readAllVehiclesByCompanyId(companyId);
  }

  getVehicleById(vehicleId: string, companyId: string): Observable<VehicleDto> {
    return this.vehicleOfCompanyBEService.readVehicleById(companyId, vehicleId);
  }

  updateVehicle(
    companyId: string,
    vehicle: VehicleDto
  ): Observable<VehicleDto> {
    return this.vehicleOfCompanyBEService.updateVehicleById(companyId, vehicle.id, vehicle);
  }

  deleteVehicle(companyId: string, vehicleId: string): Observable<unknown> {
    return this.vehicleOfCompanyBEService.deleteVehicleById(companyId, vehicleId);
  }
}
