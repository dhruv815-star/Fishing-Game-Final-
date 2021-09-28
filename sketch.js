var boat,bg,hook,water, sophia, fish, fishB;
var enemy,timer;
var bgImg,sophiaImg,sophiaAnimation,sophiaWinImg,hookImg, waterImg,fish1Img,fish2Img,fish3Img,fish4Img,fish5Img,fish6Img, enemy1Img, enemy2Img,timerImg,connectorImg;
var fishGroup,fishBGroup,evilFishGroup;
var bgMusic, splashMusic,winMusic, loseMusic;
var boat, boatAnimation, bucketImg;

var score=0;
var index=0;
var visibility = 255;
var gameState = 1;
var target = 150;

function preload()
{
   fish1Img = loadImage("fish1.png");
   fish2Img = loadImage("fish2.png");
   fish3Img = loadImage("fish3.png");
   fish4Img = loadImage("fish4.png");
   fish5Img = loadImage("fish5.png");
   fish6Img = loadImage("fish6.png");
   enemy1Img = loadImage("octopusEvil.png");
   enemy2Img = loadImage("fishEvil.png");
   sophiaImg = loadImage("sophia(2).png");
   sophiaWinImg = loadImage("sophiaWin.png");
   sophiaAnimation = loadAnimation("sophia(1).png","sophia(2).png","sophia(3).png","sophia(4).png");
   bgImg = loadImage("bg.jpg");
   waterImg = loadImage("water2.png");
   hookImg = loadImage("hook1.png");
   timerImg = loadImage("timer.png");

   bgMusic = loadSound("bgMusic.mp3");
   splashMusic = loadSound("splashM.mp3");
   winMusic = loadSound("winM.mp3");
   loseMusic = loadSound("gameLose2.mp3");
}

function setup() 
{
  createCanvas(1100, 1500);
  
  //creating sophia
  sophia = createSprite(width/2, 520,50,50);
  sophia.shapeColor = "pink";
  sophia.addImage(sophiaImg);
  sophia.scale = 1.6;

  //creating hook.
  hook = createSprite(width/2+155, 620);
  hook.addImage(hookImg);
  hook.scale = 0.2;
  //setting collider only on the edge of the hook.
  hook.setCollider("circle",50,100,50);
  hook.debug = false;

  //creating bg 
  bg = createSprite(500,750);
  bg.addImage(bgImg);
  bg.scale = 0.43;
  bg.depth = sophia.depth-1;

  //declaring all Groups.
  fishGroup = new Group();
  fishBGroup = new Group();
  evilFishGroup = new Group();

  //adding sound.
  bgMusic.play();
 
}

function draw() 
{
  background("red"); 

  if(gameState===1)
  {
      //looping of bg.
      bg.setVelocity(-5,0);

      if(bg.x<0)
      {
         bg.x = bg.width/8;
      }

         //hook touching the fish.
        
         for(var i=0; i<fishGroup.length; i++)
         {
            if(fishGroup.get(i).isTouching(hook))
            {
               fishGroup.get(i).x = hook.x+40;
               fishGroup.get(i).y = hook.y+40;
               fishGroup.get(i).lifetime = -1;
               fishGroup.get(i).rotation = 60;
            }
         
         }

         //hook touching bonus fish.
         for(var j=0; j<fishBGroup.length; j++)
         {
            if(fishBGroup.get(j).isTouching(hook))
            {
               fishBGroup.get(j).x = hook.x+60;
               fishBGroup.get(j).y = hook.y+40;
               fishBGroup.get(j).rotation = 60;
               fishBGroup.get(j).lifetime = -1;
            }
         }

         //hook touching evil fish group.
         for(var k=0; k<evilFishGroup.length; k++)
         {
            if(evilFishGroup.get(k).isTouching(hook))
            {
               evilFishGroup.setVelocityEach(0,0);
               evilFishGroup.get(k).lifetime = 10;
               fishBGroup.destroyEach();
               fishGroup.destroyEach();
               evilFishGroup.destroyEach();

               //making fading effect.
               visibility -= 2;
               tint (255, visibility);

               //changing gameState.
               gameState = 2;
               frameCount =0;
            }
         }

         //fish going in the bucket.
         for(var l=0; l< fishGroup.length; l++)
         {
            if(fishGroup.get(l).y < 500)
            {
               fishGroup.get(l).rotation = 270;
               fishGroup.get(l).scale = 0.2;
               fishGroup.get(l).x = sophia.x +100;
               fishGroup.get(l).y = sophia.y - 20;
               fishGroup.get(l).velocityX = 0;
               fishGroup.get(l).lifetime = 5;
               
               //increment of score
               score += 10;

               //adding splash sound
               splashMusic.play();
            }
         }

         //Bonus fish going in the bucket.
         for(var a=0; a< fishBGroup.length; a++)
         {
            if(fishBGroup.get(a).y < 500)
            {
               fishBGroup.get(a).rotation = 270;
               fishBGroup.get(a).scale = 0.1;
               fishBGroup.get(a).x = sophia.x +100;
               fishBGroup.get(a).y = sophia.y - 10;
               fishBGroup.get(a).velocityX = 0;
               fishBGroup.get(a).lifetime = 5;
               
               //increment of score
               score += 30;
            }

         }

         //if target is achieved.
          if(score >= target)
         {
            gameState = 2;
            frameCount =0;
         }

      

      evilFish();
      bonusFish();
      spawnFish();
      keyPressed();
      
      drawSprites();

       //fishing line
      //var rnd;
      //rnd = Math.round(random(-12,5));
      strokeWeight (5);
      line (hook.x,hook.y-20,sophia.x+160,sophia.y-120);

      //setting timer image
      image (timerImg, 40,50,50,50);
      
      //setting timer.
      timer = Math.round(60 - Math.round(frameCount)/30);
      if(timer > 10)
      {
         textSize (25);
         fill("black");
         text(timer + " sec", 100,80);
      }
      else if(timer<=10 && timer > 0)
      {
         textSize(30);
         textFont("arial black");
         fill("red");
         text(timer + " sec",100,80)
      }
      else
      {
         gameState = 2;
      }


      //displaying score. 
      fill("black");
      textFont ("arial black");
      textSize (25);
      text ("Score :  " + score, 900, 100);

      //displaying target.
      fill("black");
      textFont ("arial black");
      textSize (25);
      text ("Target :  " + target, 900, 140);

      //connector.
     // image(connectorImg,sophia.x+135, sophia.y-125,60,20);

  }

  //gameState 2.
  if(gameState===2)
  {
      bgMusic.stop();

      //if game ends after acheiving the target.
      if(score >= target)
      {
         background("#44E244");

         image(sophiaWinImg, 200,200,500,500);
   
         fill("black");
         textFont ("arial black");
         textSize (75);
         text ("Final Score :  " + score, 150, 850);
   
         textSize(50);
         text("Congratulations !!!", 200, 1100);
         text("You have Won !", 230, 1200);
         text("Press R to replay", 200, 1300);

         //playing sound.
         if(frameCount >10 && frameCount<12)
         {
            winMusic.play();
         }
        
   
      }
      else
      {
         background("#23E8E8");
         fill("black");
         textFont ("arial black");
         textSize (75);
         text ("Final Score :  " + score, 200, 550);

         textSize(50);
         text ("OH NO !!!" , 400, 1000);

         if(timer===0)
         {
            text("You ran out of time !", 250, 1100);
         }
         else
         {
            text("You got caught by the enemy !", 140, 1100);
         }
        
         text ("Press R to replay", 300, 1200);

          //playing sound.
          if(frameCount >10 && frameCount<12)
          {
            loseMusic.play();
          }
      }
      
     
  }

  //creating restart conditions and actions.
  if(keyDown("R") && gameState === 2) 
  {
     gameState = 1;

     //setting all variables to initial values.
     score =0;
     frameCount =0;

     //destroying groups
     fishBGroup.destroyEach();
     fishGroup.destroyEach();
     evilFishGroup.destroyEach();

     hook.y = 620;

     bgMusic.play();
     winMusic.stop();
     loseMusic.stop();
  } 

}

function keyPressed()
{
   if(keyDown("DOWN_ARROW")&& hook.y<1470)
   {
      hook.y += 10;
   }
 
   if(keyDown("UP_ARROW") && hook.y>450)
   {
      hook.y -= 10;
   }
 
}

function spawnFish()
{
   var rnd1 = Math.round(random(80,100));
   if(frameCount % rnd1 === 0)
   {
      fish = createSprite(1200, random(800,1200),50,50);
      fish.setVelocity(-4 - score/30,0);
      fish.depth = sophia.depth + 1;
      fish.depth = hook.depth - 1;
      fish.lifetime = 300;
      fishGroup.add(fish);
      

      var rnd2 = Math.round(random(1,4));

      switch(rnd2)
      {
         case 1 : fish.addImage(fish1Img);
                  fish.scale = 0.6;
                break;
         case 2 : fish.addImage(fish2Img);
                  fish.scale = 0.7;
                break;
         case 3 : fish.addImage(fish3Img);
                  fish.scale = 0.6;
                break;
         case 4 : fish.addImage(fish4Img);
                  fish.scale = 0.6;
                break;                      
         default : break;                    
      }

     
   }

}

//spawning bonus fish.
function bonusFish()
{
   var rnd = Math.round(random(300,500));

   if(frameCount % rnd === 0)
   {
      fishB = createSprite(1200, random(1000,1400),50,50);
      fishB.addImage(fish6Img);
      fishB.scale = 0.3;
      fishB.setVelocity(-10,0);
      fishB.lifetime = 300;
      fishBGroup.add(fishB);
   }

}

//spawning evil fish.
function evilFish()
{
   if(frameCount % Math.round(random(150,250)) === 0)
   {
      enemy = createSprite(1200,random(800,1400),50,50);
      enemy.setVelocity(-6,0);
      enemy.depth = hook.depth-1;
      enemy.lifetime = 300;
      evilFishGroup.add(enemy);
      var rnd = Math.round(random(1,2));

      switch(rnd)
      {
         case 1 : enemy.addImage(enemy1Img);
                  enemy.scale = 0.05;
               break;
         case 2 : enemy.addImage(enemy2Img);
                  enemy.scale=0.4;
               break;
         default: break;                  
      }
   }
   
}