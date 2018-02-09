const disappear = document.querySelector("#feather");

disappear.addEventListener("click", removeOwl)

function removeOwl(){
  disappear.remove();
  disappear.removeEventListener("click", removeOwl)
}
