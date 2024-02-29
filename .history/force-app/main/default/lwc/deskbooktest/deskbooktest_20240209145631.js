import { LightningElement, track} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    @track data = [];
    callme(event){
        alert('Hiii');
    }
    connectedCallback(){
        showAvailableDesks({userId:''})
        .then(result=>{
            alert(JSON.stringify(result));
        })
        .catch(error=>{

        })
    }
}