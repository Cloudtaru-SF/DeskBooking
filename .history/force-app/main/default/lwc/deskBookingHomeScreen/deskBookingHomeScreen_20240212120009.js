import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate;
    @track workspaceNo;
    @api userId = '003F300000ysKQnIAM';
    @track contactRec = {};
    connectedCallback(){
        getContact({userId:this.userId})
        .then(result=>{
            this.contactRec=result;
            console.log('Desk Booking Home Screen - Contact Record : ', this.contactRec);
        })
        .catch(error=>{
            this.contactRec = {};
        })
    }

    inputsHandler(event){
        if(event.target.name == 'BookedforDate'){
            this.bookedForDate = event.target.value;
        }
        if(event.target.name == 'workspaceNo'){
            this.workspaceNo = event.target.value;
        }
    }
}