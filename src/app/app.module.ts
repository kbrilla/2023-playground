import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { SelectComponentsComponent } from './components/select-components/select-components.component';

@NgModule({
  imports: [BrowserModule, FormsModule, RouterOutlet],
  declarations: [AppComponent, HelloComponent],
  providers: [
    provideRouter([
      {
        path: '',
        loadComponent: () =>
          import(
            './components/select-components/select-components.component'
          ).then((c) => c.SelectComponentsComponent),
      },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
