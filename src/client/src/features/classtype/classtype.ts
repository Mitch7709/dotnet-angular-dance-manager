import { Component, inject, signal } from '@angular/core';
import { ClasstypeService } from '../../core/services/classtype-service';
import { ClassTypeRequest, ClassTypeResponse } from '../../types/DTOs/ClassTypeDTOs';
import { ToastService } from '../../core/services/toast-service';
import { getErrorMessage } from '../../core/utils/error-handler';
import { FormsModule } from '@angular/forms';
import { InstructorService } from '../../core/services/instructor-service';
import { Instructor } from '../../types/DTOs/InstructorDTOs';

@Component({
  selector: 'app-classtype',
  imports: [FormsModule],
  templateUrl: './classtype.html',
  styleUrls: ['./classtype.css'],
})
export class Classtype {
  private classtypeService = inject(ClasstypeService);
  private instructorService = inject(InstructorService);
  private toastService = inject(ToastService);

  classTypes = signal<ClassTypeResponse[] | null>(null);
  instructors = signal<Instructor[] | null>(null);
  selectedClassType = signal<ClassTypeRequest | null>(null);
  originalClassType = signal<ClassTypeResponse | null>(null);

  instructorsForSelectedClassType = signal<Instructor[]>([]);

  protected isCreating = signal(false);

  ngOnInit() {
    this.loadClassTypes();
    this.loadInstructors();
  }

  loadClassTypes() {
    this.classtypeService.getAll().subscribe((classTypes) => {
      this.classTypes.set(classTypes);
    });
  }

  loadInstructors() {
    this.instructorService.getAll().subscribe((instructors) => {
      this.instructors.set(instructors);
    });
  }

  openNewDialog() {
    this.isCreating.set(true);
    this.selectedClassType.set({
      name: '',
      description: '',
      style: '',
      level: 0,
      isActive: true,
      qualifiedInstructorIds: [],
    });
    this.openDialog();
  }

  saveNew() {
    const newClassType = this.selectedClassType();
    if (!newClassType) return;

    this.classtypeService.create(newClassType).subscribe({
      next: () => {
        this.loadClassTypes();
        this.closeDialog();
        this.toastService.success('Class type created successfully!');
      },
      error: (error) => {
        this.toastService.error(getErrorMessage(error, 'Failed to create class type.'));
      },
    });
  }

  openEditDialog(classType: ClassTypeResponse) {
    this.isCreating.set(false);
    this.selectedClassType.set({
      ...classType,
      qualifiedInstructorIds: classType.qualifiedInstructorIds || [],
    });
    this.originalClassType.set({ ...classType });
    this.openDialog();
  }

  saveEdit() {
    const classtype = this.selectedClassType();
    const original = this.originalClassType();
    if (!classtype || !original) return;

    this.classtypeService.update(original.id, classtype).subscribe({
      next: () => {
        this.loadClassTypes();
        this.closeDialog();
        this.toastService.success('Class type updated successfully!');
      },
      error: (error) => {
        this.toastService.error(getErrorMessage(error, 'Failed to update class type.'));
      },
    });
  }

  deleteClassType(id: number) {
    if (!confirm('Are you sure you want to delete this class type?')) return;

    this.classtypeService.delete(id).subscribe({
      next: () => {
        this.loadClassTypes();
        this.toastService.success('Class type deleted successfully!');
      },
      error: (error) => {
        this.toastService.error(getErrorMessage(error, 'Failed to delete class type.'));
      },
    });
  }

  private openDialog() {
    const dialog = document.getElementById('classtype-dialog') as HTMLDialogElement;
    dialog?.showModal();
  }

  protected openInstructorDialog(classType?: ClassTypeResponse) {
    if (!classType) return;

    this.selectedClassType.set({
      ...classType,
    });

    this.instructorsForSelectedClassType.set(
      this.instructors()!.filter((instructor) =>
        classType.qualifiedInstructorIds.includes(instructor.id),
      ),
    );

    const dialog = document.getElementById('instructors-dialog') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeInstructorDialog() {
    const dialog = document.getElementById('instructors-dialog') as HTMLDialogElement;
    dialog?.close();
    this.instructorsForSelectedClassType.set([]);
    this.selectedClassType.set(null);
  }

  closeDialog() {
    const dialog = document.getElementById('classtype-dialog') as HTMLDialogElement;
    dialog?.close();
    this.selectedClassType.set(null);
    this.originalClassType.set(null);
  }
}
