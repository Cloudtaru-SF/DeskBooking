import { LightningElement, track, api} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate = new Date().toISOString().substring(0, 10);
    @track workspaceNo;
    @api userId = '003F300000ysKQnIAM';
    @track contactRec = {};

    connectedCallback(){
        alert(this.bookedForDate);
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
            /*this.dispatchEvent(new CustomEvent("datechange", {
                detail: this.bookedForDate,bubbles: true, composed: true
            }));*/
        }
        if(event.target.name == 'workspaceNo'){
            this.workspaceNo = event.target.value;
        }
    }
}