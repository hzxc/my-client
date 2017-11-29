import { NgModule, SkipSelf, Optional } from '@angular/core';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatListModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatSelectModule,
  MatFormFieldModule,
  MatIconRegistry,
  MatDatepickerModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Options } from 'selenium-webdriver';
import { loadsvgResources } from './svg-manager';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [
    HttpClientModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  declarations: []
})
export class MaterialModule {
  // constructor(@Optional() @SkipSelf() parent: MaterialModule) {
  //   if (parent) {
  //     throw new Error('Current module already exists');
  //   }
  // }
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    loadsvgResources(iconRegistry, sanitizer);
  }
}
