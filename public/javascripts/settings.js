function userSubMenu(){
    let main_menu = document.getElementById('main_menu');
    let userSubMenu = document.getElementById('user_sub_menu');

    if (userSubMenu.style.display == 'grid')
        userSubMenu.style.display = 'none';
    else
        userSubMenu.style.display = 'grid';
}

function togglePersonalForm(){
    let personalForm = document.getElementById('personal_form');
    if (personalForm.style.display != 'none')
        personalForm.style.display = 'none';
    else
        personalForm.style.display = 'block';
}

function togglePasswordForm(){
    let personalForm = document.getElementById('password_form');
    if (personalForm.style.display != 'none')
        personalForm.style.display = 'none';
    else
        personalForm.style.display = 'block';
}

function toggleHobbiesForm(){
    let personalForm = document.getElementById('hobbies_form');
    if (personalForm.style.display != 'none')
        personalForm.style.display = 'none';
    else
        personalForm.style.display = 'block';
}
function toggleLocationForm(){
    let personalForm = document.getElementById('location_form');
    if (personalForm.style.display != 'none')
        personalForm.style.display = 'none';
    else
        personalForm.style.display = 'block';
}

function toggleAdditionalForm(){
    let personalForm = document.getElementById('additional_form');
    if (personalForm.style.display != 'none')
        personalForm.style.display = 'none';
    else
        personalForm.style.display = 'block';
}
