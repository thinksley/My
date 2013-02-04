function getByClass(oPar,sClass)
{
  var alls=oPar.getElementsByTagName('*');
  var results=[];
  for(var i=0;i<alls.length;i++)
  {
    if(alls[i].className==sClass)
	  {
		 results.push(alls[i]);  
	  }  
  }
  return results;
}
function myAddEvent(obj,oEv,fn)
{
    if(obj.attachEvent)
  	{
	  obj.attachEvent('on'+oEv,function(){
		    if(false==fn.call(obj))
			{
			  event.concelBubble=true;
			  return false;
			}
		  });	
	}else
	{
	  obj.addEventListener(oEv,function(ev){
		    if(false==fn.call(obj))
			{
			  event.concelBubble=true;
			  ev.preventDefault();//moz webkit 下阻止事件绑定
			}
		  },false);	
	}
}

function getStyle(obj,attr)
{
   if(obj.currentStyle)
   {
	 return obj.currentStyle[attr];   
   }else
   {
     return getComputedStyle(obj,false)[attr];
   }
}

function VQuery(vArg)
{
	//保存选中元素
	this.elements=[];
    switch(typeof vArg)
	{
	  case 'function':
	        myAddEvent(window,'load',vArg);
			break;
	  case 'string':
	        switch(vArg.charAt(0))
			{
			   case '#':
			       var obj=document.getElementById(vArg.substring(1));                  this.elements.push(obj);
			       break;
			   case '.':
			       this.elements=getByClass(document,vArg.substring(1));
			       break;
			   default:
			      this.elements=document.getElementsByTagName(vArg);
			}
			break;
	  case 'object':
	      this.elements.push(vArg);
	}	
}
VQuery.prototype.click=function(fn)
{
  	for(var i=0;i<this.elements.length;i++)
	{
	  myAddEvent(this.elements[i],'click',fn);	
	}
	return this;
}
VQuery.prototype.show=function()
{
    for(var i=0;i<this.elements.length;i++)
	{
	  this.elements[i].style.display='block';	
	}
	return this;
}
VQuery.prototype.hide=function()
{
    for(var i=0;i<this.elements.length;i++)
	{
	  this.elements[i].style.display='none';	
	}
	return this;
}
VQuery.prototype.hover=function(fnOver,fnOut)
{
  	for(var i=0;i<this.elements.length;i++)
	{
	  myAddEvent(this.elements[i],'mouseover',fnOver);
	  myAddEvent(this.elements[i],'mouseout',fnOut);
	}
	return this;
}
VQuery.prototype.css=function(attr,value)
{
    if(arguments.length==2) //设置样式
	{
	   
	    for(var i=0;i<this.elements.length;i++)
		{
		  this.elements[i].style[attr]=value;
		}
	}else //获取样式
	{
	    if(typeof attr=='string')
		{
	       return getStyle(this.elements[0],attr);
		}else
		{
		  for(var i=0;i<this.elements.length;i++)
		  {
			 var k='';
			 for(k in attr)
			 {
			   this.elements[i].style[k]=attr[k];
			 }  
		  }
		}
	}
	return this;
}

VQuery.prototype.attr=function(attr,value)
{
    if(arguments.length==2) //设置
	{
	  for(var i=0;i<this.elements.length;i++)
	  {
	    this.elements[i][attr]=value;
	  }	
	}else
	{
	  return this.elements[0][attr];	
	}
	return this;
}

VQuery.prototype.toggle=function()
{
	var _arguments=arguments;
    for(var i=0;i<this.elements.length;i++)
	{
	    addToggle(this.elements[i]);
	}
	function addToggle(obj)
	{
	  var count=0;
	  myAddEvent(obj,'click',function(){
		    _arguments[count++%_arguments.length].call(obj);
		 });
	}
	return this;
}

VQuery.prototype.eq=function(n)
{
   return $(this.elements[n]);
}

VQuery.prototype.find=function(str)
{
   var aResult=[];
   for(var i=0;i<this.elements.length;i++)
	{
	    switch(str.charAt(0))
		{
		  case '.': //class
		      	var aEle=getByClass(this.elements[i],str.substring(1));
				aResult=aResult.concat(aEle);
		  default: //标签
		      var aEle=this.elements[i].getElementsByTagName(str);
			  aResult=aResult.concat(aEle);
		}
	}
	var newVQuery=$();
	newVQuery.elements=aResult;
	return newVQuery;
}

function getIndex(obj)
{
   var oBrother=obj.parentNode.children;
   for(var i=0;i<oBrother.length;i++)
   {
	  if(oBrother[i]==obj)
	  {
	     return i;
	  }  
   }	
}
VQuery.prototype.index=function()
{
   	return getIndex(this.elements[0]);
}

VQuery.prototype.bind=function(sEv,fn)
{
   for(var i=0;i<this.elements.length;i++)
   {
      myAddEvent(this.elements[i],sEv,fn);
   }
}
/*******************/
/*//插件写法
  $().extend('size',function(){ 
	  return this.elements.length;
	});
	直接在原型上添加了size方法
*/
/*******************/
VQuery.prototype.extend=function(name,fn) //插件机制
{
  VQuery.prototype[name]=fn;
}

function $(vArg)
{
  return new VQuery(vArg);
}
