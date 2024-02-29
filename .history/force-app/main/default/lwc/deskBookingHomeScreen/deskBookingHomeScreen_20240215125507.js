import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import getBuildingAndFloors from '@salesforce/apex/SeatBookingHelper.getBuildingAndFloors';
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
    @track floorOptions = [{"label":"1","value":"1"},
                            {"label":"2","value":"2"},
                            {"label":"3","value":"3"}];
    @track workspaceOptions = [{"label":"1","value":""}]
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
        }
        if(event.target.name == 'floorNumber'){
            this.floorNumber = event.target.value;
        }
        if(event.target.name == 'workspaceType'){
            this.workspaceType = event.target.value;
        }
        // alert(this.buildingName);
        if(this.buildingName!=null && this.floorNumber!=null){
            let buildingname = this.buildingOptions.find(floor => floor.value == this.buildingName).label;
            console.log(`/${buildingname}${this.floorNumber}.jpg`);
            let s = `/${buildingname}${this.floorNumber}.jpg`;
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
            this.buildingName = this.buildingOptions[0].label;
            this.floorImage = DeskBooking + `/${this.buildingName}${this.floorNumber}.jpg`;
            console.log('floorImage',this.floorImage);
        })
        .catch(error=>{

        })
    }
    
    toggleViewHandler(event){
        this.isFloorView = event.target.checked;
        alert(this.isFloorView);
    }
}