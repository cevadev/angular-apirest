import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { tap, map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

interface File {
  originalname: string;
  filename: string;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private apiUrl = `${environment.API_URL}/api/files`;

  constructor(private http: HttpClient) {}

  /**
   * Descargar un archivo de manera programática
   * @param name file name
   * @param url source file
   * @param type type of file
   * @returns
   */
  getFile(name: string, url: string, type: string) {
    return (
      this.http
        .get(url, { responseType: 'blob' })
        // alteramos la peticion con un pipe
        .pipe(
          // cuando elobservable nos envia el contenido de la peticion, ejecutamos esta logica
          tap((content) => {
            // creamos un archivo que recibirá el contenido
            const blob = new Blob([content], { type });
            // guardanos nuestro archivo
            saveAs(blob, name);
          }),
          // con map transformamos la peticion, si todo salio bien retornamos un true
          map(() => true)
        )
    );
  }

  uploadFile(file: Blob) {
    // creamos una instancia de la clase FormData
    const dto = new FormData();
    // indicamos que nuestro backend espera el campo file
    dto.append('file', file);
    // enviamos el request
    return this.http.post<File>(`${this.apiUrl}/upload`, dto, {
      // headers: {
      //   'Content-type': "multipart/form-data"
      // }
    });
  }
}
