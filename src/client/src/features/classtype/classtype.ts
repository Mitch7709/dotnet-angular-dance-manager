import { Component, inject, signal } from '@angular/core';
import { ClasstypeService } from '../../core/services/classtype-service';
import { ClassTypeResponse } from '../../types/DTOs/ClassTypeDTOs';

@Component({
  selector: 'app-classtype',
  imports: [],
  templateUrl: './classtype.html',
  styleUrl: './classtype.css',
})
export class Classtype {
  private classtypeService = inject(ClasstypeService);

  classTypes = signal<ClassTypeResponse[] | null>(null);

  ngOnInit() {
    this.loadClassTypes();
  }

  loadClassTypes() {
    this.classtypeService.getAll().subscribe((classTypes) => {
      this.classTypes.set(classTypes);
      // console.log(classTypes);
    });
  }
}
