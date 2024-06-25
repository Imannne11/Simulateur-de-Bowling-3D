
  
 function cameraLumiere(scene,camera){   // creation de la camera 
  camera.up = new THREE.Vector3( 0, 0, 1 );
  var xPos=-15;
  //modification de la jauge si document.forms["controle"].PosX.value;
  var yPos=-6;//document.forms["controle"].PosY.value;//*document.forms["controle"].zoom.value;
  var zPos=6;//document.forms["controle"].PosZ.value;//*document.forms["controle"].zoom.value;
  var xDir=0;//document.forms["controle"].DirX.value;
  var yDir=0;//document.forms["controle"].DirY.value;
  var zDir=0;//testZero(document.forms["controle"].DirZ.value);
  camera.position.set(xPos, yPos, zPos);
  camera.lookAt(xDir, yDir, zDir);
    //camera.lookAt(scene.position);
    //camera.lookAt(new THREE.Vector3(0,0,0));
} // fin fonction cameraLumiere
 


 
//*************************************************************
//* 
//        F I N     C A M E R A
//
//*************************************************************

 function lumiere(scene){
    let lumPt = new THREE.PointLight(0xff55ff);
    lumPt.position.set(3,3,-3);
    lumPt.intensity = 1;
    lumPt.shadow.camera.far=2000;
    lumPt.shadow.camera.near=0;
    scene.add(lumPt);
    let lumPt1 = new THREE.PointLight(0xffffff);
    lumPt1.castShadow = true;
    lumPt1.shadow.camera.far=2000;
    lumPt1.shadow.camera.near=0;
    lumPt1.position.set(5,-15,15);
    lumPt1.intensity = 1;
    scene.add(lumPt1);
}// fin fonction lumiere