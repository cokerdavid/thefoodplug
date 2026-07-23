document.addEventListener('DOMContentLoaded',()=>{
 const signup=document.querySelector('#signupForm');const login=document.querySelector('#loginForm');
 const redirectUrl=()=>{const base=location.pathname.substring(0,location.pathname.lastIndexOf('/')+1);return location.origin==='null'?'http://localhost:5500/confirm.html':`${location.origin}${base}confirm.html`};
 signup?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(signup);if(f.get('password')!==f.get('confirmPassword'))return toast('Passwords do not match');const profile={fullname:f.get('fullname'),phone:f.get('phone'),address:f.get('address')};
   if(supabaseClient){
     const {data,error}=await supabaseClient.auth.signUp({email:f.get('email'),password:f.get('password'),options:{data:profile,emailRedirectTo:redirectUrl()}});
     if(error)return toast(error.message);
     if(data.user && data.session){await supabaseClient.from('profiles').upsert({id:data.user.id,full_name:profile.fullname,phone:profile.phone,address:profile.address});location.href='profile.html';return;}
     location.href='confirm-email.html?email='+encodeURIComponent(f.get('email'));
   }else{const users=JSON.parse(localStorage.getItem('foodplug_users')||'[]');if(users.some(u=>u.email===f.get('email')))return toast('An account with that email already exists');users.push({email:f.get('email'),password:f.get('password'),...profile});localStorage.setItem('foodplug_users',JSON.stringify(users));localStorage.setItem('foodplug_current_user',JSON.stringify(users.at(-1)));location.href='profile.html'}
 });
 login?.addEventListener('submit',async e=>{e.preventDefault();const email=login.email.value,password=login.password.value;if(supabaseClient){const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)return toast(error.message);location.href='profile.html'}else{const u=JSON.parse(localStorage.getItem('foodplug_users')||'[]').find(x=>x.email===email&&x.password===password);if(!u)return toast('Invalid email or password');localStorage.setItem('foodplug_current_user',JSON.stringify(u));location.href='profile.html'}});
});
