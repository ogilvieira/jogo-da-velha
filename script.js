"use strict";

function JogoDaVelha(el) {
	if(!el) return;
	this.$el = document.getElementById(el);
	this.$buttons = document.querySelectorAll("#"+el+" div button");
	this.$btnRestart = document.getElementById("btnReset");
	this.$header = document.getElementById("header");
	this.turn = 0; //0,1
	this.grid = [];
	this.mode = 'MACHINE'; //MACHINE, VERSUS
	this.isPlay = true;
	this.winner = null;


	let _self = this;
	let obj = {};

	obj.restartGame = function() {
		for( const $button of _self.$buttons) {
			$button.classList = "";
			$button.innerText = "";
		}

		_self.$el.classList = "";
		_self.winner = null;
		_self.isPlay = true;
		obj.setPlayer(_self.turn == 1 ? 0 : 1);
		if(_self.turn == 1){ obj.machinePlay(); }
	}

	obj.machinePlay = function() {
		let btns = Array.prototype.slice.call(_self.$buttons).filter((a) => {
			return !a.classList.contains('is-active');
		});

		if(!btns.length){ return; }

		let index = (Math.random() * (btns.length-1)).toFixed();

		setTimeout(() => {
			btns[Number(index)].click();
		}, 500);

	};

	this.areEqual = function(){
	   var len = arguments.length;
	   for (var i = 1; i< len; i++){
	      if (arguments[i] === null || arguments[i] !== arguments[i-1])
	         return false;
	   }
	   return true;			
	}

	obj.checkGame = function() {
		let matrix = obj.getMatrix();

		let res = {
			col_1 : (matrix[0].every(a => !!a && a == matrix[0][0] )),
			col_2 : (matrix[1].every(a => !!a && a == matrix[1][0] )),
			col_3 : (matrix[2].every(a => !!a && a == matrix[2][0] )),
			row_1 : _self.areEqual(matrix[0][0], matrix[1][0], matrix[2][0]),
			row_2 : _self.areEqual(matrix[0][1], matrix[1][1], matrix[2][1]),
			row_3 : _self.areEqual(matrix[0][2], matrix[1][2], matrix[2][2]),
			diagonal_1 : _self.areEqual(matrix[0][0], matrix[1][1], matrix[2][2]),
			diagonal_2 : _self.areEqual(matrix[0][2], matrix[1][1], matrix[2][0])
		}


		Object.keys(res).map(a => {
			if( res[a] ){
				_self.isPlay = false;
				_self.winner = _self.turn;
				_self.$el.classList = "is-locked winner winner-"+a;

			}
		});

	};


	obj.setPlayer = function(player) {
		if( _self.winner !== null ){ return; }
		_self.turn = player || _self.turn == 1 ? 0 : 1;
		_self.$header.innerText = "Player " + (_self.turn+1);

		if( _self.turn == 1 && _self.mode == 'MACHINE' ) { 
			_self.$el.classList = "is-locked";
			obj.machinePlay();
		}
	}

	obj.getMatrix = function(){
		let arr = [[],[],[]];

		Array.prototype.slice.call(_self.$buttons).map( (a,i) => {
			let row = 0;
			if(i > 2 && i < 6){ row = 1; }
			if(i > 5){ row = 2; }
			arr[row].push(a.innerText || null);
		});

		return arr;
	};

	obj.SetButton = function (e, player) {
		if(!!e.target.innerText || !_self.isPlay || _self.winner !== null) { return; }
		e.target.innerText = _self.turn == 1 ? "X" : "O";
		e.target.classList = "is-active";

		_self.$el.classList = "";

		obj.checkGame();
		obj.setPlayer();
	};


	obj.Attach = function() {
		for( const $button of _self.$buttons) {
			$button.addEventListener('click', (e) => obj.SetButton(e, 0));
		}

		_self.$btnRestart.addEventListener('click', (e) => obj.restartGame())
	};




	obj.Start = function(){
		obj.Attach();
	};

	return obj;
};


var jogoDaVelha = new JogoDaVelha('tabuleiro');


jogoDaVelha.Start();