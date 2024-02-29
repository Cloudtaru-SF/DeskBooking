import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import coworkingImageOne from '@salesforce/resourceUrl/CoworkingImage';
import coworkingImageTwo from '@salesforce/resourceUrl/CoworkingImage2';
import coworkingImageThree from '@salesforce/resourceUrl/CoworkingImage3';
import coworkingImageFour from '@salesforce/resourceUrl/CoworkingImage4';
import getEmployeeDetails from '@salesforce/apex/DeskBookingLoginController.getEmployeeDetails';

export default class DeskBookingLogin extends NavigationMixin(LightningElement) {

    @track loginPage = true;
    @track homeScreen = false;
    @track workspaceImage1 = coworkingImageOne;
    @track workspaceImage2 = coworkingImageTwo;
    @track workspaceImage3 = coworkingImageThree;
    @track workspaceImage4 = coworkingImageFour;


    @track pwd;
    @track empId;
    @track empResult;
    @track empIdResult;
    @track empPwdResult;

    backgroundImagesList = [
        {
            id:1,
            header:"Book your workspace with few simple steps",
            src :this.workspaceImage1,
            // description: "Book your workspace with few simple steps"

        },
        {
            id:2,
            header:"Coming together is a beginning; keeping together is progress; working together is success.",
            src :this.workspaceImage2,
            // description: "Coming together is a beginning; keeping together is progress; working together is success."

        },
        {
            id:3,
            header:"We cannot accomplish all that we need to do without working together.",
            src :this.workspaceImage3,
            // description: "We cannot accomplish all that we need to do without working together."

        },
        {
            id:4,
            header:"A sustainable world means working together to create prosperity for all.",
            src :this.workspaceImage4,
            // description: "A sustainable world means working together to create prosperity for all."

        }

    ]

    handleEmpIdChange(event){
        this.empId = event.target.value;
        console.log('empId ' + this.empId);
    }

    handlePwdChange(event){
        this.pwd = event.target.value;
        console.log('pwd ' +this.pwd);

    }

    handleSubmit(){
        getEmployeeDetails({empId:this.empId})
        .then(result => {
            this.empResult = result;
            this.empIdResult = result.EmployeeNumber__c;
            this.empPwdResult = result.Password__c;
            console.log('emp pwd '+this.empPwdResult);
            console.log('emp result is '+JSON.stringify(this.empResult));
            
                if(this.pwd == this.empPwdResult){
                    console.log('inside if');
                    const evt = new ShowToastEvent({
                        title: 'Login Successful',
                        message : 'Login Successfully',
                        variant : 'success'
                    })
                    this.dispatchEvent(evt)
                    
                this.openHomeScreen();

                }
                else{
                    console.log('inside else');
                    const event = new ShowToastEvent({
                        title: 'Invalid Password',
                        message: 'Please enter a valid password',
                        variant: 'error'
                    })
                    this.dispatchEvent(event)   
                }
             

        })
        .catch(error => {
            console.log('error is '+JSON.stringify(error));
            const event = new ShowToastEvent({
                title: 'Invalid Employee Id',
                message: 'Please enter a valid Employee Id',
                variant: 'error'
            })
            this.dispatchEvent(event)

        });

        
    }

    openHomeScreen(){
       this.homeScreen = true;
       this.loginPage = false;
    }
    logoutHandler(){
        this.homeScreen = false;
        this.loginPage = true;
    }
}