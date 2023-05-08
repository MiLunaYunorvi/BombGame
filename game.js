const canvas = document.querySelector('#game');
var game = canvas.getContext('2d');
const buttonUp = document.querySelector("#arriba")
const buttonDown = document.querySelector("#abajo")
const buttonR = document.querySelector("#derecha")
const buttonL = document.querySelector("#izquieda")
const vida = document.querySelector("#vidas")
var segundos = document.querySelector("#tiempo")
var record = document.querySelector("#record")



var canvasSize;
var elementNumber;
var elementSize;
var bombitas = []
var regalito 
var nivel = 0
var mapa
var playerInicial;
var vidas = 3;
var timeInterval;
var tiempo;
var playerPosition = {
  x:undefined,
  y:undefined,
}
var nx, ny;

function startGame() {
  tiempo = Date.now()
  mapa = recorrerMapa()
  setSizing()
  contadores()
}

function contadores(){
  
  vida.innerText = '';
  for(let c=1;c<=vidas;c++){vida.append('❤️')}
  
  timeInterval = setInterval(()=>{ segundos.innerText = (Date.now()-tiempo)/1000;},500)
  
  record.innerText = localStorage.getItem('record')
}

function recorrerMapa(){
  mapa = maps[nivel]
  //con trim eliminamos espacios blancos, separamos por saltos de linea, ya tenemos 10 arrays
  //luego eliminamos espacios iniciales en cada array y finalmente separamos por elemento
  mapa = (mapa.trim().split('\n').map(a=>a.trim())).map(a=>a.split(''))
  return mapa
  const map = maps[0].match(/[IXO\-]+]/g).map(a=>a.split(""))
}

function renderMap(){
  game.font = elementSize+"px Verdana";
  game.textAlign = 'center';
  game.textBaseline = "middle"
  
//j-> columnas
//i -> filas
//Se va llenando de forma vertical, i itera entre filas
  for (let j=1; j<elementNumber+1;j++){
    for(let i=1; i<elementNumber+1;i++){
      let elemento = mapa[i-1][j-1]
      if(playerPosition.x === undefined  && elemento=='O'){playerPosition.x =elementSize*(j-1/2);playerPosition.y= elementSize*(i-1/2); nx=j; ny=i; playerInicial=[j,i]; console.log("PLAYER INICIAL" ,playerPosition)}
      //buscando y llenando posiciones de bombitas y regalito
      if(elemento=='X'){ bombitas.push( [i,j])}
      if(elemento=='I'){ regalito = [i,j]}


      game.fillText(emojis[`${elemento}`],elementSize*(j-1/2),elementSize*(i-1/2));
    }
   
  }

  //console.log(bombitas)
  //console.log(regalito)

  //revisar si aun se tienen vidas
  if (vidas <= 0){
    let id = setInterval(()=> {perdiste()},300)
    vidas=3;
    nivel = 0;
    playerPosition = {x:undefined,y:undefined,}
    bombitas=[]
    recorrerMapa()
    
    setTimeout(()=>{clearInterval(id);startGame()},1500)
    
  }
  else{
    renderPlayer()
  }
  
}

function perdiste(){
  game.font = elementSize+"px Verdana";
  game.fillStyle = 'black'
  game.fillRect(0,canvasSize/2-canvasSize/10,canvasSize,canvasSize/5)
  game.fillStyle = 'white'
  game.fillText( "PERDISTE",canvasSize/2,canvasSize/2)
  gamefillStyle = 'black'
  setTimeout(renderMap,280) 
}

function ganaste(){
  game.font = elementSize+"px Verdana";
  game.fillStyle = 'yellow'
  game.fillRect(0,canvasSize/2-canvasSize/10,canvasSize,canvasSize/5)
  game.fillStyle = 'black'
  game.fillText( "GANASTE",canvasSize/2,canvasSize/2)
  gamefillStyle = 'black'
  setTimeout(renderMap,280) 
}

function setSizing(){
  
  if (innerHeight>innerWidth)
  { canvasSize = innerWidth*0.6}
  else { canvasSize=innerWidth*0.4}
  canvas.setAttribute('width', canvasSize)
  canvas.setAttribute('height', canvasSize )
  canvas.setAttribute('margin','0px')
 
  //TAMAÑO ITEMS
  elementSize = canvasSize/10 ;
  elementNumber = canvasSize/elementSize;
  console.log("CanvasSize: ",canvasSize, elementSize)
  renderMap()
}

function renderPlayer(){
  playerPosition.x = (nx-1/2)*elementSize
  playerPosition.y = (ny-1/2)*elementSize
  if (playerPosition.x <0 ){playerPosition.x=elementSize/2}
  if (playerPosition.y <0 ){playerPosition.y=elementSize/2}
  if (playerPosition.y > canvasSize ){playerPosition.y=(elementSize)*(10-1/2)}
  if (playerPosition.x > canvasSize ){playerPosition.x=(elementSize)*(10-1/2)}
  //renderizando al jugador en el canvas
  game.fillText(emojis.PLAYER,playerPosition.x,playerPosition.y)
  nx = Math.round((playerPosition.x/elementSize)+1/2);
  ny = Math.round((playerPosition.y/elementSize)+1/2);
  console.log("render",playerPosition,ny,nx)
}

function clearCanvas(){
  game.save()
  game.clearRect(0,0,canvas.width,canvas.height)
  game.restore();
  bombitas = []
  renderMap();
  
}

window.addEventListener('load', startGame);
window.addEventListener('resize', setSizing);
window.addEventListener('keydown',moveByKeys)


function moveByKeys(event){
  switch (event.key){
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break ;
    case "ArrowRight": moveRight(); break;
    case "ArrowLeft": moveLeft(); break;
  } 
}

function detecciones(){
  let actualPlayer = [ny,nx]
  if (actualPlayer.toString() === regalito.toString()){
    console.log('ganaste')
    if (nivel==2)
    {clearInterval(timeInterval); 
      let id = setInterval(()=> {ganaste()},300)
      vidas=3;
      nivel = 0;
      playerPosition = {x:undefined,y:undefined,}
      bombitas=[]
      recorrerMapa()
      setTimeout(()=>{clearInterval(id);startGame()},1500)
      localStorage.setItem('record',(Date.now()-tiempo)/1000)
      
    }
    else{
      nivel+=1;
      mapa = recorrerMapa()
      playerPosition = {x:undefined,y:undefined,}
    }
    

    
  }
  bombitas.forEach( e => {  if(e.toString()==actualPlayer.toString()){
    console.log("bombita")
    mapa[ny-1][nx-1] = 'BOMB_COLLISION'
    ny = playerInicial[1];
    nx = playerInicial[0];
    vidas-=1;
    contadores()
  }})  
}

function moveRight(){
  
  nx+=1;
  detecciones()
  clearCanvas()
}

function moveUp(){
  ny-=1;
  detecciones()
  clearCanvas()
}
function moveDown(){
  ny+=1;
  detecciones()
  clearCanvas()
}
function moveLeft(){
  nx-=1;
  detecciones()
  clearCanvas()
}

