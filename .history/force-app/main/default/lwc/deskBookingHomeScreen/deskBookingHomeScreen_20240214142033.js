import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import getBuildingAndFloors from '@salesforce/apex/SeatBookingHelper.getBuildingAndFloors';


export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate = new Date().toISOString().substring(0, 10);
    @track workspaceNo;
    @api userId = '003F300000ysKQnIAM';
    @track contactRec = {};
    @track deskData = [];
    @track showPagination = true;
    @track buildingName = '';
    @track floorNumber = 1;
    @track buildingOptions = [];
    @track floorOptions = [{"label":"1","value":"1"},
                            {"label":"2","value":"2"},
                            {"label":"3","value":"3"},
                            {"label":"4","value":"4"},
                            {"label":"5","value":"5"},
                            {"label":"6","value":"6"},
                            {"label":"7","value":"7"},
                            {"label":"8","value":"8"},
                            {"label":"9","value":"9"}];
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
        })
        .catch(error=>{

        })
    }
}