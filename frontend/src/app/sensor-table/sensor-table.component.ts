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
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

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
  }
  download(format:string){
    this.dataSource.download(format);
  }
  onSubmit() {
    console.log(this.form.value);
  }
}
