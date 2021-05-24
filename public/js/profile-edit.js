const nameEditButton = document.getElementById("nameEditButton")
const nameEditField = document.getElementById('nameEditField')
const nameInput = document.getElementById('nameEditInput') 
const nameInputSaveButton = document.getElementById('nameSaveButton')
const nameErrorMSG = document.getElementById('nameErrorMSG')

const emailEditButton = document.getElementById("emailEditButton")
const emailEditField = document.getElementById('emailEditField')
const emailInput = document.getElementById('emailEditInput') 
const emailInputSaveButton = document.getElementById('emailSaveButton')
const emailErrorMSG = document.getElementById('emailErrorMSG')

const pswEditButton = document.getElementById("pswEditButton")
const pswEditField = document.getElementById('pswEditField')
const psw1Input = document.getElementById('psw1EditInput') 
const psw2Input = document.getElementById('psw2EditInput') 
const pswInputSaveButton = document.getElementById('pswSaveButton')
const pswWarningMSG = document.getElementById('psw-warning-msg')
const passwordErrorMSG = document.getElementById('passwordErrorMSG')



nameEditButton.addEventListener('click',(e)=>
{
    e.preventDefault()

    if(nameEditField.classList.contains('open'))
    {
        nameEditField.classList.remove('open')
    }
    else
    {
        nameEditField.classList.add('open')
    }
})
emailEditButton.addEventListener('click',(e)=>
{
    e.preventDefault()

    if(emailEditField.classList.contains('open'))
    {
        emailEditField.classList.remove('open')
    }
    else
    {
        emailEditField.classList.add('open')
    }
})
pswEditButton.addEventListener('click',(e)=>
{
    e.preventDefault()

    if(pswEditField.classList.contains('open'))
    {
        pswEditField.classList.remove('open')
    }
    else
    {
        pswEditField.classList.add('open')
    }
})




nameSaveButton.addEventListener('click',(e)=>
{
    // e.preventDefault()
    // alert(nameErrorMSG.innerText)
    if(!nameErrorMSG.innerText === '')
    {
        nameErrorMSG.classList.add('open-warning-msg')
    }
    else
    {
        nameErrorMSG.classList.remove('open-warning-msg')
    }
})

emailSaveButton.addEventListener('click',(e)=>
{
    // e.preventDefault()
    if(!emailErrorMSG.innerText === '')
    {
        nameErrorMSG.classList.add('open-warning-msg')
    }
    else
    {
        nameErrorMSG.classList.remove('open-warning-msg')
    }
    
})

pswSaveButton.addEventListener('click',(e)=>
{

    if(!passwordErrorMSG.innerText === '')
    {
        passwordErrorMSG.classList.add('open-warning-msg')
    }
    else
    {
        passwordErrorMSG.classList.remove('open-warning-msg')
    }



    // e.preventDefault()

    // const psw1 = psw1EditInput.value
    // const psw2 = psw2EditInput.value
    
    // if(psw1.length < 7 || psw2.length < 7)
    // {
    //     pswWarningMSG.classList.add('open-warning-msg')
    //     pswWarningMSG.innerText = 'You passwords must be greater than 7 chars'
    //     return
    // }
    // else if(psw1 !== psw2)
    // {
    //     pswWarningMSG.classList.add('open-warning-msg')
    //     pswWarningMSG.innerText = 'You passwords must match'
    //     return
    // }


    // pswWarningMSG.classList.remove('open-warning-msg')
    // pswWarningMSG.innerText = ''
})


