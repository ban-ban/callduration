import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { GroupPage } from '../group/group' ;
import { NewGroupPage } from '../newgroup/newgroup' ;
import { Storage } from '@ionic/storage';
import { GroupListService } from '../../providers/group-list/group-list' ;
import { Group } from '../../interfaces/group.interface' ;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myContacts: Contact[];
  nameLetters:string;
  groupList:Group[];
 

  constructor(public navCtrl: NavController,public navParams: NavParams,private contacts: Contacts,private storage: Storage, private _groupList: GroupListService,private modalCtrl:ModalController) {
    //this.myContacts[0].displayName="affichage contact 0";
    //this.myContacts[0].id="1111";
    this.myContacts=[];
    this.nameLetters="Ar";
    this.storage.ready().then(()=>{
      this.storage.get("groupList").then((data)=>{
      console.log("constructor home, storage results");
      
      if (data!=null){
        console.log("data from storage:  ", data);
        //alert("constructor home : data from storage");
        this.groupList=data;
        this._groupList.loadGroupList(data); //fill _groupList
      }
      else {
        console.log("data =null");
       // alert("constructor home: data storage null");
        this.groupList=[];
        this._groupList.loadGroupList([]); //initialize empty _groupList
        //this.storage.set("groupList",this.groupList);
      }
      })
      .catch ((err)=>{
      //no group yet created
      console.log("err =" + err);
      alert("constructor: err ");
     
      this.groupList=[];
      this.storage.set("groupList",this.groupList);
      });
    })
    .catch((err)=>{ console.log("storage pas ready:" + err)});
  }

  IonViewDidLoad (){
    

  }

 addGroup(){
   console.log("add Group clicked");
   let modal=this.modalCtrl.create(NewGroupPage);
   modal.present();
   modal.onDidDismiss((cancel:boolean)=>{
     if (cancel) {}
     else {
       this.groupList=this._groupList.returnGroupList();
     }

   });
 }


alertContacts(){
  
  this.contacts.find(['displayName'], {filter: this.nameLetters}).then((results)=>{
    this.myContacts=results;
    console.log(results);
    alert(this.myContacts[0].displayName +  "\n" +
          this.myContacts[0].id +  "\n" +
          this.myContacts[1].displayName +  "\n" +
          this.myContacts[1].id +  "\n" +
          this.myContacts[2].displayName +  "\n" +
          this.myContacts[2].id );
  });
  
  
}


openPage(index:number){
  let modal=this.modalCtrl.create(GroupPage, {'groupIndex': index});
  modal.present();
  modal.onDidDismiss((cancel:boolean)=>{
    if (cancel) {}
    else {
      this.groupList=this._groupList.returnGroupList();
    }

  });
}

}
