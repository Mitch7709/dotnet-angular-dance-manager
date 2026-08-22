import { Component, Input } from '@angular/core';
import { InstructorResponse } from '../../../types/DTOs/InstructorDTOs';

@Component({
  selector: 'app-qualified-classes',
  imports: [],
  templateUrl: './qualified-classes.html',
  styleUrl: './qualified-classes.css',
})
export class QualifiedClasses {

  @Input() qualifiedClasses: string[] = [];

  
}
