import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { JobRequest } from '../../models/job.model';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.scss']
})
export class JobCreateComponent implements OnInit {
  loading = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated and is an employer
    if (!this.authService.checkAuth() || !this.authService.isEmployer()) {
      this.snackBar.open('Only employers can create jobs', 'Close', {
        duration: 5000
      });
      this.router.navigate(['/jobs']);
    }
  }

  onSubmit(jobRequest: JobRequest): void {
    this.loading = true;

    this.jobService.createJob(jobRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Job created successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.loading = false;

        // Navigate to the newly created job
        if (response.data.job.id) {
          this.router.navigate(['/jobs', response.data.job.id]);
        } else {
          this.router.navigate(['/my-jobs']);
        }
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error creating job', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/my-jobs']);
  }
}
