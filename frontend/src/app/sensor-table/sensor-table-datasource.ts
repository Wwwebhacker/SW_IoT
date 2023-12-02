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
    return this.getSortedFiltredData().pipe(
      switchMap(sortedAndFilteredData => {
        this.data = sortedAndFilteredData;
        const pagedData = this.getPagedData(sortedAndFilteredData);
        return observableOf(pagedData);
      })
    );
  }

  public getSortedFiltredData(): Observable<SensorTableItem[]> {
    if (this.paginator && this.sort) {
      const dataChanges = this.sensorsService.getData().pipe(startWith(null));
      const paginatorChanges = this.paginator.page.pipe(startWith(null));
      const sortChanges = this.sort.sortChange.pipe(startWith(null));
      const filterChanges = this.filtersForm.valueChanges.pipe(startWith(null));
      return combineLatest([dataChanges, paginatorChanges, sortChanges, filterChanges]).pipe(
        switchMap(([data, _, sortChange, filterChanges]) => {
          const { sortBy, sortDir, filteredSensorIdValue, selectedSensorTypeValue, startDateValue, endDateValue } = this.extractFormsValues();
          return this.sensorsService.getData(
            selectedSensorTypeValue,
            filteredSensorIdValue,
            startDateValue,
            endDateValue,
            sortBy,
            sortDir)
          
        })
      );
    } else {
      return this.sensorsService.getData();
    }
    
  }

  public download(format:string){
    const  { sortBy, sortDir, filteredSensorIdValue, selectedSensorTypeValue, startDateValue,endDateValue } = this.extractFormsValues();

    switch (format) {
      case 'csv':
        this.sensorsService.downloadCsv(selectedSensorTypeValue,
            filteredSensorIdValue,
            startDateValue,
            endDateValue,
            sortBy,
            sortDir);
        break;
      case 'json':
        this.sensorsService.downloadJson(selectedSensorTypeValue,
          filteredSensorIdValue,
          startDateValue,
          endDateValue,
          sortBy,
          sortDir);
        break;
      default:  
        break;
    } 
  }
  private extractFormsValues() {
    const sortDir = this.sort?.direction === 'asc' ? 'asc' : 'desc';
    const sortBy =this.getStringType();
    const formValues = this.filtersForm.value;
    const filteredSensorIdValue = formValues.filteredSensorId;
    const selectedSensorTypeValue = formValues.selectedSensorType;
    const startDateValue = formValues.startDate;
    const endDateValue = formValues.endDate;
  
    return { sortBy, sortDir, filteredSensorIdValue, selectedSensorTypeValue, startDateValue,endDateValue };
  }
  private getStringType(){
    var sortBy = "";
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
    return sortBy;
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

