var alert_ = document.getElementById('alert');
if(alert_.innerHTML.length>0)
setTimeout(()=>alert_.classList.toggle('fadeOutDown'),3000)
