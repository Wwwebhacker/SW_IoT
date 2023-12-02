import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge,throwError,combineLatest,switchMap } from 'rxjs';
import { SensorTableItem, SensorsService } from '../sensors.service';
import { map, catchError, startWith } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';





export class SensorTableDataSource extends DataSource<SensorTableItem> {
  data: SensorTableItem[] = [];
  filtersForm: FormGroup<any>;

  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private sensorsService: SensorsService) {
    super();
  }


  connect(): Observable<SensorTableItem[]> {
    if (this.paginator && this.sort) {
      const paginatorChanges = this.paginator.page.pipe(startWith(null));
      const sortChanges = this.sort.sortChange.pipe(startWith(null));
      const filterChanges = this.filtersForm.valueChanges.pipe(startWith(null));
      return combineLatest([this.sensorsService.getData(), paginatorChanges, sortChanges, filterChanges]).pipe(
        switchMap(([data, _, sortChange, filterChanges]) => {


          
          const sortDir = this.sort?.direction === 'asc' ? 'asc' : 'desc';
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
          console.log(
            "Somethin changed"
          );
          // Get the form values
          const formValues = this.filtersForm.value;
          const filteredSensorIdValue = formValues.filteredSensorId;
          const selectedSensorTypeValue = formValues.selectedSensorType;
          const startDateValue = formValues.startDate;
          const endDateValue = formValues.endDate;

          return this.sensorsService.getData(
            selectedSensorTypeValue,
            filteredSensorIdValue,
            startDateValue,
            endDateValue,
            sortBy,
            sortDir).pipe(
            switchMap(sortedData => {
              this.data = sortedData;
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


  disconnect(): void {}

  private getPagedData(data: SensorTableItem[]): SensorTableItem[] {
    if (this.paginator) {
      console.log("This paginator")
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

}

