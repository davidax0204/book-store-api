// const input = document.getElementById('avatar');

// // add event listener
// input.addEventListener('change', () => {
//     uploadFile(input.files[0]);
// });

// const uploadFile = (file) => {
    
//     // add file to FormData object
//     const fd = new FormData();
//     fd.append('avatar', file);

//     // send `POST` request
//     fetch('/upload-avatar', {
//         method: 'POST',
//         body: fd
//     })
//     .then(res => res.json())
//     .then(json => console.log(json))
//     .catch(err => console.error(err));
// }