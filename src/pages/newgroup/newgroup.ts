import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';


import { GroupListService} from '../../providers/group-list/group-list' ;
import { Group } from '../../interfaces/group.interface';


@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewGroupPage {
    groupName:any="";
    modifiedGroupName:any="";
    newMember:string;
    searchName:string;
    members:string[];
    plus: boolean;
    myContacts: Contact[];
    

    constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,private contacts: Contacts, private viewCtrl: ViewController, private _groupList:GroupListService) {
      
      this.groupName="";
      this.modifiedGroupName=this.groupName;
      this.newMember="nouveau membre";
      this.searchName="";
      this.plus=false;
      this.myContacts=[];
      this.members=[]; 
      
    }
   
    findContacts(nameToSearch: string){
        this.myContacts=[];
        this.contacts.find(['displayName'], {filter: this.searchName}).then((results)=>{
            this.myContacts=results;
            //console.log(results);
        });
    }
  

    selectContact(index: number){
      this.plus=false;
      this.members.push(this.myContacts[index].displayName);
    }

    updateGroupName(newGroupName:string) {
      
      if (newGroupName != this.groupName) {
        //modify storage of groupName
        //groupList[indexGroup].groupName=newGroupName ;
        console.log("newGroupName:" + newGroupName);
        console.log("oldGroupName:" + this.groupName);
        
      }
    }

   

    removeMember(index:number) {
      
      this.members.splice(index,1);
    }

    addMember(){
      this.myContacts=[];
      this.searchName="";

      this.plus=true;
      
    }

    createGroup(){
       
        //this.members.push("alban");
        if (this.members.length>0){
          this._groupList.addNewGroup(this.modifiedGroupName, this.members);
          console.log("namegroup"+ this.modifiedGroupName, "members"+ this.members[0]);
          
          let groupList : Group[] = this._groupList.returnGroupList();
         // alert ('groupList: name :'+ groupList[0].name);
          //recrée le groupe dans storage et option: enregistre la date de modifications
          this.storage.ready().then(()=>{
            this.storage.set("groupList",groupList).then( ()=> {
             // alert("storage groupList");
              this.viewCtrl.dismiss(false);
              });
            });
        }
        else {
          alert("at least one member");
        }
    }

    dismissModal(){
      this.viewCtrl.dismiss(true);
    }

}
