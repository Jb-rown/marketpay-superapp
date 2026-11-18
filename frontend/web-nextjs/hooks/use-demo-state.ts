"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
/** Local demonstration state. Never use this for credentials, tokens, personal identity data or financial accounting. */
export function useDemoState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [state,setState]=useState<T>(initial);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    try {const raw=localStorage.getItem(`marketpay.preview.${key}`); if(raw!==null)setState(JSON.parse(raw) as T);}catch{/* Private browsing or invalid test data */}
    finally{setLoaded(true);}
  },[key]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem(`marketpay.preview.${key}`,JSON.stringify(state));}catch{/* Local storage unavailable */}},[key,state,loaded]);
  return [state,setState,loaded];
}
