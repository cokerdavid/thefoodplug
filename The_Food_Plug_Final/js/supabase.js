(function(){
  const cfg=window.FOOD_PLUG_CONFIG;
  window.supabaseClient=null;
  if(window.supabase&&cfg?.SUPABASE_URL&&cfg?.SUPABASE_PUBLISHABLE_KEY){window.supabaseClient=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY)}
  window.getCurrentUser=async()=>{if(!window.supabaseClient)return null;const {data}=await supabaseClient.auth.getUser();return data.user||null};
  window.signOutUser=async()=>{if(supabaseClient)await supabaseClient.auth.signOut();localStorage.removeItem('foodplug_current_user');location.href='login.html'};
})();
