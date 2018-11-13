
var cnt = 0;
var bulletArr = [];
var plane = null;
var mark1 = 0;
var enemyArr = [];
var timer = null;

function OurPlane(x, y) {
  var imageSrc = 'image/ourPlane.gif';
  return new Plane(x,y,66,80,imageSrc,'image/ourBlastPlane.gif',1,0);
}

/*
 posy,posy飞机坐标
 width,height 飞机宽度和高度
 planeSrc 飞机图片
 BlastPlaneImage 飞机爆炸图片
 speed 飞机速度
 scores 每个飞机的打死后获得的分数
 accacksCount 每个飞机的血量，也就是消耗子弹的次数
 dieTime 每个飞机死亡后多长时间移除dom
*/

function Plane(posX, posY,width,height,planeSrc,blastPlaneImage,speed,scores,attacksCount,dieTime) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.planeSrc = planeSrc;
    this.speed = speed;
    this.blastPlaneImage = blastPlaneImage;
    this.isPlaneBlast = false;
    this.plandietime = dieTime;
    this.scores = scores;
    this.attacksCount = attacksCount;
    this.plandietimes = 0;
    this.init();
}
// 画加一个飞机，并添加到dom中

Plane.prototype.init = function () {
    this.imageNode = document.createElement('img');
    this.imageNode.style.left = this.posX + 'px';
    this.imageNode.style.top = this.posY + 'px';
    this.imageNode.src = this.planeSrc;
    this.imageNode.setAttribute('id','ourplane');
    this.imageNode.setAttribute('aa',cnt);
    document.getElementById('main').appendChild(this.imageNode)

};
// 鼠标移动时飞机的位置
Plane.prototype.move = function () {
    var _this = this;
    var planeDom = _this.imageNode.style;
    $('.main').bind('mousemove', (event)=> {
        planeDom.left = event.clientX - 278 + 'px';
        planeDom.top = event.clientY  - 118 + 'px';
      })
};
// 敌机向下运动
Plane.prototype.autoMove = function () {
    if (this.scores <= 50000) {
        this.imageNode.style.top= this.imageNode.offsetTop + this.speed+"px";
        return;
    }
    if (this.speed > 50000 && this.speed <= 200000) {
        this.imageNode.style.top= this.imageNode.offsetTop + this.speed + 1 +"px";
        return;
    }
    if (this.speed > 200000 && this.speed <= 300000) {
        this.imageNode.style.top= this.imageNode.offsetTop + this.speed + 2 + "px";
        return;
    }
    if (this.speed > 300000 && this.speed <= 500000) {
        this.imageNode.style.top= this.imageNode.offsetTop + this.speed + 3 + "px";
        return;
    }
    this.imageNode.style.top= this.imageNode.offsetTop + this.speed + 4 + "px";
};
 // 触发鼠标移动事件
function planeMove () {
    $('body').on('mousemove', (event)=>{
        isBeyondArea(event);
    })
}
// 判断是否超出边界
function isBeyondArea(event) {
    if(event.clientX < 250 || event.clientX> 560 || event.clientY < 120 || event.clientY > 641)  {
       $('.main').unbind('mousemove');
    } else {
        $('.main').unbind('mousemove');
        plane.move();
    }
}

/*增加一个子弹的类
* clinetX,clientY 子弹的坐标
* width,height 子弹的大小
* imageSrc子弹的图片
*
* */

function Bullet (clientX,clientY,width,height,imageSrc) {
    this.clientX = clientX;
    this.clientY = clientY;
    this.width = width;
    this.height = height;
    this.imageSrc = imageSrc;
    this.attackPower = 1;
    this.init();
}
// 在页面上添插入一个子弹的图片
Bullet.prototype.init = function () {
  this.bulletImageNode = document.createElement('img');
    this.bulletImageNode.style.left = this.clientX + 'px';
    this.bulletImageNode.style.top = this.clientY + 'px';
    this.bulletImageNode.src = this.imageSrc;
    $('.main')[0].appendChild(this.bulletImageNode);
};
// 子弹的移动方式，每次向上移动20px
Bullet.prototype.move = function () {
    this.bulletImageNode.style.top = this.bulletImageNode.offsetTop- 20+"px";
};

// 创建子弹的方法
function addBullet(x,y) {
  return new Bullet(x,y,6,14,"image/bullet.png");
}

// 创建敌机的类,
function Enemy(cposX, posY,width,height,planeSrc,blastPlaneImage,speed,score,attacksCount,dieTime) {
   return new Plane(random(cposX,posY),-10,width,height,planeSrc,blastPlaneImage,speed,score,attacksCount,dieTime)
}

// 产生一个所及数，主要用于对敌机的位置和速度随机
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}
// 根据函数调用的次数，创建敌机
function createEnemy () {
    if(cnt==20){
         mark1++;
        // 中飞机
        if(mark1%5==0){
            enemyArr.push(new Enemy(25,274,46,60,"image/enemyMiddle.png","image/enemyMiddleBlast.gif",random(1,3),5000,6,360));
        }
        //大飞机
        if(mark1==20){
            enemyArr.push(new Enemy(57,210,110,164,"image/enemyBig.png","image/enemyBigBlast.gif",1,30000,12,540));
            mark1=0;
        }
        //小飞机
        else{
            enemyArr.push(new Enemy(19,286,34,24,"image/enemySmall.png","image/enemySmallBlast.gif",random(1,4),1000,1,360));
        }
        cnt=0;
    }
}
// 移动敌机
function moveEnemyPlane() {
    enemyArr.map((item)=>{
       item.autoMove();
    })
}
// 删除敌机
// 1.如果没有被打爆就继续移动,
// 2.如果超出边界,就移除dom,同时删除数组中的子弹,
// 3.如果已经被打爆,在达到时间后删除
function deleteEnemyPlaneForBeyondArea () {
    var len = enemyArr.length;
    for (var i = 0; i< len; i++) {
        var item = enemyArr[i];
        if(item.isPlaneBlast != true){
            item.autoMove();
        }
        if (item.imageNode.offsetTop >540) {
            $('.main')[0].removeChild(item.imageNode);
            enemyArr.splice(i,1);
            len--;
        }
        if(item.isPlaneBlast == true){
            item.plandietimes+=20;
            if(item.plandietimes == item.plandietime){
                $('.main')[0].removeChild(item.imageNode);
                enemyArr.splice(i,1);
                len--;
            }
        }
    }
}
/*游戏入口
* 创建子弹
* 调用创建敌机的方法
* */
function startGame () {
  cnt ++;
  if(cnt % 5 === 0) {
      bulletArr.push(addBullet(parseFloat(plane.imageNode.style.left) + 30, parseFloat(plane.imageNode.style.top)));
  }
  for(var i = 0; i< bulletArr.length; i++) {
      var item = bulletArr[i];
      item.move();
      if(item.bulletImageNode.offsetTop<0){
          $('.main')[0].removeChild(item.bulletImageNode);
          bulletArr.splice(i,1);
          i--;
      }
  }
    createEnemy();
    moveEnemyPlane();
    deleteEnemyPlaneForBeyondArea();
    isBlastPlane();
}
/*判断飞机是否被爆炸
* 首先判断自己的飞机是否与敌机相撞
* 再判断子弹是否打中敌机
* 判断规则都一样
* 首先判断左右是否可以相撞; 先拿第一个物体的offsetLeft加上width是否大于另一个物体的offsetLeft, 在拿另一个物体的offsetLeft加上width是否小于第一个物体的offsetLeft
* 然后在判断高度，反正上面物体的高度一定要大于等于下面这个物体，临界一个物体在另一个物体的内部;
* 如果已经判断飞机被打爆，就换一个被炸毁的图片
* */



function isBlastPlane () {
   var len = bulletArr.length;
   for (let i = 0; i<len; i++) {
     let bulleItem = bulletArr[i].bulletImageNode;
     for (let j=0 ; j< enemyArr.length; j++) {
         let item = enemyArr[j];
         let enemyItem = item.imageNode;

         if((enemyItem.offsetLeft + enemyItem.width) >= plane.imageNode.offsetLeft && enemyItem.offsetLeft <= (plane.imageNode.offsetLeft + plane.imageNode.width)){
             if((enemyItem.offsetTop + enemyItem.height) >= (plane.imageNode.offsetTop +40) && enemyItem.offsetTop <= (plane.imageNode.offsetTop + plane.imageNode.height -20)){
                 plane.imageNode.src = plane.blastPlaneImage;
                 endGame();
                 return;
             }
         }
         if((bulleItem.offsetLeft + bulleItem.width) > enemyItem.offsetLeft && bulleItem.offsetLeft < (enemyItem.width + enemyItem.offsetLeft)) {
             if(bulleItem.offsetTop < (enemyItem.offsetTop + enemyItem.height) && (bulleItem.offsetTop + bulleItem.height) > enemyItem.offsetTop) {
                 item.attacksCount =  item.attacksCount - bulletArr[i].attackPower;
                 if (item.attacksCount === 0) {
                     plane.scores=plane.scores + item.scores;
                    $('.scores').html(plane.scores);
                     item.imageNode.src = item.blastPlaneImage;
                     item.isPlaneBlast = true;
                 }
                 $('.main')[0].removeChild(bulleItem);
                 bulletArr.splice(i,1);
                 len--;
                 break;
             }
         }
     }
   }
}

// 结束游戏的方法
function endGame (){
    clearInterval(timer);
    $('.main').unbind('mousemove');
    $('body').unbind('mousemove');
    $('.endGame').show();
    clearData();
}
function continueName () {
    timer = setInterval(startGame, 20);
    planeMove();
    $('.gamePurse').hide();
}
function reStart () {
    clearData();
    $('.endGame').hide();
    $('.gamePurse').hide();
    $('.main').find('img').remove();
    $('.scores').html(0);
    setTimeout(()=> {
    plane = new OurPlane(120,485);
    planeMove();
    timer = setInterval(startGame, 20);
    }, 1000)
}
function purse () {
    if(plane) {
        clearInterval(timer);
        $('.main').unbind('mousemove');
        $('body').unbind('mousemove');
        $('.gamePurse').show();
    }

}
function clearData() {
    plane = null;
    cnt = 0;
    bulletArr = [];
    mark1 = 0;
    enemyArr = [];
}
function start(event) {
    $('.main').css("background","url('image/bg.png')");
    $('.startBtn').hide();
    $('.showScores').show();
    plane = new OurPlane(120,485);
    planeMove();
    timer = setInterval(startGame, 20);
    event.stopPropagation();
}
