import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge,throwError,combineLatest,switchMap } from 'rxjs';
import { SensorTableItem, SensorsService } from '../sensors.service';
import { map, catchError, startWith } from 'rxjs/operators';




// TODO: replace this with real data from your application
const EXAMPLE_DATA: SensorTableItem[] = [
  { id: 1, sensorType: 'FAKE', value: 24.2, date: new Date('2023-11-18T08:00:00') },
  { id: 2, sensorType: 'FAKE', value: 28.2, date: new Date('2023-11-18T10:30:00') },
  { id: 3, sensorType: 'FAKE', value: 70, date: new Date('2023-11-18T12:45:00') },
  { id: 4, sensorType: 'FAKE', value: 55.5, date: new Date('2023-11-18T14:15:00') },
  { id: 5, sensorType: 'FAKE', value: 1015.3, date: new Date('2023-11-18T16:30:00') },
  { id: 6, sensorType: 'FAKE', value: 26.8, date: new Date('2023-11-18T18:45:00') },
];

/**
 * Data source for the SensorTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SensorTableDataSource extends DataSource<SensorTableItem> {
  data: SensorTableItem[] = [];
  //data: SensorTableItem[] = [];
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
      const paginatorChanges = this.paginator.page.pipe(startWith(null));
      const sortChanges = this.sort.sortChange.pipe(startWith(null));

      return combineLatest([this.sensorsService.getData(), paginatorChanges, sortChanges]).pipe(
        switchMap(([data, _, sortChange]) => {
          this.data = data;
          const sortDirection = this.sort?.direction === 'asc' ? 'asc' : 'desc';
          let sortBy = '';

          switch (this.sort?.active) {
            case 'sensorType':
              sortBy = 'Sensor.Type';
              break;
            case 'id':
              sortBy = 'Sensor.Id';
              break;
            case 'value':
              sortBy = 'Value';
              break;
            case 'date':
              sortBy = 'DateTime';
              break;
            default:
              sortBy = 'Value';
              break;
          }
          
          return this.sensorsService.getData(sortBy,sortDirection).pipe(
            switchMap(sortedData => {
              const pagedData = this.getPagedData(sortedData);
              return observableOf(pagedData);
            })
          );
        })
      );
    } else {
      return this.sensorsService.getData();
    }
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
      console.log("This paginator")
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

}

