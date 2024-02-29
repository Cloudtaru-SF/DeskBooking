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
        if(isBooked == 'false' && event.currentTarget.dataset.disable=='false'){
            let elements = this.template.querySelectorAll('.seat');
            elements.forEach( element=>{
                if( element.dataset.name == seat) {
                    if(element.dataset.selected=="false"){
                        element.style.backgroundColor = '#ADFCAD';
                        element.dataset.selected = "true";
                        if(event.currentTarget.dataset.spaceid!=null){
                            this.selectedrecordIds.push(event.currentTarget.dataset.spaceid);
                        }
                    } else {
                        element.style.backgroundColor = '#DAD3C9';
                        element.dataset.selected = "false";
                        if (this.selectedrecordIds.indexOf(event.currentTarget.dataset.spaceid) > -1) {
                            this.selectedrecordIds.splice(this.selectedrecordIds.indexOf(event.currentTarget.dataset.spaceid), 1);
                        }
                    }
                }
            });
            this.dispatchEvent(new CustomEvent("selectedids", { detail: this.selectedrecordIds }));
            //alert(JSON.stringify(this.selectedrecordIds));
        } 
        else if(event.currentTarget.dataset.disable=='true'){
            this.showToast('','The workspace you have selected is not available for you.','info');
        }else {
            this.showToast('','The workspace you have selected is already booked','info');
        }
    }
    showToast(title,message,variant) {
        this.dispatchEvent( new ShowToastEvent({title,message,variant}));
    }
}