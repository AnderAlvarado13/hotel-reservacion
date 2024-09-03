import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { GlobalService } from './global.service';
import { AlertService } from '../services/alert.service';


export const VigilanteGuard: CanMatchFn = (route, segments) => {
  const globalService = inject(GlobalService);
  const alert = inject(AlertService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado
  if (globalService.isLoggedIn) {
    return true;
  } else {

    alert.AlertOneButton('Acceso denegado', 'Por favor, inicie sesión primero.', 'Entiendo');
    router.navigateByUrl('/login');
    return false;
  }
};

