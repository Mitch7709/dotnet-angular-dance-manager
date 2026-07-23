import { Component } from '@angular/core';
import { ProfileHeader } from '../profile-header/profile-header';
import { QuickLinks } from '../quick-links/quick-links';
import { PersonalInfoCard } from "../personal-info-card/personal-info-card";

@Component({
  selector: 'app-dashboard',
  imports: [ProfileHeader, QuickLinks, PersonalInfoCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
