import { Injectable } from '@angular/core';
import { Group } from '../../interfaces/group.interface' ;
import { CallLog, CallLogObject } from '@ionic-native/call-log';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';


@Injectable()
export class GroupListService {
  private _groupList:Group[]=[];
  numbersArray: string[];
  members :string[];

  constructor(private callLog: CallLog, private contacts:Contacts) {
    console.log("constructor of group-list");
    this.numbersArray=[];
    this.members=[];
  
  }

  loadGroupList(groupList: Group[]){
    console.log("loadgrouplist");
    this._groupList=groupList;
  }

  returnGroupList(){
    return this._groupList ;
  }

  removeGroup(index: number){
    this._groupList.splice(index,1);
    return;
  }

  addNewGroup(title: string, persons:string[],numbers: string[], ides:string[]){
    let newGroup:Group = {
            name : title,
            duration : 0,
            members : persons,
            phoneNumbers: numbers,
            ids: ides
    };

    console.log ("add new group : "+ newGroup.name+ " members : "+newGroup.members[0]);
    if (this._groupList.length == 0){
      //first time add a group
      console.log("groupList  empty");
      this._groupList[0]= newGroup;
      this.calculateDuration(0);
    }
    else {
      console.log("groupList not empty");
      this._groupList.unshift(newGroup); //concatenate at the beginning of the array
      this.calculateDuration(0);
    }
  }

  returnGroup(index: number){
    return this._groupList[index];
  }



  updateGroup(index:number, title: string, persons:string[],numbers: string[], ides:string[]){
    this._groupList[index].name=title;
    this._groupList[index].members=persons;
    this._groupList[index].phoneNumbers=numbers;
    this._groupList[index].ids=ides;
   
    
    this.calculateDuration(index);

  //  // from https://forum.ionicframework.com/t/run-promises-in-a-loop/100198
  //  // members is global var for use in function resolveAll
  //  this.members=persons;
  //  let count: number = 0;
  //  this.resolveAll(this.contacts.find(['id'], {filter: this.members[count]}), count);
    
  }

 // private resolveAll(p: Promise<Contact[]>, count: number) {
 //   p.then(results => {
 //     this.numbersArray.push(results[0].phoneNumbers[0].value);
 //     alert("results[0]"+results[0].phoneNumbers[0].value);
 //     if (count < this.members.length) {
//        //this.options.filter = members[++count];
//        this.resolveAll(this.contacts.find(['id'], {filter: this.members[++count]}), count);
//      } else {
//        // HERE is the data you are looking for
//        alert("resArr: " + JSON.stringify(this.numbersArray));
//        this.essaiCallLog(this.numbersArray);
//      }
//    });
//  }


  calculateDuration(index: number){
    let duration:number=0;
    //let phonenumber1:string="+33651687613"; 
  //  let filters: CallLogObject[] =[ {name: "number", value: ["+33651687613","+33675374400"], operator: "==" } ,
   //                   {name:"date", value:"1541026800000", operator: ">="}];
    
    let filters: CallLogObject[] =[ {name: "number", value: this._groupList[index].phoneNumbers, operator: "==" } ,
                      {name:"date", value:"1541026800000", operator: ">="}];
    

  //or this.callLog.hasReadPermission()
    this.callLog.requestReadPermission()

    .then(()=>{
        this.callLog.getCallLog(filters)
            .then((data)=>{
                for(let i=0; i<data.length;i++){
                  duration=duration+data[i].duration;
                }
                
             //   alert("duration : "+ duration + "\n" +
             //   "data : " + JSON.stringify(data));
          
                this._groupList[index].duration=duration;
                return ;
            })
            .catch((err)=>{
                 alert("error getcallLog");
                 return;
                
            });
    })
    .catch((err)=>{
        
        alert("error requestcalLog");
        
        return ;
      });
  }

}
