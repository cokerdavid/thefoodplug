(function(){
  const CART_KEY='foodplug_cart', WISH_KEY='foodplug_wishlist';
  window.getCart=()=>JSON.parse(localStorage.getItem(CART_KEY)||'[]');
  window.saveCart=(cart)=>{localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCartCount();};
  window.getWishlist=()=>JSON.parse(localStorage.getItem(WISH_KEY)||'[]');
  window.saveWishlist=(list)=>localStorage.setItem(WISH_KEY,JSON.stringify(list));
  window.money=(n)=>`₦${Number(n||0).toLocaleString()}`;
  window.updateCartCount=()=>document.querySelectorAll('#cartCount').forEach(el=>el.textContent=getCart().reduce((s,i)=>s+i.quantity,0));
  window.toast=(msg)=>{let el=document.querySelector('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),2200)};
  window.addToCart=(product,quantity=1,measure)=>{const cart=getCart();const m=measure||product.measure;const found=cart.find(i=>i.productId===product.id&&i.measure===m);if(found)found.quantity+=quantity;else cart.push({productId:product.id,name:product.name,price:product.price,image:product.image,measure:m,quantity});saveCart(cart);toast(`${product.name} added to cart`);};
  window.toggleWishlist=(id)=>{let list=getWishlist();list=list.includes(id)?list.filter(x=>x!==id):[...list,id];saveWishlist(list);toast(list.includes(id)?'Added to wishlist':'Removed from wishlist');return list.includes(id)};
  document.addEventListener('DOMContentLoaded',()=>{
    updateCartCount();
    const hamburger=document.querySelector('.hamburger'), nav=document.querySelector('.nav-links');
    if(hamburger&&nav)hamburger.addEventListener('click',()=>nav.classList.toggle('open'));
    document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
    const path=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
    const loader=document.getElementById('loader');if(loader)setTimeout(()=>loader.classList.add('hide'),400);
  });
})();
