import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


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
  constructor(private http: HttpClient) {}

  getData(sensorType: string ='', 
          sensorId: string = '',
          from: string ='',
          to: string = '',
          sortBy: string = 'Sensor.Id',
          sortOrder: string = 'asc'): 
           Observable<SensorTableItem[]> {
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

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
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
