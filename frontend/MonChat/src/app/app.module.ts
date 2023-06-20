import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms'; // Importez FormsModule

// ... autres imports de composants

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    MessageListComponent,
    MessageFormComponent,
    LoginFormComponent,
    // ... autres déclarations de composants
  ],
  imports: [
    BrowserModule,
    FormsModule, // Ajoutez FormsModule à la liste des imports
    // ... autres imports de modules
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
