import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { CustomFilterPipe } from '../../shared/pipes/custom-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-usermanage',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,CustomFilterPipe,RouterLink,NgxPaginationModule],
  templateUrl: './usermanage.component.html',
  styleUrl: './usermanage.component.css'
})
export class UsermanageComponent implements OnInit,AfterViewInit{
  users: any;
  registerform: FormGroup = new FormGroup({});
  isEditMode: boolean = false;
  userIdToUpdate: any = null;
  paramSubscription!: Subscription; 
  selectedRole: string = 'All'; 
  searchTerm: string = '';
  rules:any;
  showUsersList: boolean = true; 
  page: number = 1; 
  itemsPerPage: number = 5; 
  @ViewChild('registerForm') registerForm!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;

  constructor(
    private userservice:UserService ,
    private cdf: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ac: ActivatedRoute,
    private router: Router,
    private ruleservice:UserService
  ) {}

  ngOnInit(): void {
    this.registerform = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      place: ['', Validators.required],
      roleId: ['', Validators.required],
    });

    this.loadUsers();
    this.ruleservice.getRules().subscribe({
      next:(data)=>{
        this.rules=data;
      },
      error:(err)=>{},
      complete:()=>{}
    })
    this.paramSubscription = this.ac.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getUserById(id);
      }
    });
  }

 

  loadUsers() {
    this.userservice.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.toastr.error("Failed to load users.");
      }
    });
  }

  onSearch(): void {
    const trimmedSearchTerm = this.searchTerm.trim();
    
    if (!trimmedSearchTerm) {
      this.loadUsers(); 
      return;
    }
  
    this.userservice.searchUsers(trimmedSearchTerm).subscribe({
      next: (data) => {
        this.users = data;
        if (!this.users || this.users.length === 0) {
          this.toastr.warning('No users found.');
        }
      },
      error: (error) => {
        console.error('Search Error:', error);
        this.toastr.error('Search failed. Try again.');
      }
    });
  }
  
  

  getUserById(id: any) {
    this.registerform.reset(); 
    this.userservice.getUserById(id).subscribe({
      next: (data) => {
        this.registerform.patchValue(data);
        this.userIdToUpdate = id;
        this.isEditMode = true;
        this.openRegisterForm();
        this.cdf.detectChanges();
      },
      error: () => {
        this.toastr.error("Failed to fetch user details.");
      }
    });
  }

  openRegisterForm() {
    this.registerForm.nativeElement.hidden = false;
    this.overlay.nativeElement.hidden = false;
    this.cdf.detectChanges();
  }

  closeRegisterForm() {
    this.registerForm.nativeElement.hidden = true;
    this.overlay.nativeElement.hidden = true;
    this.isEditMode = false;
    this.userIdToUpdate = null;
    this.registerform.reset();
  }

  onRegister() {
    if (this.registerform.valid) {
      if (this.isEditMode) {
        this.userservice.updateUser(this.userIdToUpdate, this.registerform.value).subscribe({
          next: () => {
            this.toastr.success("User updated successfully!");
            this.closeRegisterForm();
            this.loadUsers();
          },
          error: () => {
            this.toastr.error("Failed to update user.");
          }
        });
      } else {
        this.userservice.createUser(this.registerform.value).subscribe({
          next: () => {
            this.toastr.success("User registered successfully!");
            this.closeRegisterForm();
            this.loadUsers();
          },
          error: () => {
            this.toastr.error("Failed to register user.");
          }
        });
      }
    } else {
      this.toastr.warning("Please fill all fields correctly.");
    }
  }

  onDelete(id: any) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userservice.DeleteUser(id).subscribe({
        next: () => {
          this.toastr.success("Deleted Successfully");
          this.loadUsers();
        },
        error: () => {
          this.toastr.error("Failed to delete user");
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {}
}

