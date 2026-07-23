document.addEventListener('DOMContentLoaded',()=>{
 const form=document.querySelector('#resendForm');const emailInput=document.querySelector('#resendEmail');const status=document.querySelector('#resendStatus');
 const params=new URLSearchParams(location.search);if(params.get('email'))emailInput.value=params.get('email');
 form?.addEventListener('submit',async e=>{e.preventDefault();const email=emailInput.value.trim();if(!email)return;
  if(!supabaseClient){status.textContent='Supabase is unavailable. Please try again later.';return;}
  const base=location.pathname.substring(0,location.pathname.lastIndexOf('/')+1);const redirectTo=location.origin==='null'?'http://localhost:5500/confirm.html':`${location.origin}${base}confirm.html`;
  const {error}=await supabaseClient.auth.resend({type:'signup',email,options:{emailRedirectTo:redirectTo}});
  status.textContent=error?error.message:'A new confirmation email has been sent. Please check your inbox and spam folder.';
 });
});
