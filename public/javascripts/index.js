

function connections(){
    let connections = document.getElementById('connections');
    let suggestions = document.getElementById('suggestions');

    suggestions.style.display = 'none';
    if (connections.style.display == 'block')
        connections.style.display = 'none';
    else
        connections.style.display = 'block';
}

function suggestions(){
    let connections = document.getElementById('connections');
    let suggestions = document.getElementById('suggestions');

    connections.style.display = 'none';
    if (suggestions.style.display == 'block')
        suggestions.style.display = 'none';
    else
        suggestions.style.display = 'block';
}