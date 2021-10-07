const dataInfo = [];
(function XHR(){
  let xhr = new XMLHttpRequest();
  xhr.open('get','https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c',true);
  xhr.send();
  xhr.onload = function (){
    let data = JSON.parse(this.responseText);
    let mainData = data.data.XML_Head.Infos.Info;
    dataInfo.push(...mainData);
    console.log(dataInfo);
    init();
  }
})()
function init(){
  renderCardGroup('苓雅區');
  renderPagination('苓雅區');
}

// 選擇行政區(selector/button)->data挑出該行政區組成陣列->從陣列中挑出需用資料（景點名稱-Name、行政區（用filter()撈Add符合行政區)、開館時間-Opentime、地址Add、電話Tel）->根據數量組成最多六個景點其他要點擊下一頁時替換
//資料data、事件event、畫面view


//data
//1 撈出同區data，組成陣列並回傳
function mapData(area){
  let obj ={
    area: area,
    newData: []
  };
  const dataLen = dataInfo.length;
  let address = "";
  for(let i=0;i<dataLen;i++){
    address = dataInfo[i].Add;
    if(address.indexOf(area) != -1){
      obj.newData.push(dataInfo[i]);
    }
  }
  return obj;
}
//2 算出每個頁面要顯示的陣列範圍
function getRangeFromData(data,displayPage = 1,displayData = 6){
  let dataLen = data.length;
  let firstData = null;
  let endData = null;
  const displayRange = [];
  let lastPage = Math.ceil(dataLen/displayData);
  let lastPageIsFloat = dataLen%displayData > 0;
  if(typeof(displayPage) !== 'number' || displayPage < 1 || displayPage > lastPage || displayPage % 1 !== 0){
    firstData = 0;
    endData = displayData;
  }else if(lastPage === displayPage && lastPageIsFloat){
    firstData = (lastPage-1) * displayData;
    endData = dataLen;
    console.log(lastPage === displayPage-1);
  }else{
    firstData = displayData * (displayPage-1);
    endData = displayData * displayPage;
  }
  displayRange.push(firstData);
  displayRange.push(endData);
  return displayRange;
}
//view 
//1 取出陣列資料並顯示於畫面上
function renderCardGroup(obj,displayPage = 1,displayData = 6){
  obj = mapData(obj);
  const newData = obj.newData;

  const displayRange = getRangeFromData(newData,displayPage,displayData);
  const firstData = displayRange[0];
  const endData = displayRange[1];
  let area = obj.area;
  const groupTitle =  document.querySelector('.card-area');
  groupTitle.textContent = area;
  
  let str = "";
  for(let i=firstData ;i<endData ;i++){
    let name = newData[i].Name;
    let opentime = newData[i].Opentime;
    let tel = newData[i].Tel;
    let imgUrl = newData[i].Picture1;
    let address = newData[i].Add;
    str+=`
    <div class="card">
    <div class="card-bg" style="background-image: url(${imgUrl});">
      <h2 class="title">${name}</h2>
      <p>${area}</p>
    </div>
    <div class="card-body d-flex"> 
      <ul class="w-75 list-group">
        <li>
          <p><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="">${opentime}</p>
        </li>
        <li>
          <p><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="">${address}</p>
        </li>
        <li>
          <p><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="">${tel}</p>
        </li>
      </ul>
      <div class="w-25 position-relative ">
        <p class="position-absolute bottom-0"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png" alt="">通通要錢</p>
      </div>    
    </div>
  </div>
    `
  }
  const cardGroup = document.querySelector('.card-group');
  cardGroup.innerHTML = str;
}
//2 作出相應pagination
function renderPagination(obj,displayPage = 1,displayData = 6){
  obj = mapData(obj);
  let newData = obj.newData;
  let dataLen = newData.length;

  const displayRange = getRangeFromData(newData,displayPage,displayData);
  const firstData = displayRange[0];
  let activePage = (firstData/displayData) + 1

  let totalPage = null;
  if(dataLen%displayData!=0){
    totalPage = Math.ceil(dataLen/displayData);
  }else{
    totalPage = dataLen/displayData;
  }

  let str = ``;
  str += `<li data-page = "pre"><i data-page="pre" class="fas fa-angle-left"></i></li>`;

  for(let i=1;i<totalPage+1;i++){
    str += `<li data-page = "${i}">${i}</li>`;
  }
  str += `<li data-page = "next" ><i data-page="next" class="fas fa-angle-right"></i></li>`
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = str;

  const li = document.querySelectorAll('.pagination li');
  li[activePage].setAttribute('class','active');
}



//事件
//1.select change事件
const areaSelector = document.querySelector('.area-select');
areaSelector.addEventListener('change',function(e){
  const area = e.target.value;
  renderCardGroup(area);
  renderPagination(area);
});
//2.btn click事件
const btnGroup = document.querySelector('.btn-group');
btnGroup.addEventListener('click',function(e){
  if(e.target.nodeName != 'LI'){return};
  const area = e.target.textContent;
  renderCardGroup(area);
  renderPagination(area);
})
//3. pagination選擇事件
const pagination = document.querySelector('.pagination');
pagination.addEventListener('click',function(e){
  

  const area = document.querySelector('.card-area').textContent;

  const clickPage = e.target.dataset.page;
  const nowPage = +document.querySelector('.pagination .active').dataset.page;
  const paginationGroup = document.querySelectorAll('.pagination li');
  const lastPage = nowPage + 1;
  const nowPageIsLastPage = paginationGroup.length-2 == nowPage;  

  if(clickPage == 'pre' && nowPage != 1){
    renderCardGroup(area,nowPage-1);
    renderPagination(area,nowPage-1);
    console.log(1);
  }else if(clickPage == 'next' && !nowPageIsLastPage ){
    renderCardGroup(area,nowPage+1);
    renderPagination(area,nowPage+1);
    console.log(2);
  }else if(!isNaN(clickPage)){
    renderCardGroup(area,+clickPage);
    renderPagination(area,+clickPage);
    console.log(3);
  }
})

