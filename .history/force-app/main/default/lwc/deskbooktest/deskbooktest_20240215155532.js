import { LightningElement, track, api} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    @api deskData;
    @api floorImage;
    selectSeatHandler(event){
        let seat = event.currentTarget.dataset.name;
        let elements = this.template.querySelectorAll('.seat');
        console.log('elements8',elements);
        elements.forEach( element=>
            {
                element.style.backgroundColor = 'aqua';
            }
        );
    }
}