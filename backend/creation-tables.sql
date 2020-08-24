ALTER  TABLE noms (
      idNom INTEGER NOT NULL DEFAULT AUTOINCREMENT,
      nom VARCHAR(100) NULL,
      CONSTRAINT pk__noms PRIMARY KEY ( idNom )
    );

CREATE TABLE scores (
      idNom INTEGER NOT NULL DEFAULT AUTOINCREMENT,
      nbBoules INTEGER NOT NULL,
      svgMvt VARCHAR(100) NULL,
      nbCliques INTEGER NOT NULL,    
      dates date INT,
      CONSTRAINT fk_scores_noms FOREIGN KEY (idNom) REFERENCES jeu.noms(IdNom)
    );