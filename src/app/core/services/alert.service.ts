import { Service } from '@angular/core';
import Swal from 'sweetalert2';

@Service()
export class AlertService {
  success(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }

  error(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  info(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
  }

  warning(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }

  confirm(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => result.isConfirmed);
  }
}
