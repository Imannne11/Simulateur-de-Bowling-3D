const borneVue=25;//amplitude de deplacement de la camera

function init(){

  var stats = initStats();
      /*
    * Pour pouvoir afficher quoi que ce soit avec three.js, nous avons besoin
    * de trois choses : la scène, la caméra et le moteur de rendu,
    * afin de pouvoir rendre la scène avec la caméra.
    * */
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();   
  let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0xCECECE));
  rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
  /*
    * Donnez à la caméra une position par défaut, ajoutez de l'éclairage
    * à la scène pour rendre les objets visibles, puis créez des flèches vectorielles.
    * */
  cameraLumiere(scene,camera);
  lumiere(scene);
  repere(scene);

 //********************************************************
 //
 //  P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
 
 //********************************************************
 // D E B U T     B O U L E
 //********************************************************

 /*
    * Créez un objet qui représente la boule de Bowling et donnez-lui
    * une couleur rouge et on ajoute un deuxième objet courbe (Tennis)
    * Après cela, nous les regroupons dans un seul objet.
    * */
  let R=0.5;
  let nbeParallel = 100;
  let nbeMeridien = 60 ;

  let sphereGeom = new THREE.SphereGeometry (R, nbeParallel, nbeMeridien);

  let MaterialPhong1= new THREE.MeshPhongMaterial({
    color: "#FF0303", 
    specular:"#FFFFFF", 
    flatShading: true,
    shininess:30,
  });

  let spherePhong1 = new THREE.Mesh(sphereGeom,MaterialPhong1);
  spherePhong1.position.set(0,0,0);
  spherePhong1.castShadow = true;
  spherePhong1.receiveShadow = true;

  let TabNadal = Nadal(100);
  let PtsTab=new THREE.BufferGeometry().setFromPoints(TabNadal);
  let ProprieteCbe = new THREE.LineBasicMaterial( {
    color: "#FFFFFF", 
    linewidth:2
  });
  let courbePara = new THREE.Line( PtsTab, ProprieteCbe );

  // On insert la courbe (Tennis) et la boule dans un 'Group' pour qu'ils forments un seul unique et même objet
  let spherePhong = new THREE.Group();
  spherePhong.add(spherePhong1,courbePara);
  scene.add(spherePhong);

 //********************************************************
 // F I N     B O U L E
 //********************************************************












 //********************************************************
 // D E B U T     P I S T E
 //********************************************************

 /*
    * Preparation de la piste
    * */

  let cube = new THREE.BoxGeometry(30,8,0.1);
  let MatPhong = new THREE.MeshPhongMaterial({
    color: "#C66731",
    flatShading: true,
    shininess:30,
    side: THREE.DoubleSide,
  })
  let CubePhong = new THREE.Mesh(cube, MatPhong);
  CubePhong.position.set(11.5,0,-0.55);
  scene.add(CubePhong);

 //********************************************************
 // F I N     P I S T E
 //********************************************************












 //********************************************************
 // D E B U T     C O U R B E S
 //********************************************************

  /*
    * Definition des points de controles des courbes
    * */
  let P0 = new THREE.Vector3(0,0,0);
  let P1 = new THREE.Vector3(6.25,0,0);
  let P2 = new THREE.Vector3(12.5,0,0);
  let P3 = new THREE.Vector3(18.75,0,0);
  let P4 = new THREE.Vector3(25,0,0);
  let nb=50;
  let epai=2;


 /*
    *   // definition de la courbe de Bezier de degre 2
    * */
  let Pt1;
  let Pt2;
  let TabCbe = TraceBezierQuadratique(P0, P1, P2, P3, P4, nb, "#FF0000",epai);
  let cbeBez2 = TabCbe[0];
  let cbeBez1 = TabCbe[1];
  scene.add(cbeBez1);
  scene.add(cbeBez2);

 //********************************************************
 // F I N     C O U R B E S
 //********************************************************












 //********************************************************
 // D E B U T     Q U I L L E
 //********************************************************

  /*
    * Création et Insertion des objets Quilles dans la scene.
    * */
  let tab = []; // tableau contenant toutes les quilles "présentent sur la scene"
  for(let i=0;i<4;i++){
    let x = 20+i;
    for(let j=-i;j<=i;j+=2){
      let y = j;
      let Q = Quille();
      Q.position.set(x,y,-0.5);
      tab.push(Q);
      scene.add(Q);
    }
  }

 //********************************************************
 // F I N     Q U I L L E
 //********************************************************












 //********************************************************
 // D E B U T     C O N T R O L E     C A M E R A
 //********************************************************

 /*
    * La manipulation de la caméra à l'aide de la souris de l'utilisateur
    * */

  var controls = new THREE.OrbitControls (camera, rendu.domElement);
  animate();

 //********************************************************
 // F I N     C O N T R O L E     C A M E R A
 //********************************************************
 
 //********************************************************
 //
 // F I N      P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
 
    /*
    * Interface graphique utilisateur ajout du menu dans le GUI.
    * Pour lancer la simulation du lancement de la boule
    * */
 var gui = new dat.GUI();
  let menuGUI = new function () {
    this.cameraxPos = camera.position.x;
    this.camerayPos = camera.position.y;
    this.camerazPos = camera.position.z;
    this.cameraxDir = 0;
    this.camerayDir = 0;
    this.camerazDir = 0;
    this.Point_controle1 = 0;
    this.Point_controle2 = 0;
    this.Point_depart = 0;
    this.Point_arrive = 0;
    this.Jointure = 0;
    this.Lancement = function () {
      Lance(0);
    }

    //pour actualiser dans la scene   
    this.actualisation = function () {
    reAffichage();
    }; // fin this.actualisation

  }; // fin de la fonction menuGUI

  // ajout de la camera dans le menu
  CourbeGui(gui,menuGUI,scene,P0,P1,P2,P3,P4,cbeBez2,cbeBez1,spherePhong);
  //ajout du menu pour actualiser l'affichage 
  gui.add(menuGUI, "Lancement");
  menuGUI.actualisation();

 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************

  renduAnim();
  /*
    * Ajoute le rendu dans l'element HTML.
    * */
  document.getElementById("webgl").appendChild(rendu.domElement);
  // affichage de la scene
  rendu.render(scene, camera);

 //********************************************************
 //
 //  F O N C T I O N S     I D O I N E S
 //
 //********************************************************

 function animate(){

    // Anime le controle de la camera via la souris

    controls.update();
    requestAnimationFrame ( animate );  
    rendu.render (scene, camera);
  }

  function Nadal(t){

    // Renvoie les points de la Courbe (Tennis) de la boules. Ces points sont stockés dans un tableau

    let points = new Array(t+1);
    let ep = 0.005;
    for (let k=0;k<= t;k++){
      let a = (3/4)*(R+ep);
      let b = (R+ep)-a;
      let t2= (k*2*Math.PI)/t;
      let x0=a*Math.cos(t2)+ b*Math.cos(3*t2);
      let y0=a*Math.sin(t2)- b*Math.sin(3*t2);
      let z0= 2*Math.sqrt(a*b)*Math.sin(2*t2);
      points[k]= new THREE.Vector3(x0,y0,z0);
    }
    return points
  }

  

  function Collision(Obj1,Obj2){

    // Simule la collision entre deux objets, puis supprime le deuxième objet de la scene
    // Ici Obj1 designe la boule et Obj2 une des quilles
  
    let firstBB = new THREE.Box3().setFromObject(Obj1);
    
    let secondBB = new THREE.Box3().setFromObject(Obj2);
    
    if (firstBB.intersectsBox(secondBB)){
      return true;
    }

  }

  function Lance(k){

    // Simule le déplacement de la boule en fonctions des courbes de Béziers

    if(k<=100){
      Avance(k);
      for(let i=0;i<10;i++){
        // Parcours le tableau de quilles
        // Vérifie si une collision a lieu
        let q = tab[i];
        if(Collision(spherePhong,q)){
          scene.remove(q);
        }
      }
      setTimeout(Lance,20,k+1);
    }
  }

 

  function Avance(n){

    // Déplace le centre de la boule au niveau des points de la courbe
    // Simule une rotation de la Boule

    if(n<50){
      spherePhong.position.set(Pt1[n].x,Pt1[n].y,0);
      spherePhong.rotation.y += 0.4;
    }
    else{
      spherePhong.position.set(Pt2[n-50].x,Pt2[n-50].y,0);
      spherePhong.rotation.y += 0.4;
    }
 }
 
 

  
 
  function reAffichage() {

    // Reaffiche le rendu de la scene

    setTimeout(function () { 
  
    }, 200);// fin setTimeout(function ()
      // render avec requestAnimationFrame
    rendu.render(scene, camera);

  }// fin fonction reAffichage()

 
  function renduAnim() {
    stats.update();
    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
    // ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }


  function TraceBezierQuadratique(P0, P1, P2, P3, P4, nbPts,coul,epaiCbe){

    // Creation et Renvoie des deux courbes de Béziers dans la scene

    let cbeBe2 = new THREE.QuadraticBezierCurve3 (P0, P1, P2 );
    let cbeBe1 = new THREE.QuadraticBezierCurve3 (P2, P3, P4 );

    //Propriete geometrique de la courbe
    let cbeGeometry2 = new THREE.Geometry();
    let cbeGeometry1 = new THREE.Geometry();

    // Points de la courbe de Bezier
    cbeGeometry2.vertices = cbeBe2.getPoints(nbPts);
    cbeGeometry1.vertices = cbeBe1.getPoints(nbPts);
    Pt1 = cbeGeometry2.vertices;
    Pt2 = cbeGeometry1.vertices;

    //Aspect de la courbe
    let material = new THREE.LineBasicMaterial({
      color : coul ,
      linewidth: epaiCbe
    } );

    // Courbe de Bezier avec les proprietes geometriques et l’aspect
    let CB2 = new THREE.Line( cbeGeometry2, material );
    let CB1 = new THREE.Line( cbeGeometry1, material );

    //Renvoi de la courbe pour une utilisation ulterieure
    return [CB2,CB1];

  } //fin de la fonction TraceBezierQuadratique


  function CourbeGui(gui,menuGUI,scene,P0,P1,P2,P3,P4,cbeBez2,cbeBez1,spherePhong){

    // Ajout des courbes dans le menu  GUI
    
    let TabCbeb;
    let guiCourbe = gui.addFolder("Courbes de Bézier");

    guiCourbe.add(menuGUI,"Point_controle1",-3,3).onChange(function () {
      if (cbeBez1) scene.remove(cbeBez1);
      if (cbeBez2) scene.remove(cbeBez2);
        P1.setComponent(1,menuGUI.Point_controle1);
        TabCbeb = TraceBezierQuadratique(P0, P1, P2, P3, P4, nb, "#FF",epai);
        cbeBez2 = TabCbeb[0];
        cbeBez1 = TabCbeb[1];
        scene.add(cbeBez1);
        scene.add(cbeBez2);
    });

    guiCourbe.add(menuGUI,"Point_controle2",-3,3).onChange(function () {
      if (cbeBez1) scene.remove(cbeBez1);
      if (cbeBez2) scene.remove(cbeBez2);
        P3.setComponent(1,menuGUI.Point_controle2);
        TabCbeb = TraceBezierQuadratique(P0, P1, P2, P3, P4, nb, "#FF0000",epai);
        cbeBez2 = TabCbeb[0];
        cbeBez1 = TabCbeb[1];
        scene.add(cbeBez1);
        scene.add(cbeBez2);
    });

    guiCourbe.add(menuGUI,"Point_depart",-3,3).onChange(function () {
      if (cbeBez1) scene.remove(cbeBez1);
      if (cbeBez2) scene.remove(cbeBez2);
      if (spherePhong) scene.remove(spherePhong);
        P0.setComponent(1,menuGUI.Point_depart);
        spherePhong.position.set(0,menuGUI.Point_depart,0);
        TabCbeb = TraceBezierQuadratique(P0, P1, P2, P3, P4, nb, "#FF0000",epai);
        cbeBez2 = TabCbeb[0];
        cbeBez1 = TabCbeb[1];
        scene.add(spherePhong);
        scene.add(cbeBez1);
        scene.add(cbeBez2);
    });

    guiCourbe.add(menuGUI,"Point_arrive",-3,3).onChange(function () {
      if (cbeBez1) scene.remove(cbeBez1);
      if (cbeBez2) scene.remove(cbeBez2);
        P4.setComponent(1,menuGUI.Point_arrive);
        TabCbeb = TraceBezierQuadratique(P0, P1, P2, P3, P4, nb, "#FF0000",epai);
        cbeBez2 = TabCbeb[0];
        cbeBez1 = TabCbeb[1];
        scene.add(cbeBez1);
        scene.add(cbeBez2);
    });

    guiCourbe.add(menuGUI,"Jointure",-3,3).onChange(function () {
      if (cbeBez1) scene.remove(cbeBez1);
      if (cbeBez2) scene.remove(cbeBez2);
        P2.setComponent(1,menuGUI.Jointure);
        TabCbeb = TraceBezierQuadratique(P0, P1, P2, P3, P4, nb, "#FF0000",epai);
        cbeBez2 = TabCbeb[0];
        cbeBez1 = TabCbeb[1];
        scene.add(cbeBez1);
        scene.add(cbeBez2);
    });
  }//fin de la fonction CourbeGui

} 

//********************************************************
//
//  F I N     D E     L A     F O N C T I O N      I N I T
//
//*******************************************************




function latheBez3(nbePtCbe,segments,P0,P1,P2,P3,coul){

  // Fonction qui crée une lathe en fonction des points de controle de sa courbe

  let MatPhong = new THREE.MeshPhongMaterial({
    color: coul,
    flatShading: true,
    shininess:30,//brillance
    side: THREE.DoubleSide,//2
  })
  let p0= new THREE.Vector2(P0.x,P0.y);
  let p1= new THREE.Vector2(P1.x,P1.y);
  let p2= new THREE.Vector2(P2.x,P2.y);
  let p3= new THREE.Vector2(P3.x,P3.y);
  let Cbe3 = new THREE.CubicBezierCurve(p0,p1,p2,p3);
  let points = Cbe3.getPoints(nbePtCbe);
  let latheGeometry = new THREE.LatheGeometry(points,segments,0,2*Math.PI);
  let lathe = new THREE.Mesh(latheGeometry, MatPhong);
  return lathe;
}// fin latheBez3


function Quille(){

  // Creation d'un objet Quille

  let nbPtCB=50;//nombre de points sur la courbe de Bezier
  let segments=150;// nbe de points sur les cercles

    //lathe1 : Haut de la Quille
  let a0 = new THREE.Vector3(1/3,5/3,0);
  let a1 = new THREE.Vector3(-0.5/3,6/3,0);
  let a2 = new THREE.Vector3(1.5/3,7/3,0);
  let a3 = new THREE.Vector3(0,7.3/3,0);
  let lathe1 = latheBez3(nbPtCB,segments,a0,a1,a2,a3,"#FFFFFF");

    //lathe2 : Milieu de la Quille
  let b0 = new THREE.Vector3(1/3,1/3,0);
  let b1 = new THREE.Vector3(1.5/3,2.5/3,0);
  let b2 = new THREE.Vector3(2/3,4/3,0);
  let b3 = new THREE.Vector3(1/3,5/3,0);
  let lathe2 = latheBez3(nbPtCB,segments,b0,b1,b2,b3,"#0080FF");

    //lathe3 : Bas de la Quille
  let c0 = new THREE.Vector3(0,0,0);
  let c1 = new THREE.Vector3(1/3,-0.5/3,0);
  let c2 = new THREE.Vector3(1/3,0.9/3,0);
  let c3 = new THREE.Vector3(1/3,1/3,0);
  let lathe3 = latheBez3(nbPtCB,segments,c0,c1,c2,c3,"#FFFFFF");

  let Grouplathe = new THREE.Group();
  Grouplathe.add(lathe1);
  Grouplathe.add(lathe2);
  Grouplathe.add(lathe3);
  Grouplathe.rotateX(Math.PI/2);
  return Grouplathe;
}







