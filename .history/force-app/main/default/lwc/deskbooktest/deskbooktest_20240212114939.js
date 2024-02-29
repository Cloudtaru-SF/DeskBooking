import { LightningElement, track} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    @track data = [];
    @track employeeRole = 'Admin';
    callme(event){
        alert('Hiii');
    }
    connectedCallback(){
        showAvailableDesks({userId:'003F300000ysKQnIAM'})
        .then(result=>{
            this.data = result;
            alert(JSON.stringify(result));
        })
        .catch(error=>{

        })
    }
}