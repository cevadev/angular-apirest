import { Component } from '@angular/core';

import { UsersService } from './services/users.service';

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

  constructor(private usersService: UsersService) {}

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
