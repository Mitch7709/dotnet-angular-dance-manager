import { Component, inject, signal } from '@angular/core';
import { ClasstypeService } from '../../core/services/classtype-service';
import { ClassTypeRequest, ClassTypeResponse } from '../../types/DTOs/ClassTypeDTOs';
import { ToastService } from '../../core/services/toast-service';
import { getErrorMessage } from '../../core/utils/error-handler';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classtype',
  imports: [FormsModule],
  templateUrl: './classtype.html',
  styleUrls: ['./classtype.css'],
})
export class Classtype {
  private classtypeService = inject(ClasstypeService);
  private toastService = inject(ToastService);

  classTypes = signal<ClassTypeResponse[] | null>(null);
  selectedClassType = signal<ClassTypeRequest | null>(null);

  protected isCreating = signal(false);

  ngOnInit() {
    this.loadClassTypes();
  }

  loadClassTypes() {
    this.classtypeService.getAll().subscribe((classTypes) => {
      this.classTypes.set(classTypes);
      // console.log(classTypes);
    });
  }

  saveNew() {
    const newClassType = this.selectedClassType();
    if (!newClassType) return;

    this.classtypeService.create(newClassType).subscribe({
      next: () => {
        this.loadClassTypes();
        this.closeDialog();
        // this.toastService.success('Class type created successfully!');
      },
      error: (error) => {
        this.toastService.error(getErrorMessage(error, 'Failed to create class type.'));
      },
    });
  }

  saveEdit() {
    return;
  }

  openDialog() {
    const dialog = document.getElementById('classtype-dialog') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeDialog() {
    const dialog = document.getElementById('classtype-dialog') as HTMLDialogElement;
    dialog?.close();
    this.selectedClassType.set(null);
  }
}
