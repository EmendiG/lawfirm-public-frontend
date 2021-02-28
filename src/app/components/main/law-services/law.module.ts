import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgcCookieConsentModule } from "ngx-cookieconsent";
import { SharedModule } from "../../../shared/shared.module";
import { LawIntellectualComponent } from "./law-intellectual/law-intellectual.component";
import { ServiceComponent } from "./service.component";
import { LawEconomicComponent } from './law-economic/law-economic.component';
import { NewTechnologiesComponent } from './new-technologies/new-technologies.component';
import { LawConstructionComponent } from './law-construction/law-construction.component';
import { LawCompaniesComponent } from './law-companies/law-companies.component';
import { LawRealEstateComponent } from './law-real-estate/law-real-estate.component';
import { LawRestructuringComponent } from './law-restructuring/law-restructuring.component';
import { LawVindicationComponent } from './law-vindication/law-vindication.component';
import { LawUnfairCompetitionComponent } from './law-unfair-competition/law-unfair-competition.component';


const appRoutes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      {
        path: 'intellectual-law',
        component: LawIntellectualComponent,
      },
      {
        path: 'economic-law',
        component: LawEconomicComponent,
      },
      {
        path: 'new-technologies',
        component: NewTechnologiesComponent,
      },

      {
        path: 'construction-law',
        component: LawConstructionComponent,
      },
      {
        path: 'companies-law',
        component: LawCompaniesComponent,
      },
      {
        path: 'real-estate-law',
        component: LawRealEstateComponent,
      },

      {
        path: 'restructuring-law',
        component: LawRestructuringComponent,
      },
      {
        path: 'vindication-law',
        component: LawVindicationComponent,
      },
      {
        path: 'unfair-competition-law',
        component: LawUnfairCompetitionComponent,
      },

    ]
  },

];

@NgModule({
  declarations: [
    ServiceComponent,
    LawIntellectualComponent,
    LawEconomicComponent,
    NewTechnologiesComponent,
    LawConstructionComponent,
    LawCompaniesComponent,
    LawRealEstateComponent,
    LawRestructuringComponent,
    LawVindicationComponent,
    LawUnfairCompetitionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    NgcCookieConsentModule
  ],
  bootstrap: [
    ServiceComponent
  ],
})
export class LawServiceModule { }
