function userSubMenu(){
    let main_menu = document.getElementById('main_menu');
    let userSubMenu = document.getElementById('user_sub_menu');

    if (userSubMenu.style.display == 'grid')
        userSubMenu.style.display = 'none';
    else
        userSubMenu.style.display = 'grid';
}