import { LightningElement, track} from 'lwc';
import getContact from '@salesforce/apex/SeatBookingHelper.getContact';
export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate;
    @track workspaceNo;
    connectedCallback(){
        getContact({})
        .then(result=>{

        })
        .catch(error=>{
            
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