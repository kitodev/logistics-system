import { Injectable } from '@angular/core';
import { BatchItem, GenericServiceResponse } from '@tomtom-international/web-sdk-services';

@Injectable({
    providedIn: 'root',
})
export class ConsignmentMockService {

    constructor() { }

    public static updateLocationCoordinates(
        consignment: ConsignmentDto,
        geocodeResults: Array<BatchItem<GenericServiceResponse>>
    ): void {
        if (
            geocodeResults.length !==
            (consignment.transshipmentLocations?.length ?? 0) + 2
        ) {
            console.error('results are not matching', geocodeResults);
            return;
        }

        consignment.consignmentBasicData.loadingInLocation.coordinate = geocodeResults[0][
            'results'
        ].length
            ? {
                lat: geocodeResults[0]['results'][0].position['lat'],
                lon: geocodeResults[0]['results'][0].position['lng'],
            }
            : null;

        consignment.consignmentBasicData.loadingOutLocation.coordinate = geocodeResults[
            geocodeResults.length - 1
        ]['results'].length
            ? {
                lat:
                    geocodeResults[geocodeResults.length - 1]['results'][0].position[
                    'lat'
                    ],
                lon:
                    geocodeResults[geocodeResults.length - 1]['results'][0].position[
                    'lng'
                    ],
            }
            : null;

        consignment.transshipmentLocations?.forEach((location, index) => {
            location.coordinate = geocodeResults[index + 1]['results'].length
                ? {
                    lat: geocodeResults[index + 1]['results'][0].position['lat'],
                    lon: geocodeResults[index + 1]['results'][0].position['lng'],
                }
                : null;
        });
    }

}