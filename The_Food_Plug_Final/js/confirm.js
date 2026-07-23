document.addEventListener('DOMContentLoaded',async()=>{
 const status=document.querySelector('#confirmStatus');
 if(!window.supabaseClient){status.textContent='Supabase is not available. Please reopen the confirmation link from your email.';return;}
 const {data,error}=await supabaseClient.auth.getSession();
 if(error){status.textContent='We could not verify your confirmation. Please request a new confirmation email.';return;}
 if(data?.session){status.textContent='Your email has been confirmed successfully. You are now signed in.';setTimeout(()=>location.href='profile.html',1200);return;}
 status.textContent='Your email confirmation was processed. You can now log in to your account.';
 setTimeout(()=>location.href='login.html',1500);
});
