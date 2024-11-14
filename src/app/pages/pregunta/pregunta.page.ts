import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ]
})
export class PreguntaPage {
  username: string = '';
  respuestaSecreta: string = '';
  errorMessage: string | null = null;

  
  nombre: string = '';
  apellido: string = '';
  fraseSecreta: string = '';

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;

  constructor(
    private router: Router, 
    private toastCtrl: ToastController, 
    private databaseService: DatabaseService 
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || ''; 
    }
    
    
    this.cargarDatosUsuario();
  }

  
  async cargarDatosUsuario() {
    try {
      const usuarioValido = await this.databaseService.findUserByUsername(this.username);

      if (usuarioValido) {
        this.nombre = usuarioValido.nombre;
        this.apellido = usuarioValido.apellido;
        this.fraseSecreta = usuarioValido.fraseSecreta; 
      } else {
        this.errorMessage = 'Usuario no encontrado.';
      }
    } catch (error) {
      this.errorMessage = 'Error al cargar los datos del usuario.';
      console.error(error);
    }
  }

  async verificarRespuesta() {
    try {
      const usuarioValido = await this.databaseService.findUserByUsername(this.username);

      if (usuarioValido && usuarioValido.respuestaSecreta === this.respuestaSecreta) {
        this.router.navigate(['/correcto'], { state: { username: usuarioValido.username } }); 
      } else {
        this.errorMessage = 'Respuesta incorrecta.';
        this.router.navigate(['/incorrecto']); 
      }
    } catch (error) {
      this.errorMessage = 'Error al verificar la respuesta.';
      console.error(error);
    }
  }

  ingreso() {
    this.router.navigate(['/ingreso']);
  }
}
