import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SensorTableComponent } from './sensor-table/sensor-table.component';

import { FormsModule } from '@angular/forms';  

import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    AppComponent,
    SensorTableComponent,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
