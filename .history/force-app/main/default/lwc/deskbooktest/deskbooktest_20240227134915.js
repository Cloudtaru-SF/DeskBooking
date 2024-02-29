import { LightningElement, track, api} from 'lwc';
import deleteSObjectRecord from '@salesforce/apex/SeatBookingHelper.deleteSObjectRecord';
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
                this.showToast('','Selected workspace not booked. Please choose another.','info');
            }
        }


        if(this.empRole=='Employee' && isBooked == 'false' && event.currentTarget.dataset.disable=='false' && this.bookCount<1){
            let elements = this.template.querySelectorAll('.seat');
            elements.forEach( element=>{
                if(this.selectedrecordIds.length >= 1) {
                    this.showToast('','Sorry, you cannot book more than one workspace for a day','info');
                }
                else if( element.dataset.name == seat  && this.selectedrecordIds.length < 1)  {
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
                } else if(element.dataset.name == seat  && this.selectedrecordIds.includes(element.dataset.name)){
                    element.style.backgroundColor = '#DAD3C9';
                    element.dataset.selected = "false";
                    if (this.selectedrecordIds.indexOf(event.currentTarget.dataset.spaceid) > -1) {
                        this.selectedrecordIds.splice(this.selectedrecordIds.indexOf(event.currentTarget.dataset.spaceid), 1);
                    }
                }
            });
            this.dispatchEvent(new CustomEvent("selectedids", { detail: this.selectedrecordIds }));
        } else if(this.bookCount >= 1) {
            this.showToast('','Sorry, you cannot book more than one workspace for a day','info');
        }else if(event.currentTarget.dataset.disable=='true'){
            this.showToast('','The workspace you have selected is not available for you.','info');
        }else if(isBooked == 'true'){
            this.showToast('','The workspace you have selected is already booked','info');
        }else if(this.bookCount>=0){
            this.showToast('','You already booked workspace','info');
        }



        if(this.empRole=='Manager' && isBooked == 'false' && event.currentTarget.dataset.disable=='false' ){
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
    deleteWorkSpaceAction(event){
        let recIds = [];
        recIds.push(event.currentTarget.dataset.id);
        deleteSObjectRecord({ids:recIds})
        .then(result=>{
            if(result == 'success'){
                this.dispatchEvent(new CustomEvent("refreshdata"));
                this.showModal = false;
            }
        })
        .catch(error=>{
            alert(JSON.stringify(error));
        })
    }
}