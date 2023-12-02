import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BehaviorSubject, interval } from 'rxjs';

export interface SensorTableItem {
  id: number;
  sensorType: string;
  value:number;
  date:Date
}


@Injectable({
  providedIn: 'root'
})

export class SensorsService {
  private apiUrl = 'http://localhost:5000/api/SensorData';
  private dataSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
    interval(200).pipe(switchMap(() => this.getData()))
    .subscribe((data) => {
      this.dataSubject.next(data);
    });
  }
  

  getDataAsync() {
    return this.dataSubject.asObservable();
  }
  
  
  getData(sensorType: string ='', 
          sensorId: string = '',
          from: string ='',
          to: string = '',
          sortBy: string = 'Sensor.Id',
          sortOrder: string = 'asc'){
      const params: { [key: string]: string } = {
          sortBy: sortBy,
          sortOrder: sortOrder,
      };
      // Add non-empty parameters to the object
    if (sensorType !== '' &&  sensorType !==null) params['sensorType'] = sensorType;
    if (sensorId !== '' &&  sensorId !==null) params['sensorId'] = sensorId;
    if (from !== '' ) params['from'] = from;
    if (to !== '')params['to'] = to;
    console.log(params);
    var datObsr = this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map((data) => {
        // Assuming data is an array of objects with the structure provided
        return data.map((item) => ({
          id: item.sensor.id, // Assuming id is a number
          sensorType: item.sensor.type,
          value: item.value,
          date: new Date(item.dateTime),
        }));
      })
    );
    
    return datObsr;
  }
  download(sensorType: string ='', 
          sensorId: string = '',
          from: string ='',
          to: string = '',
          sortBy: string = 'Sensor.Id',
          sortOrder: string = 'asc',
          outputFormat:string
          ){
      const params: { [key: string]: string } = {
          sortBy: sortBy,
          sortOrder: sortOrder,
          outputFormat: outputFormat
      };
      // Add non-empty parameters to the object
    if (sensorType !== '' &&  sensorType !==null) params['sensorType'] = sensorType;
    if (sensorId !== '' &&  sensorId !==null) params['sensorId'] = sensorId;
    if (from !== '' ) params['from'] = from;
    if (to !== '') params['to'] = to;
    console.log(params);

    this.http.get(this.apiUrl, { responseType: 'blob',params:params }).subscribe((data) => {
      this.saveFile(data, 'sensors.'+outputFormat);
    });;

  }
  private saveFile(data: Blob, filename: string): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(data);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
  downloadCsv(sensorType: string ='', 
  sensorId: string = '',
  from: string ='',
  to: string = '',
  sortBy: string = 'Sensor.Id',
  sortOrder: string = 'asc',
  ){
    console.log("DOWNLOAD CSV");
    return this.download(sensorType, sensorId, from, to, sortBy, sortOrder, 'csv');
  }
  downloadJson(sensorType: string ='', 
  sensorId: string = '',
  from: string ='',
  to: string = '',
  sortBy: string = 'Sensor.Id',
  sortOrder: string = 'asc',
  ){
    console.log("DOWNLOAD json");

    return this.download(sensorType, sensorId, from, to, sortBy, sortOrder, 'json');
  }
}
