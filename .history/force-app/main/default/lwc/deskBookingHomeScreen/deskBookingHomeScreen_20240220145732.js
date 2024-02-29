import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import getBuildingAndFloors from '@salesforce/apex/SeatBookingHelper.getBuildingAndFloors';
import getBuildingFloors from '@salesforce/apex/SeatBookingHelper.getBuildingFloors';
import deleteSObjectRecord from '@salesforce/apex/SeatBookingHelper.deleteSObjectRecord';
import saveWorkspaceRecords from '@salesforce/apex/SeatBookingHelper.saveWorkspaceRecords';


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
    @track showModal = false;
    @track selectedIds = [];
    @track startTime = '10:00:00.000Z';
    @track endTime = '18:30:00.000Z';


    @track bookDate = new Date().toISOString().substring(0, 10);
    @track employeeName = '';



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
            let buildingname = this.buildingOptions.find(building => building.value == this.buildingName).label;
            let floorname = this.floorOptions.find(floor => floor.value == this.floorNumber).label;
            console.log(`/${buildingname}${floorname}.jpg`);
            let s = `/${buildingname}${floorname}.jpg`;
            this.floorImage = DeskBooking + s;
        })
        .catch(error=>{

        })
    }
    deleteWorkSpaceAction(event){
        let recIds = [];
        recIds.push(event.currentTarget.dataset.id);
        deleteSObjectRecord({ids:recIds})
        .then(result=>{
            alert(result);
            if(result == 'success'){
                this.getDeskData();
            }
        })
        .catch(error=>{
            alert(JSON.stringify(error));
        })
    }
    selectedIdsHandler(event){
        this.selectedIds = event.detail;
        this.workspaceNo = '';
        this.deskData.map(ele=>{
            if(this.selectedIds.includes(ele.workspaceId)){
                this.workspaceNo = this.workspaceNo=='' ? this.workspaceNo+ele.seatNo : this.workspaceNo+','+ele.seatNo;
            }
        });
    }
    bookSeatsHandler(event){
        this.showModal = this.selectedIds.length>0 ? true : false;
    }

    saveHandler(event){
        let records = [];
        records = this.selectedIds.map(ele=>{
                                        return {"BookedforDate__c":this.bookedForDate,
                                                "BookingStatus__c":"",
                                                "Employee__c":this.userId,
                                                "EndTime__c":this.endTime,
                                                "StartTime__c":this.startTime,
                                                "WorkspaceInfo__c":ele } 
                });
        saveWorkspaceRecords({records})
        .then(result=>{
            if(result == 'success'){
                this.showModal = false;
                this.getDeskData();
            }
        })
        .catch(error=>{
            alert(JSON.stringify(error));
        })
    }

    timeHandler(event){
        if(event.target.name == 'endTime'){
            this.endTime = event.target.value;
        }
        if(event.target.name == 'startTime'){
            this.startTime = event.target.value;
        }
    }
    closeHandler(e){
        this.showModal = false;
    }
}