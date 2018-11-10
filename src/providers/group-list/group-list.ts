import { Injectable } from '@angular/core';
import { Group } from '../../interfaces/group.interface' ;
import { CallLog, CallLogObject } from '@ionic-native/call-log';


@Injectable()
export class GroupListService {
  private _groupList:Group[]=[];
  constructor(private callLog: CallLog) {
    console.log("constructor of group-list");
  // this._groupList=[{name:"france-hpv",duration:25,members:["rodolphe"]}];
  }

  loadGroupList(groupList: Group[]){
    console.log("loadgrouplist");
    this._groupList=groupList;
  }

  returnGroupList(){
    return this._groupList ;
  }

  addNewGroup(title: string, persons:string[]){
    let newGroup:Group = {
            name : title,
            duration : 0,
            members : persons
    };
    console.log ("add new group : "+ newGroup.name+ " members : "+newGroup.members[0]);
    if (this._groupList.length == 0){
      //first time add a group
      console.log("groupList  vide");
      this._groupList[0]= newGroup;
      this._groupList[0].duration=this.calculate_duration(0);
    }
    else {
      console.log("groupList  pas vide");
      this._groupList.unshift(newGroup); //concatenate at the beginning of the array
      this._groupList[0].duration=this.calculate_duration(0);
    }
  }

  returnGroup(index: number){
    return this._groupList[index];
  }



  updateGroup(index:number, title: string, persons:string[]){
    
    this._groupList[index].name=title;
    this._groupList[index].members=persons;
    this._groupList[index].duration=this.calculate_duration(index);
  }

  private calculate_duration(groupIndex: number){
    let groupDuration: number=0;
    let memberDuration: number;
    let callDurations : number[]=[10,20,10,20];
    let member: string="";
  
    for(let i=0;i<this._groupList[groupIndex].members.length;i++){
      member=this._groupList[groupIndex].members[i];
      memberDuration=0;
           
      //callDurations=getCallDurations(member);
      
      for(let j=0; j<callDurations.length ; j++){
        memberDuration=memberDuration+callDurations[j];
      }
      groupDuration=groupDuration+memberDuration;
    }
    return groupDuration;
   
  }

  getCallDurations(contact:string){
    let phonenumber1:string="+33651687613";
    let phonenumber2:string="";
    let totalDuration:number=0;
    let filters: CallLogObject[] =[ {name: "number", value: phonenumber1, operator: '==' } ,
                      {name:"date", value:"1541026800000", operator: ">="}];
    
    let callDurations:number[];

    this.callLog.getCallLog(filters).then((data)=>{
      alert("promise from callLog: "+ JSON.stringify(data));
      //callDurations=data.DURATION;
    }).catch((err)=>{
      alert("error calLog");
    });

    //calls transformés en durée
    return totalDuration;

  }

}
