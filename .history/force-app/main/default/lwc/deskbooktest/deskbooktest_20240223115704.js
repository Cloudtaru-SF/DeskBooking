import { LightningElement, track, api} from 'lwc';
import showAvailableDesks from '@salesforce/apex/SeatBookingHelper.showAvailableDesks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Deskbooktest extends LightningElement {
    @api deskData;
    @api floorImage;
    @track selectedrecordIds = [];
    @api bookCount;
    @api empRole;
    @track deskRecord = {};
    @track showModal = false;
    
    selectSeatHandler(event){
        let isBooked = event.currentTarget.dataset.booked;
        let seat = event.currentTarget.dataset.name;
        let index = event.currentTarget.dataset.index;
        if(this.empRole=='Admin'){
            this.deskRecord = this.deskData?.filter(ele=>ele.bookingRecId == event.currentTarget.dataset.recid)[0];
            if(this.deskRecord.bookingRecId!=null){
                this.showModal = true;
            } else {

            }
        }
        else if(isBooked == 'false' && event.currentTarget.dataset.disable=='false' && this.bookCount<1  && this.empRole!='Admin' ){
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
        }else if(isBooked == 'true'){
            this.showToast('','The workspace you have selected is already booked','info');
        }else if(this.bookCount>0){
            this.showToast('','You already booked workspace','info');
        }
    }
    showToast(title,message,variant) {
        this.dispatchEvent( new ShowToastEvent({title,message,variant}));
    }
    closeHandler(){
        this.showModal = false;
    }
}