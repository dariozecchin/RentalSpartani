
DROP DATABASE NOLODB;
CREATE DATABASE NOLODB;



USE NOLODB;
SET SQL_SAFE_UPDATES = 0;
#############################################################################################################################
######################################CREAZIONE TABLE############################################################
#############################################################################################################################
#utente
CREATE TABLE UTENTE (
  Username VARCHAR(20) PRIMARY KEY,
  Nome VARCHAR(30),
  Password VARCHAR(20),
  Città VARCHAR(30),
  Tipo ENUM('Admin', 'Customer'),
  NrPrenotazioni INT,
  StatoAccount ENUM('Attivo', 'Non attivo')
) ENGINE = InnoDB;

#guerriero
CREATE TABLE GUERRIERO (
  Nome VARCHAR(30) PRIMARY KEY,
  AnnoNascita INT,
  Altezza INT,
  Peso INT,
  Stato ENUM('Ottimo', 'Infortunato', 'Menomato', 'Deceduto', 'Non disponibile'),
  NrBattaglie INT DEFAULT 0,
  Abilità ENUM('Grosso', 'Distanza', 'Lancia', 'Corpo a corpo'),
  Descrizione VARCHAR(300),
  Foto VARCHAR(50), 
  Prezzo INT,
  MediaRecensione DECIMAL(5,1)
  ) ENGINE = InnoDB;

#prenotazione
#DROP TABLE PRENOTAZIONE;
CREATE TABLE PRENOTAZIONE (
  Codice INT AUTO_INCREMENT PRIMARY KEY,
  NomeGuerriero VARCHAR(30),
  DataInizio DATE,
  DataFine DATE,
  DataRestituzione DATE,
  Assicurazione BOOLEAN,
  Prezzo INT,
  UsernameUtente VARCHAR(30),
  FOREIGN KEY(NomeGuerriero) REFERENCES GUERRIERO(Nome),
  FOREIGN KEY(UsernameUtente) REFERENCES UTENTE(Username)
) ENGINE = InnoDB;

  #recensione
CREATE TABLE RECENSIONE (
  Codice INT AUTO_INCREMENT PRIMARY KEY,
  Utente VARCHAR(30),
  Stelle INT,
  DataR VARCHAR(15),
  NomeGuerriero VARCHAR(30),
  Titolo VARCHAR(30),
  Testo VARCHAR(150),
  FOREIGN KEY(NomeGuerriero) REFERENCES GUERRIERO(Nome),
  FOREIGN KEY(Utente) REFERENCES UTENTE(Username)
) ENGINE = InnoDB;


CREATE TABLE FATTURA (
	Codice INT AUTO_INCREMENT PRIMARY KEY,
    UsernameUtente VARCHAR(30),
    Base INT,
    Sconto INT DEFAULT 0,
    Penale INT DEFAULT 0,
    Totale INT DEFAULT 0,
    Assicurazione BOOLEAN,
    DataEmissione DATE DEFAULT NULL,
    CodicePrenotazione INT,
    FOREIGN KEY(CodicePrenotazione) REFERENCES PRENOTAZIONE(Codice) ON DELETE CASCADE,
    FOREIGN KEY(UsernameUtente) REFERENCES UTENTE(Username)
) ENGINE = InnoDB;

#############################################################################################################################
######################################CREAZIONE PROCEDURE############################################################
#############################################################################################################################

#PROCEDURE PER PRENOTARE
#DROP PROCEDURE PrenotaGuerriero;
DELIMITER //
CREATE PROCEDURE PrenotaGuerriero(IN NomeG VARCHAR(30), IN DataI DATE, IN DataF DATE, IN Insurance BOOLEAN, IN UserN VARCHAR(30), IN Pren BOOLEAN)
BEGIN
	DECLARE X INT;
    DECLARE C INT;
    DECLARE J INT;
    DECLARE M INT;
	DECLARE Z INT;
    DECLARE DataR DATE;
    DECLARE Price INT;
	SET Price = (SELECT Prezzo FROM GUERRIERO WHERE NomeG = Nome);
    SET X =  (SELECT DATEDIFF(DataF, DataI));
    SET C = (Price * X);
    IF (Insurance IS TRUE) THEN
		SET C = (C + ((C*10)/100));
    END IF;
    SET J = 0;
    SET M = C;
    SET DataR = NULL;
    IF Pren IS TRUE THEN
		SET J = ((C*10)/100);
		SET	C = (C- J);
	END IF;
    INSERT INTO PRENOTAZIONE(NomeGuerriero, DataInizio, DataFine, DataRestituzione, Assicurazione, Prezzo, UsernameUtente) VALUES(NomeG, DataI, DataF, DataR, Insurance, C, UserN);
    SET Z = (SELECT Codice FROM PRENOTAZIONE WHERE NomeGuerriero=NomeG AND DataInizio=DataI AND DataFine=DataF);
    INSERT INTO FATTURA(UsernameUtente, Base, Sconto, Assicurazione, CodicePrenotazione) VALUES(UserN, M, J, Insurance, Z);
END //
DELIMITER ;


#controllo se le date vanno bene 
DELIMITER //
CREATE PROCEDURE OrdinaDate(IN NomeG VARCHAR(30))
BEGIN
	DECLARE X INT;
    DECLARE Y INT;
    DECLARE B BOOLEAN;
    SET X = (SELECT Codice FROM PRENOTAZIONE WHERE NomeGuerriero=NomeG AND DataI>DataInizio AND DataI<DataFine);
	SET Y = (SELECT Codice FROM PRENOTAZIONE WHERE NomeGuerriero=NomeG AND DataF>DataInizio AND DataF<DataFine);
    IF (X IS NULL) AND (Y IS NULL) THEN
		SET B = 1;
	ELSE 
		SET B = 0;
    END IF;
    SELECT B;
END //
DELIMITER ;

#metto le penali per gli infortuni
DELIMITER //
CREATE PROCEDURE PenaliInfortuni(IN Succ VARCHAR(30), IN C INT)
BEGIN
	DECLARE N VARCHAR(30);
    DECLARE P INT;
    DECLARE Prec VARCHAR(30);
    SET N = (SELECT NomeGuerriero FROM PRENOTAZIONE WHERE Codice=C);
    SET Prec = (SELECT Stato FROM GUERRIERO WHERE Nome=N);
    SET P = (SELECT Prezzo FROM GUERRIERO WHERE Nome=N);
    IF Succ='Deceduto' AND Prec="Menomato" THEN
		UPDATE FATTURA SET Penale= Penale+(P*15) WHERE CodicePrenotazione=C;
	ELSEIF Prec<>'Menomato' AND Succ='Deceduto' THEN 
		UPDATE FATTURA SET Penale= Penale+(P*30) WHERE CodicePrenotazione=C;
        
	ELSEIF Prec='Ottimo' AND Succ='Infortunato' THEN 
		UPDATE FATTURA SET Penale= Penale+(P*5) WHERE CodicePrenotazione=C;
	ELSEIF Prec='Ottimo' AND Succ='Menomato' THEN 
		UPDATE FATTURA SET Penale= Penale+(P*10) WHERE CodicePrenotazione=C;
        
	ELSEIF Prec='Infortunato' AND Succ='Menomato' THEN 
		UPDATE FATTURA SET Penale= Penale+(P*5) WHERE CodicePrenotazione=C;
	ELSEIF Prec='Infortunato' AND Succ='Ottimo' THEN 
		UPDATE FATTURA SET Penale= Penale-(P*5) WHERE CodicePrenotazione=C;	
	END IF;
	UPDATE GUERRIERO SET Stato= Succ WHERE Nome= N;
END //
DELIMITER ;


#procedure che mette la data di restituzione
DELIMITER //
CREATE PROCEDURE FinePrestito(IN C INT)
BEGIN
	DECLARE DF DATE;
    DECLARE X INT;
    DECLARE G INT;
    DECLARE F INT;
    DECLARE J INT;
    DECLARE P INT;
    SET F = 0;
    SET DF = (SELECT DataFine FROM PRENOTAZIONE WHERE Codice=C);
    SET G = (SELECT Prezzo FROM GUERRIERO WHERE Nome IN (SELECT NomeGuerriero FROM PRENOTAZIONE WHERE Codice=C));
    SET X = (SELECT DATEDIFF(CURDATE(), DF));
    SET J = (G*30)/100;
    IF X > 0 THEN
		SET F = X * J;
    END IF;
	UPDATE PRENOTAZIONE SET DataRestituzione=CURDATE(), Prezzo=(Prezzo+F) WHERE Codice = C;
    UPDATE FATTURA SET DataEmissione=CURDATE(), Penale=Penale+F, Totale=Base-Sconto+Penale WHERE CodicePrenotazione=C;
END //
DELIMITER ;

#############################################################################################################################
######################################CREAZIONE TRIGGER############################################################
#############################################################################################################################

DELIMITER //
CREATE TRIGGER MediaRecensioniGuerriero
AFTER INSERT ON RECENSIONE
FOR EACH ROW
BEGIN
	DECLARE X DECIMAL(5,1);
    
	SET X = (SELECT AVG(Stelle) FROM RECENSIONE WHERE NomeGuerriero=NEW.NomeGuerriero);
	IF X<=1.25 THEN
		SET X = 1;
	ELSEIF X>1.25 AND X<=1.75 THEN 
		SET X = 1.5;
	ELSEIF X>1.75 AND X<=2.25 THEN 
		SET X = 2;
	ELSEIF X>2.25 AND X<=2.75 THEN
		SET X = 2.5;
	ELSEIF X>2.75 AND X<=3.25 THEN
		SET X = 3;
	ELSEIF X>3.25 AND X<=3.75 THEN
		SET X = 3.5;
	ELSEIF X>3.75 AND X<=4.25 THEN
		SET X = 4;
	ELSEIF X>4.25 AND X<=4.75 THEN 
		SET X = 4.5;
	ELSE 
		SET X = 5;
	END IF;
	UPDATE GUERRIERO SET MediaRecensione=X WHERE NEW.NomeGuerriero=GUERRIERO.Nome;

END //

DELIMITER //
CREATE TRIGGER AumentoNrPrenotazioni
AFTER INSERT ON PRENOTAZIONE
FOR EACH ROW
BEGIN
UPDATE UTENTE SET UTENTE.NrPrenotazioni=UTENTE.NrPrenotazioni+1 WHERE NEW.UsernameUtente=UTENTE.Username;
END //


DELIMITER //
CREATE TRIGGER AumentoNrBattaglie
AFTER INSERT ON PRENOTAZIONE
FOR EACH ROW
BEGIN
UPDATE GUERRIERO SET GUERRIERO.NrBattaglie=GUERRIERO.NrBattaglie+1 /*AND GUERRIERO.Prezzo=GUERRIERO.Prezzo+(Prezzo*0.05)*/ WHERE NEW.NomeGuerriero=GUERRIERO.Nome;
UPDATE GUERRIERO SET GUERRIERO.Prezzo=GUERRIERO.Prezzo+(Prezzo*0.05) WHERE NEW.NomeGuerriero=GUERRIERO.Nome;

END //


#trigger prezzo
DELIMITER //
CREATE TRIGGER GestionePrezzo
BEFORE UPDATE ON GUERRIERO
FOR EACH ROW
BEGIN
	#se diventa morto prezzo = NULL		
    IF NEW.Stato='Deceduto' AND OLD.Stato<>'Deceduto' THEN
		SET NEW.Prezzo = NULL;
	#se diventa infortunato prezzo = -10%
	ELSEIF NEW.Stato='Infortunato' AND OLD.Stato<>'Infortunato' THEN 
		SET NEW.Prezzo = OLD.Prezzo-(OLD.Prezzo*0.1);
	#se diventa menomato prezzo = -25%
    ELSEIF NEW.Stato='Menomato' AND OLD.Stato<>'Menomato' THEN 
		SET NEW.Prezzo = OLD.Prezzo-(OLD.Prezzo*0.25);
	#se diventa ottimo prezzo = + 10%
    ELSEIF NEW.Stato='Ottimo'AND OLD.Stato<>'Ottimo' THEN
		SET NEW.Prezzo = OLD.Prezzo+(OLD.Prezzo*0.10);
	END IF;
END //

#trigger quando guerriero muore annullate le prenotazioni 
CREATE TRIGGER PrenotazioniDecesso
AFTER UPDATE ON GUERRIERO
FOR EACH ROW
BEGIN
	IF NEW.Stato = 'Deceduto' THEN
		DELETE FROM PRENOTAZIONE WHERE NomeGuerriero=NEW.Nome AND DataInizio>=CURDATE();
	END IF;
END //

#trigger prezzo 
DELIMITER //
CREATE TRIGGER PrezzoEstensione
BEFORE UPDATE ON PRENOTAZIONE
FOR EACH ROW
BEGIN
	DECLARE X INT;
    DECLARE N INT;
    SET X = (DATEDIFF(NEW.DataFine, OLD.DataFine));
    SET N = (SELECT Prezzo FROM GUERRIERO WHERE Nome = NEW.NomeGuerriero);
    SET NEW.Prezzo = OLD.Prezzo + (X*N); 
END //




#############################################################################################################################
######################################POPOLAMENTO DB############################################################
#############################################################################################################################

#INSERT
INSERT INTO UTENTE VALUES('Pericle1', 'Pericle', 'Pericle1', 'Atene', 'Customer', 0, "Attivo");
INSERT INTO UTENTE VALUES('Ciro1', 'Ciro I di Persia', 'Ciro1', 'Persepoli', 'Customer', 10, "Attivo");
INSERT INTO UTENTE VALUES('Tarquinio1', 'Tarquinio il Superbo', 'Tarquinio1', 'Roma', 'Customer', 0, "Attivo");
INSERT INTO UTENTE VALUES('GialloGiovanni', 'Giallo Giovanni', 'giallo1', 'Napoli', 'Customer', 0, "Attivo");
INSERT INTO UTENTE VALUES('luca1', 'Luca Linari', 'luca1', 'Ozzano', 'Admin', 0, "Attivo");
INSERT INTO UTENTE VALUES('dario1', 'Dario Zecchin', 'dario1', 'Bologna', 'Admin', 0, "Attivo");
INSERT INTO UTENTE VALUES('ale1', 'Alessandro Rossi', 'ale1', 'Verona', 'Admin', 0, "Attivo");


INSERT INTO GUERRIERO VALUES('Abidos', '500', '175', '80', 'Ottimo', 0, 'Grosso', 'Abidos è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Arethas', '502', '178', '78', 'Infortunato', 0, 'Corpo a corpo', 'Arethas è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Christodoulos', '503', '170', '70', 'Ottimo', 0, 'Distanza', 'Christodoulos è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Diomedes', '505', '176', '75', 'Ottimo', 0, 'Lancia', 'Diomedes è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Eustachius', '515', '176', '83', 'Ottimo', 0, 'Grosso', 'Eustachius è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Georgos', '504', '177', '80', 'Ottimo', 0, 'Corpo a corpo', 'Georgos è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Oikoumenios', '510', '185', '95', 'Ottimo', 0, 'Grosso', 'Oikoumenios è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Panagiotis', '504', '182', '90', 'Ottimo', 0, 'Grosso', 'Panagiotis è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Papios', '502', '173', '75', 'Infortunato', 0, 'Lancia', 'Papios è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Petro', '508', '170', '70', 'Ottimo', 0, 'Lancia', 'Petro è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Spyridon', '503', '176', '75', 'Menomato', 0, 'Distanza', 'Spyridon è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Zotikos', '506', '178', '80', 'Ottimo', 0, 'Lancia', 'Zotikos è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Thallelaios', '504', '179', '82', 'Infortunato', 0, 'Grosso', 'Thallelaios è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Themistocles', '504', '179', '77', 'Infortunato', 0, 'Corpo a corpo', 'Themistocles è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);
INSERT INTO GUERRIERO VALUES('Stafanas', '504', '177', '70', 'Menomato', 0, 'Distanza', 'Stafanas è un guerriero valoroso che non ha paura di nulla', 'guerriero.jpg', 100, 0);


#passate
CALL PrenotaGuerriero("Petro", "2021-01-01", "2021-01-20", 1, "Ciro1", 0);
CALL FinePrestito(1);
CALL PrenotaGuerriero("Stafanas", "2021-01-01", "2021-01-20", 0, "Ciro1", 0);
CALL FinePrestito(2);
CALL PrenotaGuerriero("Georgos", "2021-01-01", "2021-01-20", 1, "Ciro1", 0);
CALL FinePrestito(3);
CALL PrenotaGuerriero("Abidos", "2021-01-15", "2021-01-18", 0, "Ciro1", 0);
CALL FinePrestito(4);
CALL PrenotaGuerriero("Stafanas", "2021-04-21", "2021-04-20", 1, "Ciro1", 0);
CALL FinePrestito(5);
CALL PrenotaGuerriero("Petro", "2021-04-01", "2021-04-20", 0, "Ciro1", 0);
CALL FinePrestito(6);
CALL PrenotaGuerriero("Georgos", "2021-04-01", "2021-04-20", 1, "Ciro1", 0);
CALL FinePrestito(7);
CALL PrenotaGuerriero("Stafanas", "2021-05-01", "2021-05-20", 1, "Ciro1", 0);
CALL FinePrestito(8);
CALL PrenotaGuerriero("Abidos", "2021-05-01", "2021-05-20", 0, "Ciro1", 0);
CALL FinePrestito(9);
CALL PrenotaGuerriero("Georgos", "2021-05-01", "2021-05-20", 1, "Ciro1", 0);
CALL FinePrestito(10);
CALL PrenotaGuerriero("Stafanas", "2021-06-01", "2021-06-20", 1, "Ciro1", 1);
CALL FinePrestito(11);
CALL PrenotaGuerriero("Panagiotis", "2021-06-01", "2021-06-20", 1, "Ciro1", 0);
CALL FinePrestito(12);

#attive
CALL PrenotaGuerriero("Petro", "2021-07-01", "2021-06-30", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Themistocles", "2021-07-01", "2021-07-25", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Stafanas", "2021-07-01", "2021-07-25", 0, "Ciro1", 0);
CALL PrenotaGuerriero("Abidos", "2021-07-01", "2021-07-25", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Georgos", "2021-07-01", "2021-07-25", 0, "Ciro1", 0);
CALL PrenotaGuerriero("Papios", "2021-07-01", "2021-07-25", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Oikoumenios", "2021-07-01", "2021-07-25", 0, "Ciro1", 0);


#futuro
CALL PrenotaGuerriero("Petro", "2021-08-01", "2021-08-20", 0, "Ciro1", 0);
CALL PrenotaGuerriero("Stafanas", "2021-08-01", "2021-08-20", 0, "Ciro1", 1);
CALL PrenotaGuerriero("Abidos", "2021-08-01", "2021-08-20", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Georgos", "2021-08-01", "2021-08-20", 0, "Ciro1", 0);
CALL PrenotaGuerriero("Themistocles", "2021-08-01", "2021-08-20", 1, "Ciro1", 0);

CALL PrenotaGuerriero("Petro", "2021-09-01", "2021-09-20", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Stafanas", "2021-09-01", "2021-09-20", 0, "Ciro1", 0);
CALL PrenotaGuerriero("Abidos", "2021-09-01", "2021-09-20", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Themistocles", "2021-09-01", "2021-09-20", 1, "Ciro1", 0);
CALL PrenotaGuerriero("Georgos", "2021-09-01", "2021-09-20", 0, "Ciro1", 0);

CALL PrenotaGuerriero("Petro", "2021-10-01", "2021-10-20", 1, "Ciro1", 0);



#recensioni
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '491-06-10', 'Stafanas', 'Ottimo guerriero', 'Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 3, '492-08-12', 'Diomedes', 'Parzialmente soddisfatto', 'Diomedes è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '493-05-12', 'Themistocles', 'Sfortunati eventi', "Themistocles è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Eustachius', 'Troppo vecchio', "Eustachius è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 4, '491-06-10', 'Stafanas', 'Ottimo guerriero', 'Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Diomedes', 'Parzialmente soddisfatto', 'Diomedes è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 4, '493-05-12', 'Themistocles', 'Sfortunati eventi', "Themistocles è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Eustachius', 'Troppo vecchio', "Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 4, '491-06-10', 'Stafanas', 'Ottimo guerriero', 'Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Diomedes', 'Parzialmente soddisfatto', 'Diomedes è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '493-05-12', 'Themistocles', 'Sfortunati eventi', "Themistocles è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 5, '492-08-12', 'Eustachius', 'Troppo vecchio', "Eustachius è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '491-06-10', 'Stafanas', 'Ottimo guerriero', 'Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Diomedes', 'Parzialmente soddisfatto', 'Diomedes è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 3, '493-05-12', 'Themistocles', 'Sfortunati eventi', "Themistocles è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Eustachius', 'Troppo vecchio', "Eustachius è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 4, '491-06-10', 'Stafanas', 'Ottimo guerriero', 'Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '492-08-12', 'Diomedes', 'Parzialmente soddisfatto', 'Diomedes è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 5, '493-05-12', 'Themistocles', 'Sfortunati eventi', "Themistocles è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 3, '492-08-12', 'Eustachius', 'Troppo vecchio', "Eustachius è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '491-06-10', 'Stafanas', 'Ottimo guerriero', 'Stafanas è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 5, '492-08-12', 'Diomedes', 'Parzialmente soddisfatto', 'Diomedes è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '493-05-12', 'Themistocles', 'Sfortunati eventi', "Themistocles è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Eustachius', 'Troppo vecchio', "Eustachius è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Petro', 'Troppo vecchio', "Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 4, '491-06-10', 'Petro', 'Ottimo guerriero', 'Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '492-08-12', 'Petro', 'Parzialmente soddisfatto', 'Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 5, '493-05-12', 'Petro', 'Sfortunati eventi', "Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 3, '492-08-12', 'Petro', 'Troppo vecchio', "Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 4, '491-06-10', 'Petro', 'Ottimo guerriero', 'Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Ciro1', 5, '492-08-12', 'Petro', 'Parzialmente soddisfatto', 'Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate');
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 5, '493-05-12', 'Petro', 'Sfortunati eventi', "Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate");
INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES('Pericle1', 5, '492-08-12', 'Petro', 'Troppo vecchio', "Petro è un guerriero che non ha paura di niente e vale tutte le monete pagate");






