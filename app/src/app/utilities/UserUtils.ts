import { User } from "../models/user.model";

export class UserUtils {
    static  getUserInitials(user:User|null):string 
    {
      return user!.firstName.substring(0,1)+user!.lastName.substring(0,1);
    } 
}
