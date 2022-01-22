/**
 * @auteur : Séverin Robert
 * @time : 08/08/2020
 */

"usestrict";
document.addEventListener('DOMContentLoaded',initPage);
let autorisations = new Object();
let tabBoule = [4,5,6,12,13,14,15,16,20,21,22,23,24,25,26,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,56,57,58,59,60,61,62,66,67,68,69,70,76,77,78];
let tabRouge = [0,0,0,0];
let sauvegardeSelection = 1;
let nbClick = 0;
let bouleRestante = 57;
let sauvegardeMouvements = [];
const COULEUR_BOULE = "black";
const COULEUR_VIDE = "saddlebrown";
const COULEUR_CASE = "burlywood";
const COULEUR_SELECTION = "grey";
const COULEUR_CHOIX = "red";
const option = ["Jouer","Options","Records"];

function initPage() {
	let ligne = "";
	for(i in option) {
		ligne += `<tr><td id= ${option[i]} class='optionMenu' onclick='${option[i]}()'>${option[i]}</td></tr>`;
	}
	gId("body").innerHTML = "<table id='menu'>" + ligne + "</table>";
}

function Jouer() {
	creationAutorisation();							//Crée l'objet qui sert à savoir si la boule peut se déplacer en Haut,Bas,Gauche,Droite (HBGD)
	let tableauDeJeu = "";
	let compteur = 1;
	let ligne = "";
	nbClick = 0;
	bouleRestante = 57;
	let endroitPoint = false;
	for(let i = 0;i < 9; i++) {				//on crée le plateau de jeu
		for(let j = 0;j < 9; j++) {
			tabBoule.forEach(k => { if(k === compteur) { endroitPoint = true; } });			//on rajoute une boule à chaque emplacement du tableau des boules
			if(endroitPoint) {
				ligne += `<td id = ${String(compteur)} class="case" onclick="position(this)"><div class="boule"></div></td>`;
				endroitPoint = false;
			}
			else {	ligne += `<td id = ${String(compteur)} class="bord"></td>`;	}		//si la case ne fait pas partie des emplacement prévu pour les boules, c'est une case vide
			compteur++;
		}
		tableauDeJeu += "<tr>" + ligne + "</tr>";
		ligne = "";
	}
	gId("body").innerHTML = "<table id='tableauDeJeu'>" + tableauDeJeu + "<p id='etat'>Boules Restantes : <span id='etatBoulesRestantes'></span><br>Nombres de cliques : <span id='etatNbCliques'></span></p>"
	+ "</table><button onclick='fin()'>Terminer</button>" + "<button onclick='initPage()'>Menu</button>";
	tabBoule.forEach(boule => { gId(boule).firstElementChild.style.backgroundColor = COULEUR_BOULE; });
}

function Options() {
	initCurseurs();
}

function fin() {
	gId("tableauDeJeu").innerHTML = "Bravo vous avez fini avec " + bouleRestante + " boules restantes, tout ça en " + nbClick + " cliques !<button onclick='Jouer()'>Recommencer</button>";
}

function position(id) {
	if(nbClick === 0) { id.firstElementChild.style.backgroundColor = COULEUR_VIDE; nbClick++; bouleRestante--; etat(); }		//au premier click choix de la case vide
	else {
		if(testCouleur(id,COULEUR_SELECTION,"pere")) { gId(sauvegardeSelection).style.backgroundColor = COULEUR_CASE;
			tabRouge.forEach(caseRouge => {if(caseRouge != 0) {gId(caseRouge).style.backgroundColor = COULEUR_CASE; }})		//remise des cases rouges en blanc 
		} else if(testCouleur(id,COULEUR_BOULE,"fils")) {
			selection(id);
			nbClick++;
			etat();
		} else if(testCouleur(id,COULEUR_CHOIX,"pere"))	{
			deplacement(id);
			etat();
		}
	}
}
function deplacement(id) {
	let soustraction = 0;
	switch(id.id) {								//regarde quelle case à été sautée
		case String(Number(sauvegardeSelection) - 18):
			soustraction = -9;
			break;
		case String(Number(sauvegardeSelection) + 18):
			soustraction = 9;
			break;
		case String(Number(sauvegardeSelection) - 2):
			soustraction = -1;
			break;
		case String(Number(sauvegardeSelection) + 2):
			soustraction = 1;
			break;
		default:
			console.log("erreur au niveau de la case sautée");
	}
	bouleRestante--;
	gId(sauvegardeSelection).style.backgroundColor = COULEUR_CASE;		//remet la case sélectionnée en couleur de base
	gId(sauvegardeSelection).firstElementChild.style.backgroundColor = COULEUR_VIDE;		//supprime la boule
	gId(String(Number(sauvegardeSelection) + soustraction)).firstElementChild.style.backgroundColor = COULEUR_VIDE;		//supprime la boule sautée
	id.firstElementChild.style.backgroundColor = COULEUR_BOULE;
	tabRouge.forEach(caseRouge => {if(caseRouge != 0) {gId(caseRouge).style.backgroundColor = COULEUR_CASE; }})		//remise des cases rouges en blanc
	sauvegardeMouvements.push(id.id);
	selection(id);
}
function selection(id) {
	tabRouge.forEach(caseRouge => {if(caseRouge != 0) {gId(caseRouge).style.backgroundColor = COULEUR_CASE; }})		//remise des cases rouges en blanc
	gId(sauvegardeSelection).style.backgroundColor = COULEUR_CASE;
	let idCaseTestee = 0;
	let idCaseSautee = 0;
	sauvegardeSelection = id.id;
	id.style.backgroundColor = COULEUR_SELECTION;
	possibilite(id,0,-18,-9);
	possibilite(id,1,18,9);
	possibilite(id,2,-2,-1);
	possibilite(id,3,2,1);
	sauvegardeMouvements.push(id.id);
}
function possibilite(id,positionTab,pos2emeCase,pos1ereCase) {		//vérifie lees différentes possibilité de déplacement
	if(autorisations[String(id.id)][positionTab]) {
		idCaseTestee = String(Number(id.id)+pos2emeCase);
		idCaseSautee = String(Number(id.id)+pos1ereCase);		//case à coté de la selection
		if(gId(idCaseTestee).firstElementChild.style.backgroundColor === COULEUR_VIDE && gId(idCaseSautee).firstElementChild.style.backgroundColor === COULEUR_BOULE)	{
			gId(idCaseTestee).style.backgroundColor = COULEUR_CHOIX;
			tabRouge[positionTab] = idCaseTestee;
		}
	}
}
function etat() {
	gId("etatBoulesRestantes").innerHTML = bouleRestante; gId("etatNbCliques").innerHTML = nbClick;
}
function creationAutorisation() {			//crée l'objet des autorisation de déplacement
	tabBoule.forEach(id => {
		if( id >= 22 && id <= 24 || id >= 30 && id <= 34 || id >= 39 && id <= 43 || id >= 48 && id <= 52 || id >= 58 && id <= 60) {
			autorisations[id] = [1,1,1,1];  //ordre : HBGD (Haut Bas Gauche Droite)  ==> 1 le déplacement est autorisé, 0 il ne l'est pas
			}
		else if(id == 44) {
			autorisations[id] = [1,1,1,0];
			}
		else if(id == 68) {
			autorisations[id] = [1,0,1,1];
		}
		else if(id == 14) {
			autorisations[id] = [0,1,1,1];
		}
		else if(id == 38) {
			autorisations[id] = [1,1,0,1];
		}
		else if(id == 4 || id == 12 || id == 13 || id == 20 || id == 21 || id == 28 || id == 29) {
			autorisations[id] = [0,1,0,1];
		}
		else if(id == 46 || id == 47 || id == 56 || id == 57 || id == 66 || id == 67 || id == 76) {
			autorisations[id] = [1,0,0,1];
		}
		else if(id == 78 || id == 69 || id == 70 || id == 61 || id == 62 || id == 53 || id == 54) {
			autorisations[id] = [1,0,1,0];
		}
		else if(id == 6 || id == 15 || id == 16 || id == 25 || id == 26 || id == 35 || id == 36) {
			autorisations[id] = [0,1,1,0];
		}
		else if(id == 5) {
			autorisations[id] = [0,1,0,0];
		}
		else if(id == 37) {
			autorisations[id] = [0,0,0,1];
		}
		else if(id == 45) {
			autorisations[id] = [0,0,1,0];
		}
		else if(id == 77) {
			autorisations[id] = [1,0,0,0];
		}
		else {
			console.log("erreur au niveau de la création des autorisations");
		}
	});
}

function gId(id){				// retourne l'élément qui a l'id mis en paramètre
    return document.getElementById(id);
}
function testCouleur(id,couleur,parent) {		//test si la couleur du fils de l'élément mis en paramètre correspond à la couleur mise en paramètre
	if(parent === "fils") {
		if(id.firstElementChild.style.backgroundColor === couleur)	{ return true; }
	} else if(parent === "pere") {
		if(gId(id.id).style.backgroundColor === couleur) { return true; }
	}
	return false;
}

// LES CURSEURS
function initCurseurs() {
	let tabCurseurs = ["default","none","help","pointer","wait","progress","cell","crosshair","text","vertical-text","move","not-allowed","zoom-in","zoom-out"];
	let ligne = "";
	for(let i in tabCurseurs) {
		ligne += "<button class='curseur' onclick='chgmtCurseur(\"" + tabCurseurs[i] + "\")'>" + tabCurseurs[i] + "</button>";
	}
	gId("body").innerHTML = "<h1>Choisis le curseur qui te correspond !</h1><div id='curseurs'>" + ligne + "<button class='curseur' onclick='chgmtCurseur(\"URL(img/OrangeCremeCursor.cur)\")'>Orange</button></div><button onclick='initPage()'>Menu</button>";
}
function chgmtCurseur(curseur) {
	gId("body").style.cursor = curseur;
}