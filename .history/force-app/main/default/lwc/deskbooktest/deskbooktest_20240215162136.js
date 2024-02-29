import { LightningElement, track, api} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    @api deskData;
    @api floorImage;
    selectSeatHandler(event){
        let seat = event.currentTarget.dataset.name;
        let elements = this.template.querySelectorAll('.seat');
        console.log('elements8',elements);
        elements.forEach( element=>{
            alert(element.dataset.selected);
            if( element.dataset.name == seat) {
                if(element.dataset.selected){
                    element.style.backgroundColor = 'aqua';
                    element.dataset.selected = false;
                } else {
                    element.style.backgroundColor = 'red';
                    element.dataset.selected = true;
                }
            }
        
            });
    }
}