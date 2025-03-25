import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
 loginform:FormGroup=new FormGroup({})
 constructor(private fb:FormBuilder,private router:Router,private userservice:UserService,private toastr:ToastrService){}
 ngOnInit(): void {
   this.loginform=this.fb.group({
    email:['',],
    password:['',]
   })
 }

 onLogin(){
  this.userservice.getByToken(this.loginform.value.email,this.loginform.value.password).subscribe({
    next:(value)=>{
      if(value.token){
      sessionStorage.setItem('token',value.token)
      sessionStorage.setItem('roleid',value.roleId)
      // alert("Login Successfully");
      this.toastr.success("Login Successfully")
      this.router.navigate(['/home'])
      }
    },
    error:(err)=>{
      // alert("Invalid User");
      this.toastr.error("Invalid User")
    },
    complete:()=>{}
  })
 }
}
