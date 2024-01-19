//(!!!지우셈)유틸
console.clear();
function log(str){
  console.log(str);
}

//시간마다 돌아가는 함수
setInterval(showTime,1000);

let users = [];
let defaultBackgrounds =[];
let todos = [];
let backgroundIdx = 0;
let backgrounds =[];
let loginUser = null;

const USERS_LOCAL_KEY = "users";
init();
function init(){
  //로컬스토리지에서 user 받아와 초기화
  let localUsers = localStorage.getItem(USERS_LOCAL_KEY);
  if(localUsers){
    users = JSON.parse(localUsers);
  }else{
    const admin = {id:"admin", password:"0000", name:"관리자", todos:[], backgrounds:[]};
    users.push(admin);
    localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(users));
  }
  initDefaultBackgrounds();
  backgrounds = defaultBackgrounds;
  setBackground(getRandomInt(0,backgrounds.length));
  updateTodoDisplay();
}
function initDefaultBackgrounds(){
  defaultBackgrounds.push("https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  defaultBackgrounds.push("https://images.unsplash.com/photo-1601625463687-25541fb72f62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  defaultBackgrounds.push("https://images.unsplash.com/photo-1694250990115-ca7d9d991b24?q=80&w=1990&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  defaultBackgrounds.push("https://images.unsplash.com/photo-1699446431892-67959b9b93ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  defaultBackgrounds.push("https://images.unsplash.com/photo-1699184054784-4792968a5230?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
 defaultBackgrounds.push("https://images.unsplash.com/photo-1694989025300-9e1c2cfc7a2b?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
}

//배경화면 바꾸기 버튼
document.querySelector("#changeBackground").onclick = function(e){
  backgroundIdx++;
  if(backgroundIdx >= backgrounds.length) backgroundIdx = 0;
  setBackground(backgroundIdx);
}

//todolist 제출버튼 
document.querySelector("#submit").onclick = function(e){
  e.preventDefault();
  
  const text = document.querySelector("#text-box").value;
  todos.push(text);
  save(loginUser);
  
  updateTodoDisplay();
  
  const tBox =  document.querySelector("#text-box");
  tBox.value ="";
  tBox.focus();
};

function updateTodoDisplay(){
  const ul = document.createElement("ul");
  ul.classList.add("todo-list");
  
  todos.forEach((item, index)=>{
    const li = document.createElement("li");
    li.setAttribute("data-idx", index);
    li.innerHTML = `<span>${item}</span><i class="fa-solid fa-xmark"></i>`;
    //edit
    li.firstElementChild.onclick = function(){
    };
    //remove
    li.lastElementChild.onclick = function(){
        const pLi = this.parentElement;
        todos.splice(pLi.getAttribute("data-idx"),1);
        save(loginUser);
        updateTodoDisplay();
    };
    ul.append(li);
  });
  document.querySelector(".todo-list").replaceWith(ul);
}

//왼쪽 상단 유저버튼 마우스오버 
document.querySelector("#user").onmouseover = function(){
  const userInfo = document.querySelector(".user-info");
  if(!loginUser && userInfo.style.display=="none" || userInfo.style.display=="")
    userInfo.style.display = "block";
}
document.querySelector("#user").onmouseleave = function(){
  const userInfo = document.querySelector(".user-info");
  if(!loginUser && userInfo.style.display=="block")
    userInfo.style.display = "none";
}
//왼쪽 상단 유저버튼 마우스리브 
document.querySelector("#user").onclick = function(){
  const login = document.querySelector(".login-window");
  if(login.style.display=="block"){
    login.style.display ="none";
  }else{
    login.style.display ="block";
  }
  layeredBlack();
}

function layeredBlack(){
  const div = document.createElement("div");
  div.classList.add("darken");
  div.onclick = function(){
    document.querySelector(".login-window").style.display="none";
    this.remove();
  };
  document.body.prepend(div);
}

//로그인 로직
document.querySelector("#login").onclick = function(e){
  e.preventDefault();
  
  const alert = document.querySelector(".alert");
  
  const id = document.querySelector("#id").value;
  const password = document.querySelector("#pw").value;
  if(id == "" || password ==""){
    alert.innerText = "* 아이디와 패스워드를 확인해주세요."
    return false;
  }
  const user = users.find(user=>user.id==id);
  if(user){
    //로그인 성공!!
    if(user.password == password){
      
      loginUser = user;
      todos = user.todos;
      backgrounds = user.backgrounds;
      updateTodoDisplay();
      setBackground(getRandomInt(0,backgrounds.length));
      
      const userInfo = document.querySelector(".user-info");
      userInfo.style.display = "block";
      userInfo.innerHTML = `환영합니다 ${user.name}! <span class="logout">logout</span>`;
      userInfo.lastElementChild.onclick = logout;
      
      document.querySelector(".login-window").style.display = "none";
      document.querySelector(".thumbnail-window").style.display ="none";
      alert.innerText ="";
      document.querySelector(".darken").remove();
    }else
      alert.innerText = "비밀번호가 틀렸습니다.";
  }else{
    alert.innerText = "* 아이디와 패스워드를 확인해주세요."
  }
}

//회원 가입 버튼
document.querySelector("#join").onclick = function(e){
  e.preventDefault();
  log("공사중");
  /*

  const joinWindow = document.querySelector(".join-window");
  joinWindow.style.display = "block";
 */
}

//****로그아웃*****
function logout(){
  save(loginUser);
  loginUser = null;
  const userInfo = document.querySelector(".user-info");
  userInfo.innerHTML="로그인 하세요";
  userInfo.style.display="none";

  //초기화
  todos = [];
  updateTodoDisplay();
  document.querySelector("#id").value="";
  document.querySelector("#pw").value="";
  backgrounds = defaultBackgrounds;
  setBackground(getRandomInt(0,backgrounds.length));
  document.querySelector(".thumbnail-window").style.display ="none";
}


//섬네일 버튼
document.querySelector("#thumbnails").onclick = function(e){
  const thumb = document.querySelector(".thumbnail-window");
  if(thumb.style.display=="block")
    thumb.style.display ="none";
  else
    thumb.style.display ="block";
  updateThumbnails();
}

function updateThumbnails(){
  const ul = document.createElement("ul");
  ul.classList.add("thumbnail-list");
  backgrounds.forEach((item, index)=>{
    const li = document.createElement("li");
    li.innerHTML =`<img data-idx="${index}" src="${item}">`;
    li.onclick = function(){
      if(index < backgrounds.length)
        setBackground(index);
    }
    li.onmouseover = function(){
      //이미 존재하면 만들지 마
      if(li.children.length >= 2) return false;
      const btn = document.createElement("button");
      btn.classList.add("deleteThumbnail");
      btn.innerText = "X";
      btn.onclick = function(){
        //백그라운드 배열에서 빼버리기
        const idx = this.parentElement.lastElementChild.getAttribute("data-idx");
        backgrounds.splice(idx,1);
        log(backgrounds.length);
        
        //해봤자 li 클릭 이벤트에서 업데이트 해버림. 이벤트 순서
        setBackground(getRandomInt(0, backgrounds.length));
        updateThumbnails();
        save(loginUser);
      };
      li.prepend(btn);
    }
    li.onmouseleave = function(){
      document.querySelectorAll(".deleteThumbnail").forEach(item=>item.remove());
    }
    ul.append(li);
  });
  document.querySelector(".thumbnail-list").replaceWith(ul);
}

//섬네일 추가 버튼
document.querySelector("#thumbnail-add").onclick = function(e){
  e.preventDefault();
  const imgPath = document.querySelector("#image-path");
  if(imgPath.value){
    backgrounds.push(imgPath.value);
    updateThumbnails();
    save(loginUser);
    imgPath.value = "";
  }
}

//시간
showTime();


function showTime(){
  const date = new Date();
  let midday = "am";
  let hour = date.getHours();
  let min  = date.getMinutes();

  if(hour < 12 ){
    midday = "am";
  }else{
    midday = "pm";
    if(hour!=12) hour -=12;
  }
  let sec = date.getSeconds();
  document.querySelector(".time").innerHTML=`<span class="hour">${hour}</span><span class="min">${min.toString().padStart(2,"0")}</span><span class="sec">${sec.toString().padStart(2,"0")}</span><span class="midday">${midday}</span>`;
}

/***유틸리티 함수***/
function getRandomInt(min, max){
  return Math.floor(Math.random()*(max-min)+min);
}

function save(target){
  if(loginUser){
    target.todos = todos;
    target.backgrounds = backgrounds;
    localStorage.setItem(USERS_LOCAL_KEY, JSON.stringify(users));
  }
}

function setBackground(index){
  const wWrapper = document.querySelector(".whole-wrapper");
  wWrapper.style.backgroundImage = `url(${backgrounds[index]})`;
}


//배경화면 자동으로 바꾸기

const auto = setInterval(function(){
  if(isPlaying){
      if(backgroundIdx < backgrounds.length) setBackground(backgroundIdx++);
      else backgroundIdx = 0;
  }
},3000);

let isPlaying = false;
document.querySelector("#autoChangeBg").onclick = function(){
  isPlaying=!isPlaying;
  if(isPlaying){
    this.innerHTML ='<i class="fa-solid fa-circle-stop"></i>';
  }else{
    this.innerHTML ='<i class="fa-solid fa-circle-play"></i>';
  }
}
