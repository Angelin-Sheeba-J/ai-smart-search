import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { AssetFilterPipe } from '../../shared/pipes/asset-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-asset',
  imports: [FormsModule,AssetFilterPipe,NgxPaginationModule],
  templateUrl: './asset.component.html',
  styleUrl: './asset.component.css'
})
export class AssetComponent implements OnInit{
  asset:any;
  searchText: string = '';
  page: number = 1; 
  itemsPerPage: number = 3; 
 constructor(private ruleservice:UserService){}
 ngOnInit(): void {
  this.ruleservice.getRules().subscribe({
    next:(data)=>{
      this.asset=data;
    },
    error:(err)=>{},
    complete:()=>{}
  })
 }
}
