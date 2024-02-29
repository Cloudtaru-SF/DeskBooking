import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import getBuildingAndFloors from '@salesforce/apex/SeatBookingHelper.getBuildingAndFloors';
import getBuildingFloors from '@salesforce/apex/SeatBookingHelper.getBuildingFloors';
import deleteSObjectRecord from '@salesforce/apex/SeatBookingHelper.deleteSObjectRecord';
import saveWorkspaceRecords from '@salesforce/apex/SeatBookingHelper.saveWorkspaceRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import DeskBooking from '@salesforce/resourceUrl/DeskBooking';

export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate = new Date().toISOString().substring(0, 10);
    @track workspaceNo;
    @api empId = '003F300000ysKQnIAM';
    @api empRole;
    @track contactRec = {};
    @track deskData = [];
    @track deskDataOriginal = [];
    @track showPagination = true;
    @track buildingName;
    @track floorNumber = '1';
    @track buildingOptions = [];
    @track floorOptions = [];
    @track workspaceOptions = [{"label":"All","value":"All"},
                               {"label":"Desk","value":"Desk"},
                               {"label":"Meeting Room","value":"Meeting Room"},
                               {"label":"Cabin","value":"Cabin"},
                               {"label":"Conference Room","value":"Conference Room"}];
    @track floorImage='';
    @track workspaceType = 'All';
    @track isFloorView = true;
    @track showModal = false;
    @track selectedIds = [];
    @track startTime = '10:00:00.000Z';
    @track endTime = '18:30:00.000Z';
    @track bookCount = 0;

    @track bookDate = new Date().toISOString().substring(0, 10);
    @track employeeName = '';
    @track isSpinner = true;
    @track deskRecord = {};
    @track deleteModal = false;

    connectedCallback(){
        getContact({empId:this.empId})
        .then(result=>{
            this.contactRec=result;
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
            this.getDeskData();
        }
        if(event.target.name == 'workspaceType'){
            this.workspaceType = event.target.value;
            if(this.workspaceType == 'All'){
                this.deskData = this.deskDataOriginal;
            } else{
                this.deskData = this.deskDataOriginal.filter(ele => ele.workSpaceType == this.workspaceType);
            }
            if(this.deskData.length<1){
                this.showToast('', `The ${this.workspaceType} space you have selected is not available`,'info');
            }
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
        this.isSpinner = true;
        this.showPagination = false;
        this.selectedIds = [];
        this.workspaceNo = '';
        showAvailableDesks({empId:this.empId, bookedDate:this.bookedForDate,buildingId:this.buildingName,floorId:this.floorNumber})
        .then(result=>{
            this.deskDataOriginal = result.deskInfo;
            this.deskData = result.deskInfo;
            this.bookCount = result.bookCount;
            this.empRole = result.empRole;
            this.isSpinner = false;
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
    }
    getBuildingFloors(buildingId){
        getBuildingFloors({buildingId:buildingId})
        .then(result=>{
            this.floorOptions = result;
            this.floorNumber = this.floorOptions[0].value;
            this.getDeskData();
            let buildingname = this.buildingOptions.find(building => building.value == this.buildingName).label;
            let floorname = this.floorOptions.find(floor => floor.value == this.floorNumber).label;
            console.log(`/${buildingname}${floorname}.jpg`);
            let s = `/${buildingname}${floorname}.jpg`;
            this.floorImage = DeskBooking + s;
        })
        .catch(error=>{

        })
    }
    openDeleteModal(event){
        this.deleteModal = true;
        this.deskRecord = this.deskDataOriginal.filter(ele => ele.bookingRecId == event.currentTarget.dataset.recid)[0];
    }
    deleteWorkSpaceAction(event){
        let recIds = [];
        recIds.push(event.currentTarget.dataset.id);
        deleteSObjectRecord({ids:recIds})
        .then(result=>{
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
        const modal = this.template.querySelectorAll('c-reusable-modal')[0];
        modal.show();
    }

    saveHandler(event){
        let records = [];
        records = this.selectedIds.map(ele=>{
                                        return {"BookedforDate__c":this.bookedForDate,
                                                "BookingStatus__c":"Booked",
                                                "Employee__c":this.empId,
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
        this.deleteModal = false;
    }
    showToast(title,message,variant) {
        this.dispatchEvent( new ShowToastEvent({title,message,variant}));
    }
    refreshParentDataHandler(event){
        this.getDeskData();
    }
}