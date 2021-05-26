const dashBoardAdminButton = document.getElementById('adminDashBoardButton')
// const hideDashBoardButton = document.getElementsByClassName('adminDashBoardButtonInvisible') 

if(dashBoardAdminButton.innerText==='')
{
    dashBoardAdminButton.classList.add('adminDashBoardButtonInvisible')
}
else
{
    dashBoardAdminButton.classList.remove('adminDashBoardButtonInvisible')
}