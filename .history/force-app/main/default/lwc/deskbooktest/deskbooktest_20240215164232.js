import { LightningElement, track, api} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
export default class Deskbooktest extends LightningElement {
    @api deskData;
    @api floorImage;
    selectSeatHandler(event){
        let seat = event.currentTarget.dataset.name;
        let index = event.currentTarget.dataset.index;
        let elements = this.template.querySelectorAll('.seat');
        console.log('elements8',elements);
        elements.forEach( element=>{
            
            if( element.dataset.name == seat) {
                if(element.dataset.selected==false){
                    alert('if'+element.dataset.selected);
                    element.style.backgroundColor = 'aqua';
                    element.dataset.selected = true;
                    this.deskData[index].selected = false;
                } else {
                    alert('else'+element.dataset.selected);
                    element.style.backgroundColor = 'red';
                    element.dataset.selected = false;
                    this.deskData[index].selected = true;
                }
                
            }
        
            });
    }
}