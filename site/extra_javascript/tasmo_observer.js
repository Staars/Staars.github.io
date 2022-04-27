let tasmota_subpage_observer = new MutationObserver(mutationRecords => {
  
  switch(document.querySelector("title").innerText){
        case "MI32 - Tasmota":
            console.log("Subpage: MI32");
            const scriptPromiseBindKey = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = '../extra_javascript/bindkey.js';
            });
            scriptPromiseBindKey.then(() => {
                console.log("Bindkey script loaded ...");
                bindKeyPageInit();
            });          
            break;
        default:
            console.log(document.querySelector("title").innerText);
  }
});

tasmota_subpage_observer.observe (document.head, {
    childList: true,
    subtree: false,
    characterDataOldValue: true
});
