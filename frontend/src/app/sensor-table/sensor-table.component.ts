import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SensorTableDataSource } from './sensor-table-datasource';

import {FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SensorsService ,SensorTableItem} from '../sensors.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';





const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
export interface SensorStatItem {
  id: number;
  lastValue: number;
  averageLast100: number;
}
@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.css']
})
export class SensorTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SensorTableItem>;

  constructor(private sensorsService: SensorsService,private fb: FormBuilder) {
    this.form = this.fb.group({
      filteredSensorId: [''],
      selectedSensorType: [''],
      startDate: [''],
      endDate: [''],
    });
  }
  
  private dataSubscription: Subscription;
  sensorStats :SensorStatItem[] = [];
  //////////////
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
  };
  public lineChartColors: Array<any> = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  /////////
  form: FormGroup;
  dataSource = new SensorTableDataSource(this.sensorsService);
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'sensorType','value', 'date'];


  // dateRange = new FormGroup({
  //   start: new FormControl(new Date(year, month, 13)),
  //   end: new FormControl(new Date(year, month, 16)),
  // });

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filtersForm = this.form;

    this.table.dataSource = this.dataSource;
    this.sensorsService.getDataAsync().subscribe(
      (data)=>{
        this.processSensorData(data);
      }
    );
    this.dataSubscription =  this.dataSource.getSortedFiltredData().subscribe(
      (data)=>{
          
        // Extract data for the chart
            // Sort the data by date
          data.sort((a, b) => a.date.getTime() - b.date.getTime());

          // Extract data for the chart
          const values = data.map((item) => item.value);
          const dates = data.map((item) => item.date.toISOString());

          this.lineChartData = [{ data: values, label: 'Sensor Data' }];
          this.lineChartLabels = dates;
      }
    );
  }
  private processSensorData(data: SensorTableItem[]): void {
    const uniqueSensorIds = Array.from(new Set(data.map((item) => item.id)));

    this.sensorStats = uniqueSensorIds.map((sensorId) => {
      

      const sensorValues = data.filter((item) => item.id === sensorId);
      sensorValues.sort((a, b) => a.date.getTime() - b.date.getTime());

      const lastValue = sensorValues.length > 0 ? sensorValues[sensorValues.length - 1].value : 0;

      const last100Values = sensorValues.slice(-100);
      const averageLast100 = last100Values.length > 0 ? this.calculateAverage(last100Values) : 0;

      return {
        id: sensorId,
        lastValue,
        averageLast100,
      };
    });
  }

  private calculateAverage(values: SensorTableItem[]): number {
    const sum = values.reduce((acc, item) => acc + item.value, 0);
    return sum / values.length;
  }
  
  
  download(format:string){
    this.dataSource.download(format);
  }
  onSubmit() {
    console.log(this.form.value);
  }
  private generateColor(index: number): string {
    // You can implement a more sophisticated logic to generate colors
    const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow'];
    return colors[index % colors.length];
  }
}
