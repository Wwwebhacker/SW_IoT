import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SensorTableDataSource, SensorTableItem } from './sensor-table-datasource';

@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.css']
})
export class SensorTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SensorTableItem>;
  dataSource = new SensorTableDataSource();
  selectedSensorType = "";
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'sensorType','value'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  onTypeChange($event:any){
    this.selectedSensorType = $event.value.toLowerCase();
  }
}
