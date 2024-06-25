
//vecteur AB qui est une fleche
function vecteur(MaScene,A,B,CoulHexa,longCone,RayonCone){
 var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
 vecAB.normalize();
 MaScene.add( new THREE.ArrowHelper( vecAB, A, B.distanceTo(A), CoulHexa, longCone, RayonCone ));
}

//affichage du repere dans la scene
function repere(MaScene){ 
    var PointO3 = new THREE.Vector3( 0,0,0 );
    var vecI = new THREE.Vector3( 1, 0, 0 );
    var vecJ = new THREE.Vector3( 0, 1, 0 );
    var vecK = new THREE.Vector3( 0, 0, 1 );
    vecteur(MaScene,PointO3,vecI, 0xFF0000, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecJ, 0x00FF00, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecK, 0x0000FF, 0.25, 0.125 );
}

const PrecisionArrondi=50;
// test si un nombre est nul
const epsilon = 0.00000001;
function testZero(x){
  var val=parseFloat(Number(x).toPrecision(PrecisionArrondi));
  if (parseFloat(Math.abs(x).toPrecision(PrecisionArrondi))<epsilon) val=0;
  return val;
}


//vecteur normal unitaire a une face
function vecteurProdVec(MaScene,A,u,v,CoulHexa,longCone,RayonCone){
 let w = new THREE.Vector3(0,0,0);
 let C = new THREE.Vector3(0,0,0);
 w.crossVectors(u,v);
 w.normalize();
 C.addVectors(A,w);
 vecteur(MaScene,A,C,CoulHexa,longCone,RayonCone);
}


// affichage des composantes dans la page HTML
function afficheVecteur(V,nom,lieu){
 var mes = nom+" : (";
 for(var i=0;i<2;i++)
   mes+=V.getComponent(i)+" , ";
 mes+=V.getComponent(2)+" ) <br /><br /> Avec TestZero :<br />";
 mes += nom+" : (";
 for(var i=0;i<2;i++)
   mes+=testZero(V.getComponent(i))+" , ";
 mes+=testZero(V.getComponent(2))+" ) <br />";
 document.getElementById(lieu).innerHTML+=mes;
}
