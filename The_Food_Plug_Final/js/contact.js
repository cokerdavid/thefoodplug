document.addEventListener('DOMContentLoaded',()=>{
 const form=document.querySelector('#contactForm');if(!form)return;
 form.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('button[type="submit"]');const status=document.querySelector('#contactStatus');const endpoint=window.FOOD_PLUG_CONFIG?.FORMSPREE_ENDPOINT;
  if(!endpoint){toast('Contact form is not configured yet.');return;}
  btn.disabled=true;btn.textContent='Sending...';status.textContent='';
  try{const r=await fetch(endpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!r.ok)throw new Error('Unable to send your message. Please try again.');form.reset();status.textContent='Message sent successfully. We will get back to you soon.';toast('Message sent successfully');}catch(err){status.textContent=err.message||'Something went wrong. Please try again.';toast(status.textContent)}finally{btn.disabled=false;btn.textContent='Send Message';}
 });
});
