import { User } from "../models/user.model";

export class UserUtils {
    static  getUserInitials(user:User|null):string 
    {

     return user!=null ? user.firstName!.substring(0,1).toUpperCase()+user!.lastName!.substring(0,1).toUpperCase() : 'GU';
     
    } 
}
