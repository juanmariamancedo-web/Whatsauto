export function checkRange(body:string){
    const bodyUpperCase = body.toUpperCase()
    if(body.includes("1") || body.includes("2") || body.includes("3") || body.includes("4") || body.includes("5")) return true
    if(bodyUpperCase.includes("UNO") || bodyUpperCase.includes("DOS") || bodyUpperCase.includes("TRES") || bodyUpperCase.includes("CUATRO") || bodyUpperCase.includes("CINCO")) return true
    return false
  }
  
  export function checkAffirmation(body:string){
    if(body.toUpperCase() !== "SI") return false
    return true
  }
  
  export function checkNegation(body:string){
    if(body.toUpperCase() !== "NO") return false
    return true
  }