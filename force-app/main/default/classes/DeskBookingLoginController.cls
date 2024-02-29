public without sharing class DeskBookingLoginController {
    
    @AuraEnabled(Cacheable=true)
    public static Contact getEmployeeDetails(string empId)
    {
        Contact con = [Select Id, Name, EmployeeNumber__c, EmployeeRole__c, Password__c, ReportingManager__c from Contact where EmployeeNumber__c=:empId];
        system.debug('contact data' +con);
        return con;
    }

}