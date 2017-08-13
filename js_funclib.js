/****************************Javascript_function_library********************************/


function ajaxTrans(transMeasure , order){
	var message = new XMLHttpRequest();

	if(message == null)
	{
		alert("http request failed!");
		return;
	}
	message.onreadystatechange=function()
  	{
  		if (message.readyState==4 && message.status==200)
    	{
    		var res = message.responseText;
    		processAjaxResult(res);
    	}
  	}

  	message.open(transMeasure , order , true);
  	message.send();
}



/*************Symbol List Object test ver*************/


function slNode(key,value){
	this.key = key;
	this.value = value;
}


slNode.prototype.changeKeyByFunction = function(){

	this.key = this.value;
};

function SL(length){
	this.length = arguments[0]?length:0;
	this.list = new Array(this.length);
	
}

SL.prototype.showList = function(){
	for(var index=0 ; index<this.list.length ; index++)
	{
		console.log(this.list[index].value);
	}
};

SL.prototype.ascend = function(a,b){
	if(typeof a != "object" || typeof b != "object")
	{
		console.log("error type of sort");
		return;
	}
	if(a.key > b.key)	res = 1;
	else if(a.key < b.key)	res = -1;
	else	res = 0;
	return res;
};

SL.prototype.descend = function(a,b){
	if(typeof a != "object" || typeof b != "object")
	{
		console.log("error type of sort");
		return;
	}
	var res;
	if(a.key < b.key)	res = 1;
	else if(a.key > b.key)	res = -1;
	else	res = 0;
	return res;
};



SL.prototype.push = function(key,value){
	var addedNode = new slNode(key,value);
	this.list.push(addedNode);
	this.length++;
};

SL.prototype.pop = function(){
	this.list.pop();
	this.length--;
};



/*Compiler*/

var src;
var currentToken = "";
var pointer = 0;
var line = 1;

var stack = new Array();

var ReservedWord = {
	auto: 			"auto",
	double: 		"double",
	int: 			"int",
	struct: 		"struct",
	break: 			"break",
	else: 			"else",
	long: 			"long",
	switch: 		"switch",
　　case: 			"case",
	enum: 			"enum",
	register: 		"register",
	typedef: 		"typedef",
	char: 			"char",
	extern: 		"extern",
	return: 		"return",
	union: 			"union",
　　const: 			"const",
	float: 			"float",
	short: 			"short",
	unsigned: 		"unsigned",
	continue: 		"continue",
	for: 			"for",
	signed: 		"signed",
	void: 			"void",
　　default: 		"default",
	goto: 			"goto",
	sizeof: 		"sizeof",
	volatile: 		"volatile",
	do: 			"do",
	if: 			"if",
	while: 			"while",
	static: 		"static"
};

var Type = {
	char: 			"char",
	short: 			"short",
	long: 			"long",
	int: 			"int",
	float: 			"float",
	double: 		"double",
	array: 			"array",
	struct: 		"struct",
	union: 			"union",
	class: 			"class",
	enum: 			"enum",
	void: 			"void",
	pointer: 		"pointer"
};

function Variable(token){
	this.token = token;
	this.type = null;
	this.class = null;
	this.value = null;

	this.localType = null;
	this.localClass = null;
	this.localValue = null;
}

function Counter(){
	this.variable = 0;
	this.reservedWord = 0;
}


var variableSet = new SL();
var reservedWordSet = new SL();

function lex/*a single lexer*/(){
	var currentCharacter;
	var counter = new Counter();

	while( src[pointer] )
	{
		currentCharacter = src[pointer++];
		if( currentCharacter == "\n" )
			line++;
		//we don't process preprocess operations right now
		else if( currentCharacter == "#" )
		{
			currentCharacter = src[pointer++];
			while( currentCharacter != "\n" )
			{
				currentCharacter = src[pointer++];
			}
		}
		//to find variable or reserved word and classify
		else if( currentCharacter >= "a" && currentCharacter <= "z" ||
				 currentCharacter >= "A" && currentCharacter <= "Z" ||
				 currentCharacter >= "0" && currentCharacter <= "9" || currentCharacter == "_")
		{
			currentToken = "";
			//currentToken = currentCharacter;
			while( currentCharacter >= "a" && currentCharacter <= "z" ||
				   currentCharacter >= "A" && currentCharacter <= "Z" ||
				   currentCharacter >= "0" && currentCharacter <= "9" || currentCharacter == "_")
			{
				currentToken += currentCharacter;
				currentCharacter = src[pointer++];
			}

			if( isReservedWord(currentToken.trim()) )
			{
				counter.reservedWord++;
				reservedWordSet.push( counter.reservedWord , currentToken );
			}
			else
			{
				counter.variable++;
				var addedVariable = new Variable(currentToken);
				variableSet.push( currentToken[0] , addedVariable );
			}
			//console.log(currentToken);
			
		}
		//variableSet.showList();





	}
}

function isReservedWord(testWord){
	return ReservedWord[testWord] == testWord;
}


















