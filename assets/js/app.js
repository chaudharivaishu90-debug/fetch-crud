var cl =console.log;

const BASE_URL= "https://xhrcrud-default-rtdb.firebaseio.com"
const TODO_URL=`${BASE_URL}/todo.json`;
const form= document.getElementById("form")
const ToContainer=document.getElementById("ToContainer")
const TodoItem=document.getElementById("TodoItem");
const spinner=document.getElementById("spinner");
const SubmitBtn=document.getElementById("SubmitBtn");
const UpdateBtn=document.getElementById("UpdateBtn");


// toglle
function OnToggle(){
    spinner.classList.toggle("d-none")
}
// localstate
const state={
    todoarr:[],
    Edit_id:null

}


// OBj to Array
function ObjToArr(obj) {
    state.todoarr=[];
    for(const key in obj){
        obj[key].id=key;
        state.todoarr.unshift(obj[key])
    }
}



// Templating

function Templating(arr){
    let result=``;
    arr.forEach(ele=> {
        result+=`<li class="list-group-item d-flex justify-content-between align-item center"id="${ele.id}">
                    <strong>${ele.item}</strong>
                    <div>
                    <i onclick="OnEdit(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                    <i onclick="Onremove(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                    </div>
                </li> 

        `

        
    });
    ToContainer.innerHTML= result;
}


function FetchallTodo(){
    OnToggle();
    fetch(TODO_URL,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error (`HTTP ERROR:${res.status}`)
        }
        return res.json()
    })
    .then(data => {
        cl(data)
        ObjToArr(data)
        Templating(state.todoarr);
        
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        OnToggle();
    })
}
FetchallTodo();




//create
function OnclickHandler(eve){
    eve.preventDefault();
    let obj={
        item:TodoItem.value
    }
    OnToggle();
    fetch(TODO_URL,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR: ${res.status}`)
        }
        return res.json();
    })
    .then(data=>{
let li = document.createElement("li")      
        obj.id=data.name;
        li.id=obj.id;

 li.className="list-group-item d-flex justify-content-between align-item center"
        li.innerHTML+=`<strong>${obj.item}</strong>
                    <div>
                    <i onclick="OnEdit(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                    <i  onclick="Onremove(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                    </div> `
                    
                    
                    ToContainer.prepend(li);
                    Swal.fire({
                     title: "New list created !",
                     text: "Done!",
                     icon: "success"
                });




                    form.reset()
                    
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=> {
        OnToggle();
    })
}

//delete
function Onremove(eve){

    let Remove_Id=eve.closest("li").id
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    OnToggle();
    let Remove_URL= `${BASE_URL}/todo/${Remove_Id}.json`
    fetch(Remove_URL,{
        method:"DELETE",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP ERROR: ${res.status}`)
        }
        return res.json();
    })
    .then(res=>{
        cl(res)
        let index=state.todoarr.findIndex(b=>b.id===Remove_Id);
        state.todoarr.splice(index,1);
        eve.closest("li").remove();
        Swal.fire({
                     title: " list Deleted Sucssesfully !",
                     text: "Done!",
                     icon: "success"
                });
    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        OnToggle();
    })
  }
});

}



function OnEdit(eve){
    OnToggle();
    let Edit_Id=eve.closest("li").id;
    state.Edit_id=Edit_Id;
    let Edit_url=`${BASE_URL}/todo/${Edit_Id}.json`;
    fetch(Edit_url,{
        method:"GET",
        body:null,
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    

    })
    .then(res=>{
        if(!res.ok){
                     throw new Error(`HTTP ERROR:${res.status}`)


        }
                          return res.json()


    })
    .then(res=>{
        cl(res);
        TodoItem.value=res.item;
        SubmitBtn.classList.add("d-none");
        UpdateBtn.classList.remove("d-none")
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        OnToggle();
    })
}


// update
function OnUphandler(ele){
    OnToggle();
    let Update_Id=state.Edit_id;
    let Update_url=`${BASE_URL}/todo/${Update_Id}.json`;
    let upobj={
        id:Update_Id,
        item:TodoItem.value
    };
    fetch(Update_url,{
        method:"PATCH",
        body:JSON.stringify(upobj),
        headers:{
            "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"

        }
    

    })
    .then(res=>{
        if(!res.ok){
                throw new Error(`HTTP ERROR: ${res.status}`)

        }
        return res.json();
    })
    .then(data=>{
        cl(data);
        let li=document.getElementById(Update_Id);
        li.querySelector("strong").innerText=data.item;
        SubmitBtn.classList.remove("d-none");
        UpdateBtn.classList.add("d-none")
        Swal.fire({
                     title: " list Updated Sucssesfully !",
                     text: "ok!",
                     icon: "success"
                });
        form.reset();
    
    })
    .catch(err=>{
        cl(err)

    })
    .finally(()=>{
        OnToggle()
    })
    
    
}



form.addEventListener("submit",OnclickHandler);
UpdateBtn.addEventListener("click",OnUphandler);