import { LightningElement, track, api} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Deskbooktest extends LightningElement {
    @api deskData;
    @api floorImage;
    @track selectedrecordIds = [];
    selectSeatHandler(event){
        let isBooked = event.currentTarget.dataset.booked;
        let seat = event.currentTarget.dataset.name;
        let index = event.currentTarget.dataset.index;
        alert(index);
        alert(event.currentTarget.dataset.spaceid);
        if(isBooked == 'false'){
            let elements = this.template.querySelectorAll('.seat');
            elements.forEach( element=>{
                if( element.dataset.name == seat) {
                    if(element.dataset.selected=="false"){
                        element.style.backgroundColor = '#ADFCAD';
                        element.dataset.selected = "true";
                    } else {
                        element.style.backgroundColor = '#DAD3C9';
                        element.dataset.selected = "false";
                    }
                }
            });
            this.selectedrecordIds = elements.filter(item => item !== value)
            alert(JSON.stringify(this.selectedrecordIds));
        } else {
            this.showToast('','The space you have selected is already booked','info');
        }
    }
    showToast(title,message,variant) {
        this.dispatchEvent( new ShowToastEvent({title,message,variant}));
    }
}