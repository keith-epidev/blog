import moment from "moment";

export const timeUnit:Unit = {symbol:"s",name:"second"};
//export const :Unit = {symbol:"s",name:"second"};



export interface Unit{
    symbol:string,
    name:string
}

export interface UnitTranslatorDef{
    label:string;
    symbol:string;
    factor:number;
}

export type UnitTranslator = (value:number,max:number) => [number|string,string];


export function TimestampTranslator(value:number, max:number):[string,string]{
    //let translator = getFactor(durationTranslators,max);
    //let unit = translator.symbol;

    let date = moment(value).format("DD/MM/YY");
    return [date,""];
}



export function durationTranslator(value:number, max:number):[number,string]{
    let translator = getFactor(durationTranslators,max);
    let unit = translator.symbol;


    return [applyTranslator( translator,  value ),unit];
}


export function SITranslator(value:number, max:number):[number,string]{
    let translator = getFactor(SI_Unit_Translators,max);
    let unit = translator.symbol;


    return [applyTranslator( translator,  value ),unit];
}

export function noTranslator(value:number,max:number):[number,string]{
    let precision = Math.pow(10,1);
    let v = Math.round(value*precision)/precision
    return [v,""];
}

export function PercentageTranslator(value:number,max:number):[number,string]{
    let precision = Math.pow(10,1);
    let v = Math.round(value*100*precision)/precision
    return [v,"%"];
}

export let durationTranslators:UnitTranslatorDef[] = [
    {label:"millisecond",symbol:"ms",factor:1/1000},
    {label:"second",symbol:"s",factor:1},
    {label:"minute",symbol:"m",factor:60},
    {label:"hour",symbol:"h",factor:60*60},
    {label:"day",symbol:"d",factor:60*60*24},
    {label:"month",symbol:"M",factor:60*60*24*30},
    {label:"year",symbol:"Y",factor:60*60*24*365},
];

//export let noTranslator:UnitTranslator = {label:"",symbol:"",factor:1}

export let SI_Unit_Translators:UnitTranslatorDef[] = [
    {label:"yocto",symbol:"y",factor:10**-24},
    {label:"zepto",symbol:"z",factor:10**-21},
    {label:"atto",symbol:"a",factor:10**-18},
    {label:"femto",symbol:"f",factor:10**-15},
    {label:"pico",symbol:"p",factor:10**-12},
    {label:"nano",symbol:"n",factor:10**-9},
    {label:"micro",symbol:"μ",factor:10**-6},
    {label:"milli",symbol:"m",factor:10**-3},
    //{label:"centi",symbol:"c",factor:10**-2},
    //{label:"deci",symbol:"d",factor:10**-1},
    {label:"",symbol:"",factor:10**0},
    //{label:"deca",symbol:"da",factor:10**1},
    //{label:"hecto",symbol:"h",factor:10**2},
    {label:"kilo",symbol:"k",factor:10**3},
    {label:"mega",symbol:"M",factor:10**6},
    {label:"giga",symbol:"G",factor:10**9},
    {label:"tera",symbol:"T",factor:10**12},
    {label:"peta",symbol:"P",factor:10**15},
    {label:"exa",symbol:"E",factor:10**18},
    {label:"zetta",symbol:"Z",factor:10**21},
    {label:"yotta",symbol:"Y",factor:10**24}
];





export function getFactor(translators:UnitTranslatorDef[] , value:number){
    for(let i = translators.length-1; i >= 0; i--){
        let t = translators[i];
      


        var precision = Math.pow(10,12);
        let v = Math.round(value*precision / t.factor )/precision;

        if( v >= 1 )
            return t;
        
    }

    return translators[0];
}

export function applyTranslator(translator:UnitTranslatorDef,value:number){
    let precision = Math.pow(10,1);
    return Math.round( value*precision/translator.factor)/precision;
}

export function applyTranslatorLabel(translators:UnitTranslatorDef[],value:number){
    let t = getFactor(translators,value);
    let v = applyTranslator(t,value);

    return `${v}${t.symbol}`;

}