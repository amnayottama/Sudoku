var sudokupapan;
var easy = 50;
var medium = 35;
var hard = 20;

//papan9x9
function papan() {
	sudokupapan = [	[5,2,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0]	];
	
	warnaangka();
}

//Memasukan array ke dalam tampilan menggunakan index id
//memberi warna pada angka soal merah dan jawaban biru
function warnaangka() {
	var i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j; 
			if (sudokupapan[i][j] != 0) {
				document.getElementById(indexId).innerHTML = sudokupapan[i][j];
				document.getElementById(indexId).setAttribute("class", "givenNumber");
			} else {
				document.getElementById(indexId).setAttribute("class", "solvingNumber");
			}
		}
	}
}

//pemilihan difficult
function mudah(){
    var difficult = easy;
    generatesudoku(difficult);
    hidenButton1(0);
    hidenButton2(0);
    hidenButton3(0);
    enableGenerateButton();
}
function sedang(){
    var difficult = medium;
    generatesudoku(difficult);
    hidenButton1(0);
    hidenButton2(0);
    hidenButton3(0);
    enableGenerateButton();
}
function susah(){
    var difficult = hard;
    generatesudoku(difficult);
    hidenButton1(0);
    hidenButton2(0);
    hidenButton3(0);
    enableGenerateButton();
}

//generator acak dan menghapus 
function generatesudoku(difficult){
	var i, j, ibaris, ikolom;
   
    disableButtons()

	//menghapus sudoku sebelumnya
	for (i = 0; i < 9; i++)
		for (j = 0; j < 9; j++)
			sudokupapan[i][j] = 0;
	hapuspapan();
	
    //random generator
    for (i = 0; i < difficult; i++) {
        do {
            angka = Math.floor((Math.random() * 9) + 1); //angka random yang dimasukan antara 1 - 9
            do {
				ibaris = Math.floor((Math.random() * 9)); //index random
				ikolom = Math.floor((Math.random() * 9)); 
			} while (!sudokupapan[ibaris][ikolom] == 0); //mencari cell bernilai 0
        } 
        while (!syarat(ibaris,ikolom,angka))//mengecheck dahulu sebelum angka dikeluarkan
        sudokupapan[ibaris][ikolom] = angka;
    

    }
	
    function syarat(ibaris,ikolom,angka) {
        var baris, kolom, subbaris, subkolom;
        
        // pengecheckan baris
        for (kolom = 0; kolom < 9; kolom++) {
            if (sudokupapan[ibaris][kolom] == angka) return false;
        }
        
        // pengecheckan kolom
        for (baris = 0; baris < 9; baris++) {
            if (sudokupapan[baris][ikolom] == angka) return false;
        }
        
        // pengecheckan sub-grid (3x3) 
        subbaris = ibaris - ibaris % 3;
        subkolom = ikolom - ikolom % 3;
         for (baris = 0; baris < 3; baris++)
            for (kolom = 0; kolom < 3; kolom++)
                if (sudokupapan[subbaris + baris][subkolom + kolom] == angka) return false;
        
        return true;
    }
	
	
	warnaangka();
}

//fungsi penghapus
function hapuspapan() {
	var i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j; 
			document.getElementById(indexId).innerHTML = "";
		}
	}
}
function test(){
    var  a;
    for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j; 
			var lolz = document.getElementById(indexId).innerHTML;
            if (lolz !== 0)
            return test;
            do {
                for (a = 1; a < 10; a++)
                document.getElementById(indexId).innerHTML = a;
            }while (lolz == 0)
            
    

		}
	}

}

function jalan(){
    drawGrid = [];
    if (solve()) {
		finish();
	}
}

function solve() {
    
    var posisiangkakosong, posisiangka, angkabaru, baris, kolom;
	
	posisiangkakosong = kotakkosong();
	if (posisiangkakosong == "") return true;
	
	baris = posisiangkakosong.charAt(0);
	kolom = posisiangkakosong.charAt(1);
	posisiangka = posisiangkakosong;
    
	
	for (angkabaru = 1; angkabaru <= 9; angkabaru++) {
		if (syarat(baris,kolom,angkabaru)) {
            sudokupapan.push(angkabaru);
			sudokupapan[baris][kolom] = angkabaru;
        }		
    }
}

function kotakkosong() {
	var i, j, position = "";
	for (i = 0; i < 9; i++)
		for (j = 0; j < 9; j++)
			if (sudokupapan[i][j] == 0) {
				position = i + "" + j;
				return position;
			}
	return position;
}

function finish() {
	var i, j, indexId;
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			indexId = i + "" + j;
			document.getElementById(indexId).innerHTML = sudokupapan[i][j];
		}
	}
}

//tampilan
function acak(){
    disableButtons();
    hidenButton1(1);
    hidenButton2(1);
    hidenButton3(1);
}

function hidenButton1(show) {
	if (show) document.getElementsByClassName("hideButton1")[0].hidden = false;
	else document.getElementsByClassName("hideButton1")[0].hidden = true;
}
function hidenButton2(show) {
	if (show) document.getElementsByClassName("hideButton2")[0].hidden = false;
	else document.getElementsByClassName("hideButton2")[0].hidden = true;
}
function hidenButton3(show) {
	if (show) document.getElementsByClassName("hideButton3")[0].hidden = false;
	else document.getElementsByClassName("hideButton3")[0].hidden = true;
}

function disableButtons() {
	disableGenerateButton();
	
}

function disableGenerateButton() {
	document.getElementsByClassName("generateButton")[0].disabled = true;
}

function enableButtons() {
	enableGenerateButton();
	
}

function enableGenerateButton() {
	document.getElementsByClassName("generateButton")[0].disabled = false;
}
