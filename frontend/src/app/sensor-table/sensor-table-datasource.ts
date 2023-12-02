import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge,throwError } from 'rxjs';
import { SensorTableItem, SensorsService } from '../sensors.service';
import { map, catchError } from 'rxjs/operators';

// TODO: Replace this with your own data model type


// TODO: replace this with real data from your application
const EXAMPLE_DATA: SensorTableItem[] = [
  { id: 1, sensorType: 'Temp', value: 24.2, date: new Date('2023-11-18T08:00:00') },
  { id: 2, sensorType: 'Temp', value: 28.2, date: new Date('2023-11-18T10:30:00') },
  { id: 3, sensorType: 'Smoke', value: 70, date: new Date('2023-11-18T12:45:00') },
  { id: 4, sensorType: 'Humidity', value: 55.5, date: new Date('2023-11-18T14:15:00') },
  { id: 5, sensorType: 'Pressure', value: 1015.3, date: new Date('2023-11-18T16:30:00') },
  { id: 6, sensorType: 'Temp', value: 26.8, date: new Date('2023-11-18T18:45:00') },
  { id: 7, sensorType: 'Smoke', value: 80, date: new Date('2023-11-18T20:00:00') },
  { id: 8, sensorType: 'Humidity', value: 60.2, date: new Date('2023-11-18T22:15:00') },
  { id: 9, sensorType: 'Pressure', value: 1013.7, date: new Date('2023-11-19T08:30:00') },
  { id: 10, sensorType: 'Temp', value: 25.5, date: new Date('2023-11-19T10:45:00') },
  { id: 11, sensorType: 'Smoke', value: 75, date: new Date('2023-11-19T12:00:00') },
  { id: 12, sensorType: 'Humidity', value: 58.3, date: new Date('2023-11-19T14:30:00') },
  { id: 13, sensorType: 'Pressure', value: 1012.1, date: new Date('2023-11-19T16:45:00') },
  { id: 14, sensorType: 'Temp', value: 27.0, date: new Date('2023-11-19T18:00:00') },
  { id: 15, sensorType: 'Smoke', value: 85, date: new Date('2023-11-19T20:15:00') },
  { id: 16, sensorType: 'Humidity', value: 62.1, date: new Date('2023-11-19T22:30:00') },
];

/**
 * Data source for the SensorTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SensorTableDataSource extends DataSource<SensorTableItem> {
  data: SensorTableItem[] = EXAMPLE_DATA;
  //data: Observable<any[]> = this.sensorsService.getData();
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private sensorsService: SensorsService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<SensorTableItem[]> {
    if (this.paginator && this.sort) {
      return this.sensorsService.getData().pipe(
        catchError((error) => {
          console.error('Error fetching sensor data:', error);
          return throwError('Failed to fetch sensor data');
        }),
        map((data) => {
          this.data = data;
          return this.getPagedData(this.getSortedData([...this.data ]));
        })
      );
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
    // if (this.paginator && this.sort) {
    //   // Combine everything that affects the rendered data into one update
    //   // stream for the data-table to consume.
    //   return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
    //     .pipe(map(() => {
    //       return this.getPagedData(this.getSortedData([...this.data ]));
    //     }));
    // } else {
    //   throw Error('Please set the paginator and sort on the data source before connecting.');
    // }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: SensorTableItem[]): SensorTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: SensorTableItem[]): SensorTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'sensorType': return compare(a.sensorType, b.sensorType, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'value': return compare(+a.value, +b.value, isAsc);
        case 'date': return compare(a.date.getTime(), b.date.getTime(), isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
