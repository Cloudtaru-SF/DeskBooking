import { LightningElement, track} from 'lwc';

export default class DeskBookingHomeScreen extends LightningElement {
    @track bookedForDate;
    @track workspaceNo;
    inputsHandler(event){
        if(event.target.name == 'BookedforDate'){
            this.bookedForDate = event.target.value;
        }
        if(event.target.name == 'workspaceNo'){
            this.workspaceNo = event.target.value;
        }
    }
}