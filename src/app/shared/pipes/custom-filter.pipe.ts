import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter'
})
export class CustomFilterPipe implements PipeTransform {
  transform(users: any[], selectedRole: string): any[] {
    if (!users || selectedRole === 'All') {
      return users;
    }
    return users.filter(user => user.roleName == selectedRole);
  }

}
