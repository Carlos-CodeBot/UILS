import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  constructor() {
      this.email = '';
      this.password = '';
   }

  ngOnInit() {
  }
  login() {
    // Aquí, idealmente, te conectarías con un backend para verificar las credenciales.
    if (this.email === 'test@example.com' && this.password === 'password123') {
      console.log('Inicio de sesión exitoso');
      // Navegar a la página principal u otra página después del inicio de sesión exitoso.
    } else {
      console.log('Inicio de sesión fallido');
      // Mostrar un mensaje de error al usuario.
    }
  }

}