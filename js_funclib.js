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
	console.log("list.length: "+this.length+"\n");

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



/*******************Compiler********************/

var src;
var pointer = 0;
var line = 1;

function setStartLine(startLine){
	line = startLine;
}

var stack = new Array();

var Token = {
	current: 	"",
	prior: 		"",
	next: 		""
};

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
	static: 		"static",
	var: 			"var",
	class: 			"class"
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
	pointer: 		"pointer",
	class: 			"class"
};

var symbolSet = ["," , "+" , "-" , "*" , "/" , "%" , "&" , "|" , "^" , "!" ,
			  "@" , "#" , "~" , "<" , ">" , "?" , ";" , ":" , "\'" , "\"" ,
			  "=" , "{" , "}" , "[" , "]" , "\\" , "."					];

function Variable(token){
	this.token = token;
	this.type = null;
	this.class = null;
	this.value = null;
	this.line = null;

	this.localType = null;
	this.localClass = null;
	this.localValue = null;
}

Variable.prototype.findType = function(priorToken){
	if( isType(priorToken) )
	{
		this.type = priorToken;
	}
	
};


function Counter(){
	this.variable = 0;
	this.reservedWord = 0;
}


var variableSet = new SL();
var reservedWordSet = new SL();
var foundSet = {};
var foundSymbolSet = [];

function lex/*a single lexer*/(){
	var currentCharacter;
	var repeatFlag = 0;
	var counter = new Counter();
	setStartLine(1);

	while( src[pointer] )
	{
		currentCharacter = src[pointer++];
		if( currentCharacter == "\n" )
			line++;

		else if( currentCharacter == "#" || ( currentCharacter == "/" && src[pointer] == "/" ) )
		{//we don't process preprocess operations right now
			skipLine(currentCharacter);
		}

		else if( isIdentityCharacter(currentCharacter) )//to find variable or reserved word and classify
		{
			getToken( currentCharacter , isIdentityCharacter );

			if( isFound(Token.current) )	repeatFlag = 1;//to make sure current token is not repeated
			else{
					foundSet[Token.current] = Token.current;
					repeatFlag = 0;
			}

			if(!repeatFlag)//if current token is not repeated
			{
				if( isReservedWord(Token.current.trim()) )
				{
					counter.reservedWord++;
					reservedWordSet.push( counter.reservedWord , Token.current );
				}
				else/*is variable*/{
					counter.variable++;
					var addedVariable = new Variable(Token.current);
					addedVariable.line = line;
					addedVariable.findType(Token.prior);
					variableSet.push( Token.current[0] , addedVariable );
				}
			}

						
		}//to find variable or reserved word and classify

		else if( isSymbol(currentCharacter) ) //to find symbol
		{
			getToken( currentCharacter , isSymbol );

			if( isFound(Token.current) )	repeatFlag = 1;//to make sure current token is not repeated
			else{
					foundSet[Token.current] = Token.current;
					repeatFlag = 0;
			}
			if(!repeatFlag)
				foundSymbolSet.push(Token.current);
		}

	Token.prior = Token.current;
	}
}


function isIdentityCharacter(testWord){
	return (testWord >= "a" && testWord <= "z" ||
			testWord >= "A" && testWord <= "Z" ||
			testWord >= "0" && testWord <= "9" || testWord == "_")
}

function isSymbol(testSymbol){
	var flag = 0;
	for(var index in symbolSet)
	{
		if(symbolSet[index] == testSymbol)	flag = 1;
	}
	return flag;
}




function isReservedWord(testWord){
	return ReservedWord[testWord] == testWord;
}

function isType(testWord){
	return Type[testWord] == testWord;
}

function isFound(testWord){
	return foundSet[testWord] == testWord;
}




function skipLine(currentCharacter){
	currentCharacter = src[pointer++];
	while( currentCharacter != "\n" )
	{
		currentCharacter = src[pointer++];
	}
	line++;
}


function getToken( currentCharacter , isTarget ){
	Token.current = "";
			
	while( isTarget(currentCharacter) )
	{
		Token.current += currentCharacter;
		currentCharacter = src[pointer++];
	}
	pointer--;
}








function setTextareaLinenumber(textarea_id){
	var target = document.getElementById(textarea_id);
	var target_value = target.value;
	document.getElementById(textarea_id).value = "";
	var pointer = 0 , output = "1. " , line = 1 , currentCharacter = "";
	while( target_value[pointer] )
	{
		currentCharacter = target_value[pointer++]
		if( currentCharacter == "\n" )
		{
			output += "\n" + 
					  ++line + ". ";
		}
		else{
			output += currentCharacter;
		}
	}
	target.value = output;
}





