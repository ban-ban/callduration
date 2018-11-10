import { Component } from '@angular/core';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';

import { GroupListService} from '../../providers/group-list/group-list' ;
import { Group } from '../../interfaces/group.interface';




@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
    groupName:any="";
    modifiedGroupName:any="";
    newMember:string;
    searchName:string;
    members:string[];
    plus: boolean;
    myContacts: Contact[];
    groupIndex: number ;
    myGroup:Group;

    constructor(public navCtrl: NavController, public navParams: NavParams,private contacts: Contacts,private storage: Storage,private viewCtrl: ViewController, private _groupList:GroupListService) {
      this.groupIndex=this.navParams.get("groupIndex");
      this.myGroup=this._groupList.returnGroup(this.groupIndex);
      this.groupName=this.myGroup.name;
      //console.log(this.groupName);
      this.modifiedGroupName=this.groupName;
      this.newMember="nouveau membre";
      this.searchName="";
      this.plus=false;
      this.myContacts=[];
      this.members=this.myGroup.members;
      // this.members=["M.Bertrand","Jeremy","Damien Roig"];
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
      //groupList[indexGroup].memberList.splice(indexMember, 1);
      this.members.splice(index,1);
    }

    addMember(){
      this.myContacts=[];
      this.searchName="";

      this.plus=true; //new member item is not hidden anymore
      
    }

    updateGroup(){
      //
      if (this.members.length>0){
        this._groupList.updateGroup(this.groupIndex, this.modifiedGroupName, this.members);
        let groupList : Group[] = this._groupList.returnGroupList();
        
        //recrée le groupe dans storage et option: enregistre la date de modifications
        this.storage.ready().then(()=>{
          this.storage.set("groupList",groupList).then( ()=> {
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
