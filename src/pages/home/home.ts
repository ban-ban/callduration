import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
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
  nameLetters:string;
  groupList:Group[];
 

  constructor(public navCtrl: NavController,public navParams: NavParams,private storage: Storage, private _groupList: GroupListService,private modalCtrl:ModalController) {
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
    .catch((err)=>{ console.log("storage not ready:" + err)});
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

 removeGroup(index:number){
  this.groupList.splice(index,1);
  this._groupList.removeGroup(index);
     
        //recrée le groupe dans storage et option: enregistre la date de modifications
  this.storage.ready().then(()=>{
       this.storage.set("groupList",this.groupList).then( ()=> {
       });
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
