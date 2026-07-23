(function(){
  function setVisible(el, show){ if(el) el.hidden=!show; }
  function render(session){
    const loggedIn=!!session?.user;
    document.querySelectorAll('[data-auth="login"]').forEach(el=>setVisible(el,!loggedIn));
    document.querySelectorAll('[data-auth="account"]').forEach(el=>setVisible(el,loggedIn));
    document.querySelectorAll('[data-auth="logout"]').forEach(el=>setVisible(el,loggedIn));
    document.querySelectorAll('[data-auth="signup"]').forEach(el=>setVisible(el,!loggedIn));
    document.querySelectorAll('[data-auth="user-email"]').forEach(el=>{el.textContent=session?.user?.email||''});
  }
  async function init(){
    if(!window.supabaseClient){render(null);return;}
    const {data}=await supabaseClient.auth.getSession();
    render(data?.session||null);
    supabaseClient.auth.onAuthStateChange((_event,session)=>render(session));
    document.querySelectorAll('[data-auth="logout"]').forEach(btn=>btn.addEventListener('click',async e=>{
      e.preventDefault();
      btn.setAttribute('aria-busy','true');
      const {error}=await supabaseClient.auth.signOut();
      btn.removeAttribute('aria-busy');
      if(error){toast(error.message);return;}
      render(null);
      toast('You have been logged out');
      setTimeout(()=>location.href='index.html',350);
    }));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
