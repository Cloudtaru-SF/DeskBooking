public without sharing class SeatBookingHelper {
    @AuraEnabled
    public static Contact getContact(String empId){
        try{
            return [SELECT Id, Name, MobilePhone, ReportsToId, Email, Title, Department, AssistantName, LeadSource, 
                    Birthdate, PhotoUrl, EmployeeNumber__c, EmployeeRole__c, DateofJoining__c, ProjectManager__c, 
                    ReportingManager__c FROM Contact WHERE Id=:empId LIMIT 1];
        }catch(exception ex){
            return null;
        }
    }
	@AuraEnabled
    public static EmpDeskInfo showAvailableDesks(String empId, Date bookedDate,String buildingId,String floorId){
        try{
            EmpDeskInfo empData = new EmpDeskInfo();
            Integer bookCount = 0;
            String employeeRole = [SELECT Id, EmployeeRole__c FROM Contact WHERE Id=:empId LIMIT 1].EmployeeRole__c;
            List<DeskInfo> desks = new List<DeskInfo>();
            Set<Id> winfoIds = new Set<Id>();
            Map<Id, WorkspaceBooking__c> mapData = new Map<Id, WorkspaceBooking__c>();
            List<Workspace_Info__c> deskSpaceRecs = [SELECT Id, Name, WorkSpace__c, Workspace_No__c,WorkspaceAvailability__c, 
                                                     WorkspaceType__c,XCoordinate__c, YCoordinate__c,  Height__c, Width__c,
                                                     Shape__c FROM Workspace_Info__c WHERE WorkSpace__r.Building__c=:buildingId
                                                     AND WorkSpace__c=:floorId];
            for(Workspace_Info__c rec : deskSpaceRecs){
                winfoIds.add(rec.Id);
            }
            List<WorkspaceBooking__c> bookings = [SELECT Id, Name,Employee__r.Name, Employee__r.EmployeeNumber__c, 
                                                 Employee__r.EmployeeRole__c,Employee__r.ProjectManager__c, 
                                                 Employee__r.ReportsToId, WorkspaceInfo__c, BookingStatus__c,
            									 BookedforDate__c,StartTime__c,EndTime__c FROM WorkspaceBooking__c WHERE 
                                                 BookedforDate__c=:bookedDate AND WorkspaceInfo__c IN : winfoIds];
            for(WorkspaceBooking__c rec : bookings){
                mapData.put(rec.WorkspaceInfo__c, rec);
            }
            for(Workspace_Info__c rec : deskSpaceRecs){
                DeskInfo deskRec = new DeskInfo();
                deskRec.employeeName = '';
                deskRec.employeeId = '';
                deskRec.employeeRole = '';
                deskRec.seatNo = rec.Workspace_No__c;
                deskRec.isDeskBooked = false;
                deskRec.selected = false;
                deskRec.workspaceId= rec.Id;
                deskRec.isDelete = false;
                deskRec.workSpaceType = rec.WorkspaceType__c;
                deskRec.disableDesk = false; 
                String bookedStatus = 'Available';
                if(mapData.containsKey(rec.Id)){
                    deskRec.bookedStatus = mapData.get(rec.Id).BookingStatus__c;
                    bookedStatus = mapData.get(rec.Id).BookingStatus__c;
                    deskRec.employeeName = mapData.get(rec.Id).Employee__r?.Name;
                	deskRec.employeeId = mapData.get(rec.Id).Employee__c;
                	deskRec.employeeRole = mapData.get(rec.Id).Employee__r?.EmployeeRole__c;
                    //deskRec.isDeskBooked = bookedStatus == 'Booked' || bookedStatus == 'Reserved' ? true : false;
                    deskRec.bookedCss = bookedStatus == 'Booked' || bookedStatus == 'Reserved' ? 'success' : 'default';
                	deskRec.startTime = String.valueOf(mapData.get(rec.Id).StartTime__c);
                    deskRec.endTime = String.valueOf(mapData.get(rec.Id).EndTime__c);
                    deskRec.isDelete = mapData.get(rec.Id).BookedforDate__c < system.Today() ? false : true;
                    deskRec.bookingRecId = mapData.get(rec.Id).Id;
                    if(mapData.get(rec.Id).Employee__c==empId && bookedStatus == 'Booked'){
                       bookCount =bookCount+1;
                    }
                    if(employeeRole=='Admin' && (bookedStatus == 'Booked' || bookedStatus == 'Reserved' || 
                                                bookedStatus == 'Pending' || bookedStatus == 'Rejected')){
                        deskRec.isDeskBooked = true;
                    }
                    else if((employeeRole=='Employee' || employeeRole=='Manager') && 
                            (bookedStatus == 'Booked' || bookedStatus == 'Reserved' || bookedStatus == 'Pending'
                             || bookedStatus == 'Rejected')){
                        deskRec.isDeskBooked = true;
                    }
                    system.debug(bookCount);
                }
                if((employeeRole=='Admin') || (employeeRole=='Employee') && rec.WorkspaceType__c != 'Desk'){
                   deskRec.disableDesk = true; 
                }
                String booked = mapData.containsKey(rec.Id) ? 'white' : 'black';
                String style = 'left:'+String.valueOf(rec.XCoordinate__c)+'px;top:'+String.valueOf(rec.YCoordinate__c)
                        			+'px;border:2px solid '+booked+';width:'+String.valueOf(rec.Width__c)+
                        			'px;height:'+String.valueOf(rec.Height__c)+'px;';
                style = rec.Shape__c == 'Circle' ? style+'border-radius:50%;' : style;
                deskRec.style = (bookedStatus == 'Booked' || bookedStatus == 'Reserved') && deskRec.employeeId==empId  ? style+'background-color: green;' 
                    			: bookedStatus == 'Booked' || bookedStatus == 'Reserved' ? style+'background-color: #FC6666;' 
                    			: bookedStatus == 'Available' ? style+'background-color: #DAD3C9;' 
                                : bookedStatus == 'Pending' ? style+'background-color: #FFCD99;' 
                				: bookedStatus == 'Rejected' ? style+'background-color: #ffb307;' : style;//opacity: .4;
                deskRec.bookedDate = system.today();
                desks.add(deskRec);
            }
            empData.deskInfo = new List<DeskInfo>();
            empData.deskInfo = desks;
            empData.bookCount = bookCount;
            empData.empId = empId;
            empData.empRole = employeeRole;
        	return empData;
        }catch(exception ex){
            return null;
        }
    }
    @AuraEnabled
    public static List<Map<String,String>> getBuildingAndFloors(){
        try{
            List<Map<String,String>> options =new List<Map<String,String>>();
            List<Id> ids = new List<Id>();
            for(WorkSpace__c ws : [SELECT Id,Building__r.Name,Building__c FROM WorkSpace__c WHERE Building__c!=null]){
                if(!ids.contains(ws.Building__c)){
                    Map<String,String> option = new Map<String,String>{'label'=>ws.Building__r.Name,'value'=>ws.Building__c};                           
                    options.add(option);
                    ids.add(ws.Building__c);
                }
            }
            return options;
        }catch(exception ex){
            return null;
        }
    }
    @AuraEnabled
    public static List<Map<String,String>> getBuildingFloors(String buildingId){
        try{
            List<Map<String,String>> options =new List<Map<String,String>>();
            for(WorkSpace__c ws : [SELECT Id,Floor__c FROM WorkSpace__c WHERE Building__c=:buildingId]){
                Map<String,String> option = new Map<String,String>{'label'=>ws.Floor__c,'value'=>ws.Id};                           
                options.add(option); 
            }
            return options;
        }catch(exception ex){
            return null;
        }
    }
    @AuraEnabled
    public static String deleteSObjectRecord(List<Id> ids){
        try{
            List<WorkspaceBooking__c> recordsToDelete = new List<WorkspaceBooking__c>();
            for(Id recId : ids){
                WorkspaceBooking__c rec = new WorkspaceBooking__c(Id=recId);
                recordsToDelete.add(rec);
            }
            delete recordsToDelete;
            return 'success';
        }catch(exception ex){
            return ex.getMessage();
        }
    }
    @AuraEnabled
    public static String saveWorkspaceRecords(List<WorkspaceBooking__c> records){
        try{
            insert records;
            return 'success';
        }catch(exception ex){
            return ex.getMessage();
        }
    }
    @AuraEnabled
    public static String updateWorkspaceRecords(List<WorkspaceBooking__c> records){
        try{
            update records;
            return 'success';
        }catch(exception ex){
            return ex.getMessage();
        }
    }
    public class EmpDeskInfo{
        @AuraEnabled
        public String empId {set;get;}
        @AuraEnabled
        public String empRole {set;get;}
        @AuraEnabled
        public List<DeskInfo> deskInfo {set;get;}
        @AuraEnabled
        public Integer bookCount {set;get;}
    }
    public class DeskInfo{
        @AuraEnabled
        public String employeeName {set;get;}
        @AuraEnabled
        public String employeeId {set;get;}
        @AuraEnabled
        public String employeeRole {set;get;}
        @AuraEnabled
        public String workspaceId {set;get;}
        @AuraEnabled
        public String seatNo {set;get;}
        @AuraEnabled
        public Boolean isDeskBooked {set;get;}
        @AuraEnabled
        public Date bookedDate {set;get;}
        @AuraEnabled
        public Boolean disableDesk {set;get;}
        @AuraEnabled
        public String style {set;get;}
        @AuraEnabled
        public String startTime {set;get;}
        @AuraEnabled
        public String endTime {set;get;}
        @AuraEnabled
        public Boolean selected {set;get;}
        @AuraEnabled
        public Boolean isDelete {set;get;}
        @AuraEnabled
        public String workSpaceType {set;get;}
        @AuraEnabled
        public String bookingRecId {set;get;}
        @AuraEnabled
        public String bookedCss {set;get;}
        @AuraEnabled
        public String bookedStatus {set;get;}
        
    }
}