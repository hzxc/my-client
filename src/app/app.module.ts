import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppConsts } from './shared/AppConsts';
import { AppPreBootstrap } from './AppPreBootstrap';
import { AppSessionService } from './shared/session/app-session.service';
import { SharedModule } from './shared/shared.module';
import { ServiceProxyModule } from './shared/service-proxies/service-proxy.module';
import { API_BASE_URL } from './shared/service-proxies/service-proxies';
import { AbpModule, ABP_HTTP_PROVIDER } from './abp/abp.module';

export function appInitializerFactory(injector: Injector) {
  return () => {
    abp.ui.setBusy();
    return new Promise<boolean>((resolve, reject) => {
      AppPreBootstrap.run(() => {
        const appSessionService: AppSessionService = injector.get(AppSessionService);
        appSessionService.init().then(
          (result) => {
            abp.ui.clearBusy();
            resolve(result);
          },
          (err) => {
            abp.ui.clearBusy();
            reject(err);
          }
        );
      });
    });
  };
}

export function getRemoteServiceBaseUrl(): string {
  return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
  return abp.localization.currentLanguage.name;
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AbpModule,
    SharedModule.forRoot(),
    ServiceProxyModule,
    AppRoutingModule
  ],
  providers: [
    ABP_HTTP_PROVIDER,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [Injector],
      multi: true
    },
    {
      provide: LOCALE_ID,
      useFactory: getCurrentLanguage
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
