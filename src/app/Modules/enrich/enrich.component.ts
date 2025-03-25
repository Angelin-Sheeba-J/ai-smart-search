import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { AssetFilterPipe } from '../../shared/pipes/asset-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-enrich',
  imports: [FormsModule,AssetFilterPipe,NgxPaginationModule],
  templateUrl: './enrich.component.html',
  styleUrl: './enrich.component.css'
})
export class EnrichComponent {
 enrich:any;
 searchText: string = '';
 page: number = 1; 
 itemsPerPage: number = 4; 
 constructor(private ruleservice:UserService){}
 ngOnInit(): void {
   this.ruleservice.getRules().subscribe({
    next:(data)=>{
      this.enrich=data;
    },
    error:(err)=>{},
    complete:()=>{}
   })
 }
}
