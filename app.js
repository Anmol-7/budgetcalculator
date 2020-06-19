var budgetController = (function () {
    var Expense = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var Income = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var  calculateTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;
        });
        data.totals[type]=sum;
    };
    var data={
        allItems: {
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage:-1
    };

    return {
        addItem: function(type, des, val){
            var newItem,ID;
            if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            if(type=='exp')
                newItem =new Expense(ID, des, val);
            else  if(type=='inc'){
                newItem = new Income(ID,des,val);
            }


            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type,id){
            var ids,index;
            ids=data.allItems[type].map(function(current){
                 return current.id;
            });
            index=ids.indexOf(id);
            if(index!==-1){
                data.allItems[type].splice(index,1);
            }

        },

        calculateBuget: function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget=data.totals.inc-data.totals.exp;
            if(data.totals.inc>0)
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            else
                data.percentage=-1;
        },
        getBudget: function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage

            }
        },
        testinng:function(){
            console.log(data);
        }
    };
})();


var UIController=(function(){

    var NoStrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
    };
    return{
        getInput: function(){

            return{
            type: document.querySelector(NoStrings.inputType).value,
            description: document.querySelector(NoStrings.inputDescription).value,
            value:parseFloat(document.querySelector(NoStrings.inputValue).value)
        };
    },

    addListItem: function(obj, type){
        var html, newhtml, element;
        if(type==='inc'){
            element=NoStrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }
    else if(type==='exp'){
        element=NoStrings.expensesContainer;
        html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }
    newhtml=html.replace('%id%',obj.id);
    newhtml=newhtml.replace('%description%',obj.description);
    newhtml=newhtml.replace('%value%',obj.value);

    document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
    
    },
    
    deleteListItem:function(selectorID){
        var el=document.querySelector('#'+selectorID);
        el.parentNode.removeChild(el);
    },

    clearFields:function(){
        var fields,fieldsArr;
        fields=document.querySelectorAll(NoStrings.inputDescription+','+NoStrings.inputValue);
        fieldsArr=Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current, index, array){
            current.value="";  
        });
        fieldsArr[0].focus();
    },


    displayBudget:function(obj){
        document.querySelector(NoStrings.budgetLabel).textContent=obj.budget;
        document.querySelector(NoStrings.incomeLabel).textContent=obj.totalInc;
        document.querySelector(NoStrings.expensesLabel).textContent=obj.totalExp;
        if(obj.percentage>0){
            document.querySelector(NoStrings.percentageLabel).textContent=obj.percentage+'%';
        }
        else{
            document.querySelector(NoStrings.percentageLabel).textContent='---';

        }
        
    },
    getNoStrings: function(){
        return NoStrings;
      }
    };
})();


var controller=(function(budgetCtrl, UICtrl){

    var setupEventListener = function(){
        var DOM= UICtrl.getNoStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13||event.which===13){
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var updateBudget = function(){
        budgetCtrl.calculateBuget();
        var budget=budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function(){
        var input, newItem;
        input= UICtrl.getInput();
        
        if(input.description!==""&&!isNaN(input.value)&&input.value>0){
            newItem=budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem,input.type);
            UICtrl.clearFields();
            updateBudget();
        }
    };
    var ctrlDeleteItem=function(event){
        var itemID, splitID,type,ID; 
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID=itemID.split('-');
            type=splitID[0];
            ID= parseInt( splitID[1]);
            
            budgetCtrl.deleteItem(type,ID);

            UICtrl.deleteListItem(itemID);

            updateBudget();
            
        }
    };

    return{
        init: function(){
            console.log('app started');
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1

            });
            setupEventListener();
        }
    };
})(budgetController,UIController);

controller.init();