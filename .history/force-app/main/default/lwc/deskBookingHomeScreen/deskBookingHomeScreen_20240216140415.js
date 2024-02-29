import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import getBuildingAndFloors from '@salesforce/apex/SeatBookingHelper.getBuildingAndFloors';
import getBuildingFloors from '@salesforce/apex/SeatBookingHelper.getBuildingFloors';


import DeskBooking from '@salesforce/resourceUrl/DeskBooking';

export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate = new Date().toISOString().substring(0, 10);
    @track workspaceNo;
    @api userId = '003F300000ysKQnIAM';
    @track contactRec = {};
    @track deskData = [];
    @track showPagination = true;
    @track buildingName;
    @track floorNumber = '1';
    @track buildingOptions = [];
    @track floorOptions = [];
    @track workspaceOptions = [{"label":"Desk","value":"Desk"},
                               {"label":"Meeting Room","value":"Meeting Room"},
                               {"label":"Cabin","value":"Cabin"},
                               {"label":"Conference Room","value":"Conference Room"}];
    @track floorImage='';
    @track workspaceType = '';
    @track isFloorView = true;


    connectedCallback(){
        getContact({userId:this.userId})
        .then(result=>{
            this.contactRec=result;
            this.getDeskData();
        })
        .catch(error=>{
            this.contactRec = {};
        })
        this.getBuildingAndFloors();
    }

    inputsHandler(event){
        if(event.target.name == 'BookedforDate'){
            this.bookedForDate = event.target.value;
            this.getDeskData();
        }
        if(event.target.name == 'workspaceNo'){
            this.workspaceNo = event.target.value;
        }
        if(event.target.name == 'buildingName'){
            this.buildingName = event.target.value;
            this.getBuildingFloors(this.buildingName);
        }
        if(event.target.name == 'floorNumber'){
            this.floorNumber = event.target.value;
        }
        if(event.target.name == 'workspaceType'){
            this.workspaceType = event.target.value;
        }
        // alert(this.buildingName);
        if(this.buildingName!=null && this.floorNumber!=null){
            let buildingname = this.buildingOptions.find(building => building.value == this.buildingName).label;
            let floorname = this.floorOptions.find(floor => floor.value == this.floorNumber).label;
            console.log(`/${buildingname}${floorname}.jpg`);
            let s = `/${buildingname}${floorname}.jpg`;
            this.floorImage = DeskBooking + s;
        }
    }

    getDeskData(){
        this.showPagination = false;
        showAvailableDesks({userId:this.userId, bookedDate:this.bookedForDate})
        .then(result=>{
            this.deskData = result;
            this.deskData.map(desk=>{
                if(desk.isDeskBooked){
                    this.showPagination = true;
                }
            })
            console.log('deskData',this.deskData);
        })
        .catch(error=>{
    
        })
    }
    getBuildingAndFloors(){
        this.buildingOptions = [];
        getBuildingAndFloors({})
        .then(result=>{
            this.buildingOptions = result;
            this.buildingName = this.buildingOptions[0].value;
            this.getBuildingFloors(this.buildingName);
        })
        .catch(error=>{

        })
    }
    
    toggleViewHandler(event){
        this.isFloorView = event.target.checked;
        alert(this.isFloorView);
    }
    getBuildingFloors(buildingId){
        getBuildingFloors({buildingId:buildingId})
        .then(result=>{
            this.floorOptions = result;
            this.floorNumber = this.floorOptions[0].value;
            alert(JSON.stringify(this.floorOptions));
            let buildingname = this.buildingOptions.find(building => building.value == this.buildingName).label;
            let floorname = this.floorOptions.find(floor => floor.value == this.floorNumber).label;
            console.log(`/${buildingname}${floorname}.jpg`);
            let s = `/${buildingname}${floorname}.jpg`;
            this.floorImage = DeskBooking + s;
        })
        .catch(error=>{

        })
    }
}