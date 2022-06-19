

export type RGBAColor = [number,number,number,number];

export const Colors = [
  "#ff4495",
  "#52e3c2",
  "#0781ff",
  "#d211fe",
  "#ff4b12",
  "#ffd900",
  "#ed8a19",
  "#40c4ff",
  "#546e7a",
  "#efb068",
  "#ffebb7",
  "#1a1a21",
  "#282833",
  "#32323e",
  "#393945",
  "#40424f",
  "#4d505f",
  "#6e7288",
  "#8f94ab",
  "#b4b8cd",
  "#000"
];

// export function getColorFromIndex(index:number){
//   return Colors[index];
// }

export function genColorIndex(index:number){
  return CSS2Color(Colors[index]);
}

export function color2CSS(color:RGBAColor){
    return `rgba(${color[0]},${color[1]},${color[2]},${color[3]/255})`
}


export function CSS2Color(str:string):RGBAColor{
    //"#ff4495"
    let s = str.replace("#","");
    let red = Number.parseInt(s.substr(0,2),16);
    let green = Number.parseInt(s.substr(2,2),16);
    let blue = Number.parseInt(s.substr(4,2),16);

    return [red,green,blue,255];


}

export function fade(color:RGBAColor,by:number):RGBAColor{
  let c:RGBAColor = [...color];
  c[3] -= by;
  return c;
}



// export function readCanvasPixelColor(data:Uint8ClampedArray,pixelOffset:number):RGBAColor{
//   let c:RGBAColor = [data[pixelOffset], data[pixelOffset+1], data[pixelOffset+2],  data[pixelOffset+3] ];
//   return c;
// }



export function mixColours(ra:RGBAColor,rb:RGBAColor):RGBAColor{
  let c1 = ra.map( v => v/255)
  let c2 = rb.map( v => v/255)

  let a0 = c1[3] + c2[3] * ( 1 - c1[3] );


  let calc = (i:number) => ( c1[i]*c1[3] + c2[i]*c2[3]*(1 - c1[3])  ) / a0; 

  let m:RGBAColor = [calc(0),calc(1),calc(2),a0];
  m = m.map( v => Math.round(v*255) ) as RGBAColor;
  return m;

} 



export function mixymixy(aa:RGBAColor,bb:RGBAColor){

  let result = [0,0,0,0];

  let a = aa.slice(0)
  let b = bb.slice(0)


  a[3] = a[3]/255;
  b[3] = b[3]/255;


  let rAlpha = 1 - (1 - b[3]) * (1 - a[3]);
  result[3] = rAlpha*255;
  
  let aRatio =  a[3] *(1 - b[3])/rAlpha;
  let bRatio = b[3] / rAlpha;
  
  result[0] = Math.round((b[0] * bRatio) + (a[0] * aRatio )); // red
  result[1] = Math.round((b[1] * bRatio) + (a[1] * aRatio )); // green
  result[2] = Math.round((b[2] * bRatio) + (a[2] * aRatio )); // blue
  
  return result;
}





export function rgbToStrAlpha(rgb:RGBAColor){
  let v = rgb.map( v => Math.round(v)); //*255
  return `rgb(${v[0]},${v[1]},${v[2]},${v[3]})`;
}




// export function writeCanvasPixelColor(data:Uint8ClampedArray,pixelOffset:number,color:Color){
//   let existing = readCanvasPixelColor(data,pixelOffset);

//   let result = mixymixy(existing,color);

//   data[pixelOffset] = result[0];
//   data[pixelOffset+1] = result[1];
//   data[pixelOffset+2] = result[2];
//   data[pixelOffset+3] = result[3];
// }


//mixymixy