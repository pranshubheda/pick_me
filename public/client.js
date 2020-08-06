function run_pick_me() {
    fetch('/run_pick_me')
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(data => {
            document.getElementById('test').innerHTML = data.name;
        })
        .catch(error => {
            console.error('Unsuccessful response');
        })
}