import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  url:string='https://localhost:7193/api/User';

  getUsers():Observable<any>{
    return this.http.get(this.url);
  }

  getUserById(id:any):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }

  createUser(users:any):Observable<any>{
    return this.http.post(this.url,users);
  }

  updateUser(id:any,users:any):Observable<any>{
    return this.http.put(`${this.url}/${id}`,users);
  }

  DeleteUser(id:any):Observable<any>{
    return this.http.delete(`${this.url}/${id}`);
  }

  getByToken(email:any,password:any):Observable<any>{
    return this.http.get(this.url+'/'+email+'/'+password);
  }

  searchUsers(searchTerm: string): Observable<any> {
    return this.http.get(`${this.url}/search?search=${encodeURIComponent(searchTerm)}`);
  }
    

  apiurl:string='https://localhost:7193/api/Rule';

  getRules():Observable<any>{
    return this.http.get(this.apiurl);
  }

  chaturl:string='https://localhost:7193/api/Chatbot';


  getchat(query: string): Observable<any> {
    return this.http.get<any>(`${this.chaturl}?name=${encodeURIComponent(query)}`);
  }
  

  private userQuerySource = new BehaviorSubject<string>(''); // Stores the user query
  userQuery$ = this.userQuerySource.asObservable(); // Expose observable

  sendMessage(query: string) {
    this.userQuerySource.next(query); // Update user query
  }
}
