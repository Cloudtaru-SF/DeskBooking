import { LightningElement } from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    callme(event){
        alert('Hiii');
    }
    connectedCallback(){
        showAvailableDesks({})
        .then(result=>{

        })
        .catch(error=>{
            
        })
    }
}