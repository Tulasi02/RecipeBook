var token = localStorage.getItem('token');

var ID, rName, desc, ing, inst, facts;

const apiUrl = window.location.origin+"/";

$(document).ready(() => {
    $("#signUp").click(() => {  
        // console.log("signup");
        $.ajax({
            url: apiUrl+"user/signup",
            type: "PUT",
            cors: true,
            dataType: "json",
            data: {
                name: $("#signUpName").val(),
                emailId: $("#signUpEmailId").val(),
                password: $("#signUpPassword").val()
            },
            success: function(data) {
                if (data.message != 'success') {
                  document.getElementById('signUpErrors').innerHTML = `EmailId already registered.`;
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#login").click(() => {
        $.ajax({
            url: apiUrl+"user/login",
            type: "POST",
            cors: true,
            dataType: "json",
            data: {
                emailId: $("#loginEmailId").val(),
                password: $("#loginPassword").val()
            },
            success: function(data, textStatus, request) {
                if (request.status == 401) {
                    $("#logout").click();
                }
                else {
                    window.localStorage.setItem('token', request.getResponseHeader('token'));
                    if (data.message != 'success') {
                        document.getElementById('loginErrors').innerHTML = `EmailId not registered`;
                    }
                    else {
                        window.location.replace("./dashboard.html");
                    }
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    }); 

    $("#home").click(() => {
        window.location.replace('./dashboard.html');
    });

    $("#profile").click(() => {
        $.ajax({
            url: apiUrl+"user/profile",
            type: "GET",
            cors: true,
            headers: {'token' : token},
            dataType: "json",
            success: function(data, textStatus, request) {
                if (request.status == 401) {
                    $("#logout").click();
                }
                else { 
                    window.localStorage.setItem('token', request.getResponseHeader('token'));
                    if (data.message === 'success') {
                        var details = data.user.details, recipes = data.user.recipes;
                        var profile = `<div class="container-md justify-content-center profile-details">
                                            <h3>User Details</h3>
                                            <div class="row mb-3">
                                            <label class="col-sm-3 col-form-label">Name</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" placeholder="${details.name}" disabled="">
                                            </div>
                                            </div>
                                            <div class="row mb-3">
                                                <label class="col-sm-3 col-form-label">Email Address</label>
                                                <div class="col-sm-10">
                                                    <input type="email" class="form-control"placeholder="${details.emailId}" disabled="">
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <label for="newPassword" class="col-sm-3 col-form-label">New Password</label>
                                                <div class="col-sm-10">
                                                    <input type="password" class="form-control" id="newPassword">
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                            <label for="confirmPassword" class="col-sm-3 col-form-label">Confirm Password</label>
                                            <div class="col-sm-10">
                                                <input type="password" class="form-control" id="confirmPassword">
                                            </div>
                                            </div>
                                            <h5 id="message"></h5>
                                            <div class="row">
                                                <div class="col-sm-10">
                                                    <button type="submit" class="btn btn-primary" id="update">Update</button>
                                                </div>
                                            </div>
                                            <br><br>
                                            <h3>User Recipes <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addModal"><span>&#43;</span> Add New Recipe</button></h3>
                                            <div class="container mx-auto">
                                            <div id = "userRecipies" class="grid-container mx-auto">`;
                        $("#recipeName").val('');
                        $("#description").empty();
                        $("#ingredients").empty();
                        $("#instructions").empty();
                        $("#nutritionalFacts").empty();
                        for (var i = 0; i < recipes.length; i++) {
                            profile += `<div class="grid-item">
                                            <button class="recipebtn" data-value="${recipes[i].recipeId}">
                                                <div class="card">
                                                <img class="card-img-top" src="https://media.istockphoto.com/vectors/recipe-card-vector-id618446308?k=20&m=618446308&s=612x612&w=0&h=92Ce-dhoNpXFt73_EaKWokNMdHXi9q1p-YkUjknRQpg=" alt="Recipe image">
                                                <div class="card-body">
                                                    <h5 class="card-title">${recipes[i].name}</h5>
                                                </div>
                                                </div>
                                            </button>
                                        </div>`;
                        }
                        profile += `</div></div>`;
                        document.getElementById("changeable").innerHTML = profile; 
                    }
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    })

    $("#changeable").on('click', '#update', () => {
        var password1 = $("#newPassword").val(), password2 = $("#confirmPassword").val();
        if (password1 != '' && password2 != '') {
            $.ajax({
                url: apiUrl+"user/update",
                type: "PATCH",
                cors: true,
                headers: {'token': token},
                dataType: "json",
                data: {
                    'password1': password1,
                    'password2': password2
                },
                success: function(data, textStatus, request) { 
                    if (request.status == 401) {
                        $("#logout").click();
                    }
                    else {
                        window.localStorage.setItem('token', request.getResponseHeader('token'));
                        if (data.message !== 'success') {
                            document.getElementById('message').innerHTML = data.message;
                        }
                        else {
                            document.getElementById('message').innerHTML = `Password updated successfully`;
                        }
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    })

    $("#addRecipe").click(() => {
        rName = $("#recipeName").val();
        desc = $("#description").html();
        ing = $("#ingredients").html();
        inst = $("#instructions").html();
        facts = $("#nutritionalFacts").html();
        $.ajax({
            url: apiUrl+"recipes/addRecipe",
            type: "PUT",
            cors: true,
            dataType: "json",
            headers: {'token': token},
            data: {
                name: rName,
                description: desc,
                ingredients: ing,
                instructions: inst,
                facts: facts
            },
            success: function(data, textStatus, request) {
                window.localStorage.setItem('token', request.getResponseHeader('token'));
                $("#addModal").modal('hide');
                $("#profile").click();
            },
            error: function(err) {
                console.log(err);
            }
        });  
    })

    $("#search").keyup(e => {
        if (e.keyCode == 13 || e.key == 'Enter') {
        $("#searchButton").click();
        }
    });

    $("#searchButton").click(() => {
        var f = $("#search").val();
        // console.log(f);
        if (f !== '') {
            $.ajax({
                url: apiUrl+"recipes/searchRecipe",
                type: "POST",
                cors: true,
                dataType: "json",
                headers: {'token': token},
                data: {
                    'search' : $("#search").val()
                },
                success: function(data, textStatus, request) {
                    if (request.status == 401) {
                        $("#logout").click();
                    }
                    else {
                        window.localStorage.setItem('token', request.getResponseHeader('token'));
                        if (data.message !== 'success') {
                            document.getElementById("searchMessage").innerHTML = `  <h6>No recipes found</h6>`;
                        }
                        else {
                            document.getElementById("searchMessage").innerHTML = '';
                            let newCard = "";
                            var searchResult = document.getElementById("searchResult");
                            for (var i = 0; i < data.recipes.length; i++) {
                                newCard += `<div class="grid-item">
                                                <button class="recipebtn" data-value="${data.recipes[i].recipeId}">
                                                    <div class="card">
                                                        <img class="card-img-top" src="https://media.istockphoto.com/vectors/recipe-card-vector-id618446308?k=20&m=618446308&s=612x612&w=0&h=92Ce-dhoNpXFt73_EaKWokNMdHXi9q1p-YkUjknRQpg=" alt="Recipe image">
                                                        <div class="card-body">
                                                            <h5 class="card-title">${data.recipes[i].name}</h5>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>`;
                            }
                            searchResult.innerHTML = newCard; 
                            $("#changeable").show();
                        }
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });

    $("#changeable").on('click', '.recipebtn', (e) => {
        var recipeId = $(e.target).closest('.recipebtn').attr('data-value');
        $.ajax({
            url: apiUrl+"recipes/viewRecipe",
            type: "POST",
            cors: true,
            dataType: "json",
            headers: {'token': token},
            data: {
                'recipeId': recipeId,
            },
            success: function(data, textStatus, request) {
                if (request.status == 401) {
                    $("#logout").click();
                }
                else {
                    window.localStorage.setItem('token', request.getResponseHeader('token'));
                    desc = data.recipe.description;
                    ing = data.recipe.ingredients;
                    inst = data.recipe.instructions;
                    facts = data.recipe.nutritionalFacts;
                    let view = document.getElementById("changeable");
                    view.innerHTML = `<div>
                        <div class="container-md justify-content-center profile-details">
                        <h3>${data.recipe.name}</h3>
                        <input type="hidden" value="${data.recipe.recipeId}" id="idRecipe"/>
                        <div class="row mb-3">
                            <label class="col-sm-3 detailsBox">Description</label>
                            <div class="col-sm-10">
                            <div class="recipeDiv recipeSpan" id="description" contenteditable="true">${desc}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 detailsBox">Ingredients</label>
                            <div class="col-sm-10"> 
                            <div class="recipeDiv recipeSpan" id="ingredients" contenteditable="true">${ing}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 detailsBox">Instructions</label>
                            <div class="col-sm-10">
                            <div class="recipeDiv recipeSpan" id="instructions" contenteditable="true">${inst}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label class="col-sm-3 detailsBox">nutritional Facts</label>
                            <div class="col-sm-10">
                            <div class="recipeDiv recipeSpan" id="facts" contenteditable="true">${facts}</div>
                            </div>
                        </div>
                        </div>
                    </div>`;
                    if (data.userId == data.recipe.creatorId) {
                        view.innerHTML += `<h5 id="errorMessage"></h5>
                                            <div class="row">
                                                <div class="col-sm-10">
                                                    <button type="submit" class="btn btn-primary" id="recipeUpdate">Update</button>
                                                </div>
                                            </div>`;
                        [...document.getElementsByClassName("recipeSpan")].forEach(
                            x => x.removeAttribute('readonly')
                        );
                    }
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    })
    $("#changeable").on('click', '#recipeUpdate', () => {
        var ID = $("#idRecipe").val(), desc = $("#description").html(), ing = $("#ingredients").html(), inst = $("#instructions").html(), facts = $("#facts").html();
        $.ajax({
            url: apiUrl+"recipes/editRecipe",
            type: "PATCH",
            cors: true,
            headers: {'token': token},
            dataType: "json",
            data: {
                'recipeId' : ID,
                'description': desc,
                'ingredients': ing,
                'instructions': inst,
                'facts': facts
            },
            success: function(data, textStatus, request) { 
                if (request.status == 401) {
                    $("#logout").click();
                }
                else {
                    window.localStorage.setItem('token', request.getResponseHeader('token'));
                    if (data.message !== 'success') {
                        document.getElementById('errorMessage').innerHTML = data.message;
                    }
                    else {
                        document.getElementById('errorMessage').innerHTML = `Recipe updated successfully`;
                    }
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
    $("#logout").click(() => {
        // console.log(xhr.status);
        // xhr.status = 401;
        window.location.replace('/');
    })
})