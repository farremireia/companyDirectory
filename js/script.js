// VARIABLES
let employeeID;

let profile = {
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    location: "",
}

var filterBy;



// EVENTS:
$(document).ready(function() {

    $('#back-to-top').click(function () {

        $('.block3').animate({
    
            scrollTop: 0
    
        }, 400);
    
        return false;
        
    });

    $.ajax({

        type: 'GET',
        url: 'php/getAll.php', 
        dataType: 'json',
    
        success: function(data) {
            
            var alphabet = data.nav;
            
            var db = data.data;
            
            for (var letter of alphabet) {

              $("#nav").append(`<li><a href="?firstLetter=${letter}">${letter}</a></li>`);
            
            }
     
            for (let i in db) {
                
                $('#database').append(`
                
                    <div class="loadProfile col-sm-6 col-md-4" onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
                    
                        <div class="widget col-3 profile">
                        
                            <div class="widget-simple">

                            <span>
                            
                                    <img src="img/user-regulars.svg" alt="avatar" class="widget-image img-circle pull-left animation-fadeIn">
                            
                                </span>
                            
                                <h4 class="widget-content text-left">
                                    
                                    <span id="fullName">${db[i].lastName}, ${db[i].firstName}</span>
                                        
                                    <p class="findID" style="font-size:11px; color: rgb(190, 190, 190); display: none"> - ID: ${db[i].id}</p>
                                        
                                    <br>
                                
                                    <div class="info" style: "overflow: hidden">
                    
                                        <p class=${filterBy == "department"} style="font-size:11px; color: rgb(190, 190, 190); float: left">${db[i].department}</p>
                                        <p class=${filterBy == "location"} style="font-size:11px; color: rgb(190, 190, 190); float: left">, ${db[i].location}</p>

                                        <a href="" class="btn btn-xs btn-primary2 Phone" data-toggle="tooltip" title="" data-original-title="Phone"><i class="fa fa-phone"></i></a>
                                        <a href="mailto:${db[i].email}" rel="prefetch" id="eM" class="btn btn-xs btn-primary Email" data-toggle="tooltip" title="" data-original-title="Email"><i class="fas fa-envelope"></i></a>
                                                
                                    </div>
                                        
                                </h4>

                            </div>
                            
                        </div>
                
                    </div>
                    
                `)

            }

            $('#nav').on('click', 'a', function(e) {

                var to_search = $(this).text().toLowerCase().trim()

                e.preventDefault()

                if (to_search != "all") {

                    $(".loadProfile").hide() 

                    $(".loadProfile #fullName").each(function() {

                        var value = $(this).text().toLowerCase().trim().split(",")[0]

                        if (value.charAt(0) == to_search) {
                        
                            $(this).closest(".loadProfile").delay(100).fadeIn();
                        
                        }
                  
                    })
                
                } else {
            
                    $(".loadProfile").delay(100).fadeIn();
              
                }
            
            });

            return true;

        }

    })

})



//FUNCTIONS:
function addDepartment() {

    let departmentName = $('#addDepartmentDepartment').val()
    let locationName = $('#addDepartmentLocation').val()

    $.getJSON(`php/getAllLocations.php`, function (locations) {

        let locationID = locations.data.filter(loc => loc.name == locationName)[0].id

        $.ajax({

            data: {
                'name': departmentName,
                'locationID': locationID,
            },
            url: 'php/insertDepartment.php', 
            dataType: 'json',

            success: function(data) {

                $('#addDepartmentDepartment').val("")
                $('#addDepartmentLocation').find('option:eq(0)').prop('selected', true);
    
            }

        })

    }); 

}

function addEmployee() {

    let departmentName = $('#addEmployeeDepartment').val()

    $.getJSON(`php/getAllDepartments.php`, function (departments) {

        let departmentID = departments.data.filter(dep => dep.name == departmentName)[0].id

        $.ajax({

            data: {
                'firstName': $('#addEmployeeFirstName').val(),
                'lastName': $('#addEmployeeLastName').val(),
                'email': $('#addEmployeeEmail').val(),
                'departmentID': departmentID
            },
            url: 'php/insertEmployee.php', 
            dataType: 'json',

            success: function(data) {
                
                $('#database').html(`

                    <h4>

                        <span class="hideCell"></span>
                        <p class="findID"></p>
                    
                        <br>
                        
                        <div class="hideCell">
                    
                            <p class="hideCell" id="departmentHeader"></p>
                            <p class="hideCell" id="locationHeader"></p>

                            <span class="hideCell"</span>
                            <span class="hideCell"</span>
                            
                        </div>
                    
                    </h4>

                `)

                $('#addEmployeeFirstName').val("")
                $('#addEmployeeLastName').val("")
                $('#addEmployeeEmail').val("")
                $('#addEmployeeDepartment').find('option:eq(0)').prop('selected', true);
            
                
                $.ajax({

                    type: 'GET',
                    url: 'php/getAll.php', 
                    dataType: 'json',
                    
                    success: function(data, letterData) {

                        var db = data.data;

                        for (let i in db) {

                            $('#database').append(`
                            
                                <div class="loadProfile col-sm-6 col-md-4" onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
                                    
                                    <div class="widget col-3 profile">
                                    
                                        <div class="widget-simple">

                                            <span>
                                        
                                                <img src="img/user-regulars.svg" alt="avatar" class="widget-image img-circle pull-left animation-fadeIn">
                                            
                                            </span>
                                        
                                            <h4 class="widget-content text-left">
                                        
                                                <span id="fullName">${db[i].lastName}, ${db[i].firstName}</span>
                                                <p class="findID" style="font-size:11px; color: rgb(190, 190, 190); display: none"> - ID: ${db[i].id}</p>
                                            
                                                <br>
                                                            
                                                <div class="info" style: "overflow: hidden">
                                                
                                                    <p class=${filterBy == "department"} style="font-size:11px; color: rgb(190, 190, 190); float: left">${db[i].department}</p>
                                                    <p class=${filterBy == "location"} style="font-size:11px; color: rgb(190, 190, 190); float: left">, ${db[i].location}</p>

                                                    <a href="" class="btn btn-xs btn-primary2 Phone" data-toggle="tooltip" title="" data-original-title="Phone"><i class="fa fa-phone"></i></a>
                                                    <a href="mailto:${db[i].email}" rel="prefetch" id="eM" class="btn btn-xs btn-primary Email" data-toggle="tooltip" title="" data-original-title="Email"><i class="fas fa-envelope"></i></a>
                                                        
                                                </div>
                                                
                                            </h4>

                                        </div>

                                    </div>
                            
                                </div>
                        
                            `)

                        }            

                    }

                })

                setTimeout(function(){
                    
                    $('#confirm').hide();
                    
                    $('#profilePage').hide();
                    
                    window. location. reload(1);
                    
                }, 1500);
                
            }
            
        })

    })   
    
}

function addLocation() {

    let locationName = $('#addLocationLocation').val()

    $.getJSON(`php/getAllLocations.php`, function (locations) {

        let locationID = locations.data[0].id

        $.ajax({

            data: {
                'name': locationName,
                'locationID': locationID,
            },
            url: 'php/insertLocation.php', 
            dataType: 'json',

            success: function(data) {

                $('#addLocationLocation').val("")

            }

        })

    }); 
}

function capitalizeFirstLetter(word) {

    return word.charAt(0).toUpperCase() + word.slice(1);

}

function deleteEmployee() {

    $.ajax({

        data: {'id': employeeID},
        url: 'php/deleteEmployeeByID.php', 
        dataType: 'json',

        success: function(data) {

            $('#database').html(`

                <h4>

                    <span class="hideCell"></span>
                    <p class="findID"></p>
                
                    <br>
                        
                    <div class="hideCell">
                    
                        <p class="hideCell" id="departmentHeader"></p>
                        <p class="hideCell" id="locationHeader"></p>

                        <span class="hideCell"</span>
                        <span class="hideCell"</span>
                        
                    </div>

                </h4>

            `)


            $.ajax({

                type: 'GET',
                url: 'php/getAll.php', 
                dataType: 'json',
                
                success: function(data) {
        
                    var db = data.data;
        
                    for (let i in db) {
        
                        $('#database').append(`
                
                            <div class="loadProfile col-sm-6 col-md-4" onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
                                
                                <div class="widget col-3 profile">
                                    
                                    <div class="widget-simple">
                
                                        <span>
                                    
                                            <img src="img/user-regulars.svg" alt="avatar" class="widget-image img-circle pull-left animation-fadeIn">
                                        
                                        </span>
                                    
                                        <h4 class="widget-content text-left">
                                    
                                            <span id="fullName">${db[i].lastName}, ${db[i].firstName}</span>
                                            <p class="findID" style="font-size:11px; color: rgb(190, 190, 190); display: none"> - ID: ${db[i].id}</p>
                                    
                                            <br>
                                                            
                                            <div class="info" style: "overflow: hidden">
                                            
                                                <p class=${filterBy == "department"} style="font-size:11px; color: rgb(190, 190, 190); float: left">${db[i].department}</p>
                                                <p class=${filterBy == "location"} style="font-size:11px; color: rgb(190, 190, 190); float: left">, ${db[i].location}</p>
            
                                                <a href="" class="btn btn-xs btn-primary2 Phone" data-toggle="tooltip" title="" data-original-title="Phone"><i class="fa fa-phone"></i></a>
                                                <a href="mailto:${db[i].email}" rel="prefetch" id="eM" class="btn btn-xs btn-primary Email" data-toggle="tooltip" title="" data-original-title="Email"><i class="fas fa-envelope"></i></a>
                                                    
                                            </div>
                                            
                                        </h4>
                
                                    </div>

                                </div>
                        
                            </div>
                
                        `)
        
                    }
                    
                }
        
            })
                
        }  

    })

}

function editProfile() {

    if ($('#editButton').text() == " ") {
    

        $('#editButton').replaceWith(`
        
        <div class="btn btn-xs btn-primary5" id="confirmButton" style="float: right !important;  margin-right: 30px !important;" onclick="editProfile()"><i class="fa fa-check-circle fa-xs" aria-hidden="true" view="" type="button" data-toggle="modal" style="margin-top: -4px !important"></i></div>


        `);

        for (let i = 1; i < 5; i++) {
            
            let entry = $('#userInfo').children().eq(i).children().eq(1);
            let entryText = entry.text();
            let id = entry.attr('id')

            profile[id] = entryText;

            if (i < 4) {

                entry.replaceWith(`<input id='${id}' placeholder='${entryText}' style="float: right !important; width: 30% !important">`)

            }  else {

                entry.replaceWith(`<select onchange="updateLocation()" id='${id}' style="float: right !important; width: 30% !important"></select>`)

                var category = capitalizeFirstLetter(id)
                populateSelectOptions(category, id)

                $(`#${id}`).append(`<option selected="true" width: 30% !important">${entryText}</option>`)
    
            }

        }
    
    } else {
        
        $('#editButton').text()

        for (let i = 1; i < 5; i++) {
            
            let entry = $('#userInfo').children().eq(i).children().eq(1);
            let entryText = entry.val();
            let id = entry.attr('id')

            if (entryText) {
                
                profile[id] = entryText;
            
            }

            entry.replaceWith(`<span class="col-sm-4" style="color: black" id="${id}">${profile[id]}</span>`)
        
        }

        $('#displayName').children().text(`${profile.firstName} ${profile.lastName}`)

        updateEmployee()

        setTimeout(function(){
        
            $('#confirm').hide();
        
            $('#profilePage').hide();
        
            window. location. reload(1);
        
        }, 1500);
    
    }

}

function loadProfile(profile) {
    
    $('#profilePage').css("display", "block")

    $('#id').text(profile.id)

    $('#displayName').children().text(`${profile.firstName}  ${profile.lastName}`)
    $('#firstName').text(profile.firstName)
    $('#lastName').text(profile.lastName)
    $('#email').text(profile.email)
    $('#department').text(profile.department)
    $('#location').text(profile.location)

    $.ajax({

        type: 'GET',
        url: 'php/getAll.php', 
        dataType: 'json',
        
        success: function(data) {

            var db = data.data;

            for (let i in db) {

                $('#databaseUsers').append(`
        
    
                    <div class="loadProfile col-sm-7 col-md-12" onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
                        
                        <div class="widget col-4 profile">
                        
                            <div class="widget-simple">
        
                                <span>
                            
                                    <img src="img/user-regulars.svg" alt="avatar" class="widget-image img-circle pull-left animation-fadeIn">
                                
                                </span>
                            
                                <h4 class="widget-content text-left">
                            
                                    <span id="fullName">${db[i].lastName}, ${db[i].firstName}</span>
                                    <p class="findID" style="font-size:11px; color: rgb(190, 190, 190); display: none"> - ID: ${db[i].id}</p>
                                        
                                    <br>
                                            
                                    <div class="info" style: "overflow: hidden">
                                        
                                        <p class=${(filterBy == "department") ? "" : "hideCell"} style="font-size:11px; color: rgb(190, 190, 190); float: left">${db[i].department}</p>
                                        <p class=${(filterBy == "location") ? "" : "hideCell"} style="font-size:11px; color: rgb(190, 190, 190); float: left">, ${db[i].location}</p>

                                        <a href="" class="btn btn-xs btn-primary2 Phone" data-toggle="tooltip" title="" data-original-title="Phone"><i class="fa fa-phone"></i></a>
                                        <a href="mailto:${db[i].email}" rel="prefetch" id="eM" class="btn btn-xs btn-primary Email" data-toggle="tooltip" title="" data-original-title="Email"><i class="fas fa-envelope"></i></a>
                                            
                                    </div>
                                    
                                </h4>
        
                            </div>

                        </div>
                    
                    </div>
                
                `)

            }

            return true;

        }

    })

}

function populateSelectOptions(category, selectID) {

    $(`#${selectID}`).empty();

    $.getJSON(`php/getAll${category}s.php`, function (category) {

        $.each(category.data , function (key, entry) {

            $(`#${selectID}`).append($('<option></option>').attr('value', entry.name).text(entry.name));

        })

    }); 

}

function removeDepartment() {

    let departmentName = $('#removeDepartmentDepartment').val()

    $.getJSON(`php/getAllDepartments.php`, function (departments) {

        let departmentID = departments.data.filter(dep => dep.name == departmentName)[0].id
        
        if(departmentID <= 12){
        
            $('#depResponseMessage').text("Declined")
        
        } else {
        
            $.ajax({

                data: {
                    'id': departmentID
                },
                url: 'php/deleteDepartmentByID.php', 
                dataType: 'json',

                success: function(data) {

                    $('#removeDepartmentDepartment').find('option:eq(0)').prop('selected', true);
        
                }

            })

        }

    }); 

}

function removeLocation() {

    let locationName = $('#removeLocationLocation').val()

    $.getJSON(`php/getAllLocations.php`, function (locations) {

        let locationID = locations.data.filter(loc => loc.name == locationName)[0].id

        if(locationID <= 12){
            
            $('#locResponseMessage').text("Declined")
        
        } else {

            $.ajax({

                data: {
                    'name': locationName
                },
                url: 'php/deleteLocation.php', 
                dataType: 'json',

                success: function(data) {

                    $('#removeLocationLocation').find('option:eq(0)').prop('selected', true);

                }

            })

        }

    });
    
}

function returnToTable() {

    setTimeout(function(){

        $('#profilePage').hide();
        
        $('#addEmployeeOverlay').hide();
        
        window. location. reload(1);
        
    }, 500);

}

function search(e) {

    console.log(e);
    var e = e || window.event;
    var keycode = e.keyCode || e.charCode;

    if(keycode === 13){

        $('form').on('submit', function (e) {
    
            e.preventDefault();
    
            return false;
    
        });
        
        $('#database').html(`

            <h4>
                
                <span class="hideCell"></span>
                <p class="findID"></p>
                
                <br>
                
                <div class="hideCell">
                
                    <p class="hideCell" id="departmentHeader"></p>
                    <p class="hideCell" id="locationHeader"></p>

                    <span class="hideCell"</span>
                    <span class="hideCell"</span>
                    
                </div>

            </h4>
        
        `)

        var filterBy = $('.filterSelect:first').val()
        var searchText = $('#searchBar').val()

        $.ajax({
        
            type: 'GET',
            url: 'php/getAll.php', 
            dataType: 'json',
        
            success: function(data, i) {

                var db = data.data;

                for (let i in db) {

                    var searchTextArr = searchText.split(' ')

                    for (let idx in searchTextArr) {

                        if ((db[i][filterBy].toLowerCase()).indexOf(searchTextArr[idx].toLowerCase()) >= 0) {

                            $('#database').append(`
                        
                                <div class="loadProfile col-sm-6 col-md-4" onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
                                    
                                    <div class="widget col-3 profile">
                                    
                                        <div class="widget-simple">
                    
                                            <span>
                                        
                                                <img src="img/user-regulars.svg" alt="avatar" class="widget-image img-circle pull-left animation-fadeIn">
                                            
                                            </span>
                                        
                                            <h4 class="widget-content text-left">
                                            
                                                <span id="fullName">${db[i].lastName}, ${db[i].firstName}</span>
                                                <p class="findID" style="font-size:11px; color: rgb(190, 190, 190); display: none"> - ID: ${db[i].id}</p>
                                                
                                                <br>
                                                
                                                <div class="info" style: "overflow: hidden">
                                                
                                                    <p class=${filterBy == "department"} style="font-size:11px; color: rgb(190, 190, 190); float: left">${db[i].department}</p>
                                                    <p class=${filterBy == "location"} style="font-size:11px; color: rgb(190, 190, 190); float: left">, ${db[i].location}</p>
            
                                                    <a href="" class="btn btn-xs btn-primary2 Phone" data-toggle="tooltip" title="" data-original-title="Phone"><i class="fa fa-phone"></i></a>
                                                    <a href="mailto:${db[i].email}" rel="prefetch" id="eM" class="btn btn-xs btn-primary Email" data-toggle="tooltip" title="" data-original-title="Email"><i class="fas fa-envelope"></i></a>
                                                    
                                                </div>
                                        
                                            </h4>
                    
                                        </div>

                                    </div>
                                
                                </div>
                            
                            `)

                        }

                    }
                    
                }
                    
                
            }

        })
        
        return false

    }                            

}

function toggleAddDepartment() {

    if ($('#addDepartmentOverlay').css('display') == "none") {
    
        $('#addDepartmentOverlay').css('display', 'block')

        populateSelectOptions('Location',"addDepartmentLocation")

    } else {
    
        $('#addDepartmentOverlay').css('display', 'none')
    
    }

}

function toggleAddEmployee() {

    if ($('#addEmployeeOverlay').css('display') == "none") {

        $('#addEmployeeOverlay').css('display', 'block')

        let selectArr = ['Department', 'Location']

        for (let i in selectArr) {

            populateSelectOptions(selectArr[i],`addEmployee${selectArr[i]}`)
        
        }
    
    } else {

        $('#addEmployeeOverlay').css('display', 'none')

    }

}

function toggleAddLocation() {

    if ($('#addLocationOverlay').css('display') == "none") {

        $('#addLocationOverlay').css('display', 'block')

    } else {

        $('#addLocationOverlay').css('display', 'none')

    }

}

function toggleConfirm(message, func) {
    
    if (!event) var event = window.event;
    event.cancelBubble = true;
    if (event.stopPropagation) event.stopPropagation();


    employeeID = $(event.target).closest(".buttons").siblings("form").find("#id").text();

    if ($('#confirm').css('display') == "none") {

        $('#confirm').show()
        $('#confirmQuestion').show()
        $('#confirmResponse').hide()

        let addOrRemove = capitalizeFirstLetter(message.split(" ")[0])
        addOrRemove == "Add" ? addOrRemove += "ed" : addOrRemove += "d"

        $('#confirmMessage').text(message)
        $('#confirmButton').attr('onClick', `

            ${func.toString()};

            $('#confirmQuestion').hide()
            $('#confirmResponse').show()

            $('#confirmResponseMessage').text('${addOrRemove}')

            setTimeout(function(){

                $('#confirm').hide();
                
                $('#profilePage').hide();
                
                window. location. reload(1);
                
            }, 1500);
            
        `)

    } else {
        
        $('#confirm').css('display', 'none')

    }

}

function toggleConfirmDep(message, func) {
    
    if ($('#confirmDep').css('display') == "none") {

        $('#confirmDep').show()
        $('#depQuestion').show()
        $('#depResponse').hide()

        let addOrRemove = capitalizeFirstLetter(message.split(" ")[0])
        addOrRemove == "Add" ? addOrRemove += "ed" : addOrRemove += "d"

        $('#depMessage').text(message)
        $('#depButton').attr('onClick', `
            ${func.toString()};
            $('#depQuestion').hide()
            $('#depResponse').show()

            $('#depResponseMessage').text('${addOrRemove}')

            setTimeout(function(){
                $('#confirmDep').hide();
                
                $('#profilePage').hide();
                
                window. location. reload(1);
                
            }, 1500);
            
        `)

    } else {
        
        $('#confirmDep').css('display', 'none')

    }

}

function toggleConfirmLoc(message, func) {

    if ($('#confirmLoc').css('display') == "none") {

        $('#confirmLoc').show()
        $('#locQuestion').show()
        $('#locResponse').hide()

        let addOrRemove = capitalizeFirstLetter(message.split(" ")[0])
        addOrRemove == "Add" ? addOrRemove += "ed" : addOrRemove += "d"

        $('#locMessage').text(message)
        $('#locButton').attr('onClick', `

            ${func.toString()};

            $('#locQuestion').hide()
            $('#locResponse').show()

            $('#locResponseMessage').text('${addOrRemove}')

            setTimeout(function(){

                $('#confirmLoc').hide();
                
                $('#profilePage').hide();
                
                window. location. reload(1);
                
            }, 1500);
            
        `)

    } else {
        
        $('#confirmLoc').css('display', 'none')

    }

}

function toggleModifyDepLoc() {

    if ($('#modifyDepLoc').css('display') == "none") {

        $('#modifyDepLoc').css('display', 'block')

    } else {

        $('#modifyDepLoc').css('display', 'none')

    }

}

function toggleRemoveDepartment() {
    
    if ($('#removeDepartmentOverlay').css('display') == "none") {
    
        $('#removeDepartmentOverlay').css('display', 'block')

        populateSelectOptions('Department',"removeDepartmentDepartment")
        
    } else {
    
        $('#removeDepartmentOverlay').css('display', 'none')
    
    }

}

function toggleRemoveLocation() {

    if ($('#removeLocationOverlay').css('display') == "none") {

        $('#removeLocationOverlay').css('display', 'block')

        populateSelectOptions('Location',"removeLocationLocation") 

    } else {

        $('#removeLocationOverlay').css('display', 'none')

    }

}

function updateEmployee() {

    $.getJSON(`php/getAllDepartments.php`, function (departments) {
        
        let departmentID = departments.data.filter(dep => dep.name == profile.department)[0].id

        $.ajax({
        
            data: {
                'id': parseInt($('#id').text()),
                'firstName': profile.firstName,
                'lastName': profile.lastName,
                'email': profile.email,
                'departmentID': departmentID
            },
            url: 'php/updateEmployee.php', 
            dataType: 'json',
        
            success: function(data) {

                $('#database').html(`

                    <h4>
                        
                        <span class="hideCell"></span>
                        <p class="findID"></p>
                        
                        <br>
                        
                        <div class="hideCell">
                        
                            <p class="hideCell" id="departmentHeader"></p>
                            <p class="hideCell" id="locationHeader"></p>

                            <span class="hideCell"</span>
                            <span class="hideCell"</span>
                            
                        </div>

                    </h4>
                        
                `)

                $.ajax({

                    type: 'GET',
                    url: 'php/getAll.php', 
                    dataType: 'json',
                    
                    success: function(data, letterData) {
            
                        var db = data.data;
                        
                        for (let i in db) {
            
                            $('#database').append(`

                                <div class="loadProfile col-sm-6 col-md-4" onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
                                    
                                    <div class="widget col-3 profile">
                                    
                                        <div class="widget-simple">
                    
                                            <span>
                                        
                                                <img src="img/user-regulars.svg" alt="avatar" class="widget-image img-circle pull-left animation-fadeIn">
                                            
                                            </span>
                                        
                                            <h4 class="widget-content text-left">
                                        
                                                <span id="fullName">${db[i].lastName}, ${db[i].firstName}</span>
                                                <p class="findID" style="font-size:11px; color: rgb(190, 190, 190); display: none"> - ID: ${db[i].id}</p>
                                            
                                                <br>
                                                            
                                                <div class="info" style: "overflow: hidden">
                                        
                                                    <p class=${filterBy == "department"} style="font-size:11px; color: rgb(190, 190, 190); float: left">${db[i].department}</p>
                                                    <p class=${filterBy == "location"} style="font-size:11px; color: rgb(190, 190, 190); float: left">, ${db[i].location}</p>
                
                                                    <a href="" class="btn btn-xs btn-primary2 Phone" data-toggle="tooltip" title="" data-original-title="Phone"><i class="fa fa-phone"></i></a>
                                                    <a href="mailto:${db[i].email}" rel="prefetch" id="eM" class="btn btn-xs btn-primary Email" data-toggle="tooltip" title="" data-original-title="Email"><i class="fas fa-envelope"></i></a>
                                                        
                                                </div>
                                                
                                            </h4>
                    
                                        </div>

                                    </div>
                            
                                </div>
                        
                            `)
            
                        }
            
                        return true;
            
                    }
            
                })
                
            }
        
        })

    })

}