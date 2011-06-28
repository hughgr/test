//usage: [json1, json2].log()
//usage: [{key1: 3, key2: 4, key3: 5}, {key1: 44, key2: 11, key3: 35}].log('key1', 'key2')
Array.prototype.log = function(){
    var keys = arguments,
        hasKey = arguments.length > 0;
    for(var i = 0, l = this.length; i < l; i++){
        var item = this[i];
        if(hasKey){
            var r = [];
            for(var j = 0, len = arguments.length; j < len; j++){
                r.push(item[arguments[j]]);
            }
            console.log.apply(console, r);
        }else{
            console.log(item);
        }
    }
    return this;
};


// Array ��concat �����2���е�string����һ����
//�����ڴ��и���һ������a��Ȼ�����concat���������ѽ����ֵ��a,����̫�����ڴ��ˣ�����Ҳͦ�
//������ ����д�� a = a.concat(b). 
//��д�˸�append����Ȼ�򵥣���ʵ�ã����صĻ������鱾�����ڿ�������д�ˣ�
// a.append(b).append(c).append(d)
if(typeof Array.prototype.append!=="function"){
    Array.prototype.append=function(A){
        Array.prototype.splice.apply(this,[this.length,0].concat(A));
        return this
    }
}else{
    throw new Error("native append has been added to the Array.prototype, you better check it out!!!")
}

//����ֲ�ִ��
Array.prototype.chunk = function(fn, n, t, stepCallback, scope){
    var i = 0,
        slice = null,
        self = this,
        len = this.length,
        step = function(){
            slice = self.slice(i, n+i);
            slice.each(fn, scope);
            i += n;
            if(stepCallback){stepCallback();}
            if(i < len){
                setTimeout(step, t);
            }
        };
    step();
};


// JavaScript�� ����һ����������Ƶ��
// �����������2�������� Ҫ���Ƶĺ����� fn, �����ʱ�䣺 t;

// ����˵���һ��ͼ��� mousemove �¼�ʱ����������mousemove�¼��Ĵ���Ƶ��Ϊ���500���봥��һ�Ρ�
/*
function changeCursor(elm, e){

    var isLeft, cursor = '';

��if(isLeft){
        elm.style.cursor = 'url("./left.cur"), auto';

    }else{

        cursor = 'right.cur';

    }

   elm.style.cursor =  'url("./' + cursor +��'"), auto';

}

var after = restrain(changeCursor, 500);

function handleMouseMove(e){

    e = e || window.event;
    after(e.target || e.srcElement, e);

}
*/



var restrain = function(fn, t){
    var running = false
    return function(){
        if(running){return;}
        running = true;
        fn.apply(null, arguments);
        setTimeout(function(){running = false;}, t);
    };
};

 


//��������ɾ��console����װһ�£�������ie�Ͳ�������
(function(){
    if (!window.console) {
        var dummy = function(){};
        window.console = {
            log: dummy,
            info: dummy,
            debug: dummy,
            profile: dummy
        };
    }
    'info debug, profile'.split(' ').each(function(item){
       if(!console[item]){
           console[item] = console.log;
       }
    });
})();





//ʹ���¼��������ĺô�����ʡ�ڴ�ɹ��ƣ�Ҳ���������Ƴ�ҳ��֮ǰֹͣ�¼�����
//������������Ǹ���Ԫ�ص�className���ж���Ҫ��Ӧ�ĺ�������ʵ�ø��Զ�������Ը��ã�����cmd��������Ҳ˳��
function dummy(){}
var arr = [
	{
	    name: 'className1',
	    exec: function(event, element){dummy();}
	},
	{
	    name: 'className21',
	    exec: function(event, element){dummy();}
	}

];

document.body.addEventListener('click', function(e){
    classDelegation(e, arr);
}, false);

function classDelegation (event, classNameArr){
    var element = event.target, matched = null, len = classNameArr.length, i;
    outerloop:
        do{
            i = len;
            innerloop:
                while(i--){
                    var item = classNameArr[i];
                    if(!item){continue;}
                    if($(element).hasClassName(item.name)){
                        matched = item;
                        break outerloop;
                        break innerloop;
                    }
                }
            element = element.parentNode;
        }while(element && element.nodeType === 1);
    if(matched){
        typeof matched.exec === 'function' && matched.exec(event, element);
        if(element.nodeName === 'A' && element.getAttribute('target') !== '_blank'){
            event.stop();
        }
        return {element: element, item: matched};
    }
    return null;
};



//��prototype�У�ֱ����Element����չ�͸�������
(function(){
    function clickDelegation(element, arr){
        element.observe('click', function(event){
            var a = Element.classDelegation(event, arr);
        });
        return element;
    }
    Element.addMethods({
        clickDelegation: clickDelegation
    });
})();