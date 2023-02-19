
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpbdIML = '/api/iml';
var studentDatabaseName = 'SCHOOL-DB';
var studentRelationName = 'STUDENT-TABLE';
var Token = '90932573|-31949277487506255|90949336';



function saveRecNoToLocalStorage(jsonObject) {
    var lvData = JSON.parse(jsonObject.data);
    localStorage.setItem('recordNo', lvData.rec_no);
}





function resetForm() {
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#class').val("");
    $('#birthDate').val("");
    $('#inputAddress').val("");
    $('#enrollmentDate').val("");
    $('#rollNo').prop('disabled', false);
    disableAllFeildExceptRollno();
    $('#rollNo').focus();


}


function disableAllFeildExceptRollno() {
    $('#fullName').prop('disabled', true);
    $('#class').prop('disabled', true);
    $('#birthDate').prop('disabled', true);
    $('#inputAddress').prop('disabled', true);
    $('#enrollmentDate').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);
    $('#saveBtn').prop('disabled', true);
    $('#updateBtn').prop('disabled', true);
}


function fillData(jsonObject) {
    if (jsonObject === "") {
        $('#fullName').val("");
        $('#class').val("");
        $('#birthDate').val("");
        $('#inputAddress').val("");
        $('#enrollmentDate').val("");
    } else {
        
        saveRecNoToLocalStorage(jsonObject);
        
        var data = JSON.parse(jsonObject.data).record;
        $('#fullName').val(data.name);
        $('#class').val(data.className);
        $('#birthDate').val(data.birthDate);
        $('#inputAddress').val(data.address);
        $('#enrollmentDate').val(data.enrollmentData);
    }
}


function validateEnrollmentDate() {
    var inputBirthDate = $('#birthDate').val();
    var inputEnrollmentDate = $('#enrollmentDate').val();
    inputBirthDate = new Date(inputBirthDate);
    inputEnrollmentDate = new Date(inputEnrollmentDate);
    
    return inputBirthDate.getTime() < inputEnrollmentDate.getTime();

}

function validateFormData() {
    var rollNo, name, className, birthDate, address, enrollmentData;
    rollNo = $('#rollNo').val();
    name = $('#fullName').val();
    className = $('#class').val();
    birthDate = $('#birthDate').val();
    address = $('#inputAddress').val();
    enrollmentData = $('#enrollmentDate').val();

    if (rollNo === '') {
        alertHandler(0, 'Roll NO Missing');
        $('#rollNo').focus();
        return "";
    }

    if (rollNo <= 0) {
        alertHandler(0, 'Invalid Roll-No');
        $('#rollNo').focus();
        return "";
    }

    if (className === '') {
        alertHandler(0, 'Class Name is Missing');
        $('#class').focus();
        return "";
    }
    if (className <= 0 && className > 12) {
        alertHandler(0, 'Invalid Class Name');
        $('#class').focus();
        return "";
    }
    if (birthDate === '') {
        alertHandler(0, 'Birth Date Is Missing');
        $('#birthDate').focus();
        return "";
    }
    if (address === '') {
        alertHandler(0, 'Address Is Missing');
        $('#address').focus();
        return "";
    }
    if (enrollmentData === '') {
        alertHandler(0, 'Enrollment Data Is Missing');
        $('#enrollmentDate').focus();
        return "";
    }

    if (!validateEnrollmentDate()) {
        alertHandler(0, 'Invalid Enrollment Date(i.e Enrollment Date should be greater than Birth Date)');
        $('#enrollmentData').focus();
        return "";
    }

     
    var jsonStrObj = {
        id: rollNo,
        name: name,
        className: className,
        birthDate: birthDate,
        address: address,
        enrollmentData: enrollmentData
    };
    
   
    return JSON.stringify(jsonStrObj);
}


function getStudentRollnoAsJsonObj() {
    var rollNO = $('#rollNo').val();
    var jsonStr = {
        id: rollNO
    };
    return JSON.stringify(jsonStr);
}





function saveData() {
    var jsonStrObj = validateFormData();
    
    
    if (jsonStrObj === '')
        return '';

    var putRequest = createPUTRequest(Token, jsonStrObj, studentDatabaseName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpbdIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    
    $('#empid').focus();
}




function changeData() {
    $('#changeBtn').prop('disabled', true);
    var jsonChg = validateFormData();
    
    
    var updateRequest = createUPDATERecordRequest(Token, jsonChg, studentDatabaseName, studentRelationName, localStorage.getItem("recordNo"));
    jQuery.ajaxSetup({async: false});
    
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpbdIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#empid').focus();
}



function getStudentData() {

     
    if ($('#rollNo').val() === "") {
        disableAllFeildExceptRollno();
    } else if ($('#rollNo').val() < 1) {
        disableAllFeildExceptRollno();
        alertHandler(0, 'Invalid Roll-No');
        $('#rollNo').focus();
    } else {
        var studentRollnoJsonObj = getStudentRollnoAsJsonObj(); 
        
       
        var getRequest = createGET_BY_KEYRequest(Token, studentDatabaseName, studentRelationName, studentRollnoJsonObj);
        
        jQuery.ajaxSetup({async: false});
        
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({async: true});
        
     
        $('#rollNo').prop('disabled', false);
        $('#fullName').prop('disabled', false);
        $('#class').prop('disabled', false);
        $('#birthDate').prop('disabled', false);
        $('#inputAddress').prop('disabled', false);
        $('#enrollmentDate').prop('disabled', false);

        
        if (resJsonObj.status === 400) { 
            $('#resetBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', true);
            fillData("");
            $('#name').focus();
        } else if (resJsonObj.status === 200) {
            $('#rollNO').prop('disabled', true);
            fillData(resJsonObj);
            $('#resetBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', true);
            $('#name').focus();
        }
    }



}


