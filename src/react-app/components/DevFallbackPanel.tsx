import React from "react";

export function DevFallbackPanel() {
  // Coleta informações técnicas úteis para debug
  const [info] = React.useState(() => {
    let localStorageKeys = [];
    let sessionStorageKeys = [];
    try { localStorageKeys = Object.keys(window.localStorage); } catch {}
    try { sessionStorageKeys = Object.keys(window.sessionStorage); } catch {}
    const loadedAssets = Array.from(document.querySelectorAll('link[rel~="icon"],link[rel~="apple-touch-icon"],link[rel~="manifest"],script[src],link[rel~="stylesheet"]')).map(el => {
      if (el instanceof HTMLLinkElement) return { tag: 'link', rel: el.rel, href: el.href };
      if (el instanceof HTMLScriptElement) return { tag: 'script', src: el.src };
      return { tag: el.tagName.toLowerCase() };
    });
    const navLinks = Array.from(document.querySelectorAll('a')).map(a => a.href);
    return {
      hash: window.location.hash,
      pathname: window.location.pathname,
      search: window.location.search,
      fullUrl: window.location.href,
      loadedAssets,
      navLinks,
      localStorageKeys,
      sessionStorageKeys,
      userAgent: navigator.userAgent,
      isDev: !('update_vite_data' in window),
      time: new Date().toISOString(),
    };
  });
  return (
    <div style={{maxWidth:480,margin:'3rem auto',padding:24,border:'1px solid #ccc',borderRadius:8,background:'#fff',fontFamily:'sans-serif'}}>
      <h2 style={{color:'#b91c1c',fontWeight:700,fontSize:22,marginBottom:8}}>Rota de teste não encontrada</h2>
      <div style={{marginBottom:16}}>Verifique a URL ou utilize um dos caminhos válidos:<br/>
        <code style={{background:'#eee',padding:'2px 6px',borderRadius:4,margin:'0 2px'}}>/#/auth-test</code>
        <code style={{background:'#eee',padding:'2px 6px',borderRadius:4,margin:'0 2px'}}>/#/private-test</code>
      </div>
      <details open style={{background:'#f8fafc',padding:12,borderRadius:6,fontSize:13}}>
        <summary style={{cursor:'pointer',fontWeight:600,marginBottom:6}}>Painel técnico para debug</summary>
        <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-all',fontSize:12,margin:0}}>{JSON.stringify(info, null, 2)}</pre>
      </details>
      <div style={{marginTop:16}}>
        <button style={{padding:'6px 16px',borderRadius:4,background:'#e5e7eb',border:'none',cursor:'pointer'}} onClick={()=>window.location.href='/'}>Ir para Home</button>
      </div>
    </div>
  );
}