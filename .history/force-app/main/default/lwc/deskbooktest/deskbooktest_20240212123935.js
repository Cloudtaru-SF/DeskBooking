import { LightningElement, track, api} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    @track data = [];
    @track employeeRole = 'Admin';
    @api userId;
    @api bookedDate;

    callme(event){
        alert('Hiii');
    }
    connectedCallback(){
        showAvailableDesks({userId:this.userId, bookedDate:this.bookedDate})
        .then(result=>{
            this.data = result;
            alert(JSON.stringify(result));
        })
        .catch(error=>{

        })
    }
}