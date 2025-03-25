import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { AssetFilterPipe } from '../../shared/pipes/asset-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-capacity',
  imports: [FormsModule,AssetFilterPipe,NgxPaginationModule],
  templateUrl: './capacity.component.html',
  styleUrl: './capacity.component.css'
})
export class CapacityComponent implements OnInit{
  capacity:any;
  searchText: string = '';
  page: number = 1; 
  itemsPerPage: number = 4; 
 constructor(private ruleservice:UserService){}
 ngOnInit(): void {
   this.ruleservice.getRules().subscribe({
    next:(data)=>{
      this.capacity=data;
    },
    error:(err)=>{},
    complete:()=>{}
   })
 }
}
