import { Component, effect, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export default class MainLayout {
  menuAbierto = signal(false);

  constructor() {
    effect(() => {
      document.body.classList.toggle('max-lg:overflow-hidden', this.menuAbierto());
    });
  }
}
