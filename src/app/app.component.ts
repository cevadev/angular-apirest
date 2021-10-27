import { Component } from '@angular/core';

import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  // guardamos el token en memoria
  token = '';
  imgRta = '';

  constructor(
    private usersService: UsersService,
    private filesService: FilesService
  ) {}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService
      .create({
        name: 'Sebas',
        email: 'sebas@mail.com',
        password: '1212',
      })
      .subscribe((rta) => {
        console.log(rta);
      });
  }

  downloadPdf() {
    this.filesService
      // indicamos el archivo que queremos descargar
      .getFile(
        'my.pdf',
        'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf',
        'application/pdf'
      )
      .subscribe();
  }

  /**
   *
   * @param event evento que recibimos desde html
   */
  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    // obtenemos el archivo del html element
    const file = element.files?.item(0);
    // validamos si existe archivo
    if (file) {
      // enviamos nuestro archivo
      this.filesService.uploadFile(file).subscribe((rta) => {
        this.imgRta = rta.location;
      });
    }
  }

  // obtenemos la info del perfil que ya esta logeado
  /* getProfile() {
    this.authService.getProfile(this.token).subscribe((user) => {
      console.info(user);
      // this.profile = user;
    });
  } */

  /* login() {
    this.authService.login('sebas@mail.com', '1212').subscribe((rpta) => {
      console.info(rpta.access_token);
      // almacenamos el token
      this.token = rpta.access_token;
    });
  } */
}
