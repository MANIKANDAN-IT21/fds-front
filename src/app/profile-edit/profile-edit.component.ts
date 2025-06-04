import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  imports: [RouterLinkActive,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  customerId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.customerId = 9; // Hardcoded user ID (modify to be dynamic)
    if (this.customerId) {
      this.customerService.getCustomerById(this.customerId).subscribe({
        next: (customer) => {
          this.profileForm.patchValue(customer);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.customerId) {
      this.customerService.updateCustomer(this.customerId, this.profileForm.value).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  private handleError(error: any) {
    if (error.status === 403) {
      this.errorMessage = 'Access denied. Please log in again.';
    } else {
      this.errorMessage = 'An error occurred. Please try again later.';
    }
  }
}