import { Component, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Employee } from '../../services/employee';

@Component({
  selector: 'app-employees-list',
  imports: [],
  templateUrl: './employees-list.html',
  styleUrl: './employees-list.css',
})
export class EmployeesList {
   private fb = inject(FormBuilder);
  private empService = inject(Employee);

  employees = signal<any[]>([]);
  selectedEmployeeId = signal<number | null>(null);

  employeeForm = this.fb.group({
    name: '',
    email: '',
    role: '',
    department: '',
  })

  ngOnInit() {
   this.loadEmployees();
  }

  loadEmployees() {
     this.empService.getEmployees().subscribe((data) => {
      this.employees.set(data);
    });
  }

  saveEmployee() {
    if(this.selectedEmployeeId() === null){
      //add
      this.empService.addEmployee(this.employeeForm.value).subscribe(() =>{
        this.employeeForm.reset();
        this.loadEmployees();
      })
    } else{
      //Edit
      this.empService.updateEmployee(
        this.selectedEmployeeId()!,
        this.employeeForm.value
      ).subscribe(() => {
        this.cancelEdit();
        this.loadEmployees();
      })
    }
  }

  cancelEdit(){
    this.selectedEmployeeId.set(null);
    this.employeeForm.reset();
  }

  editEmployee(emp: any) {
    this.selectedEmployeeId.set(emp.id);

    this.employeeForm.setValue({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
    })
  }

  deleteEmployee(id: number) {
    this.empService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

}
