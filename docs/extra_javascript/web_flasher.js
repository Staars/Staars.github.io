


s=document.createElement('script');s.type='module';s.src="https://unpkg.com/esp-web-tools@7.3.1/dist/web/install-button.js?module";
document.body.append(s);
b=document.createElement("esp-web-install-button");b.manifest="https://tasmota.github.io/install/manifest/release.tasmota.manifest.json";


p=document.createElement('div');
sel=document.createElement('select');
sel.classList.add('pick-variant');
p.appendChild(sel);

fetch('https://tasmota.github.io/install/manifests.json')
  .then(response => response.json())
  .then(data => make_select(data));


function make_select(data){
    // console.log(data);
    for (opt_group in data){
        var og=document.createElement('optgroup');
        og.label = opt_group;
        sel.appendChild(og);
        console.log(opt_group,data[opt_group]);
        for (fw in data[opt_group]){
            var name = data[opt_group][fw];
            // console.log(data[opt_group][fw]);
            var opt=document.createElement('option');
            opt.label = name;
            var prefix = "https://tasmota.github.io/install/"; //to be ebentually removed on the real server
            opt.value = prefix + "/manifest_ext/" + opt_group + "." +name + ".manifest.json";
            console.log( opt.value);
            og.appendChild(opt);
        }
    }
}


function appendInTable(){
//Step1: add button to DOM
const anchor_point =document.getElementById("web_installer").parentElement.nextElementSibling.nextElementSibling.children[5].firstElementChild.firstElementChild;
anchor_point.parentNode.append(b);
}

window.addEventListener("load", function(event) {
    //step2: check result of attempt to add button to DOM
    try{
        document.body.style.cssText = "--mdc-typography-button-font-size:0.7em;--mdc-dialog-min-width:490px";
        const button = document.querySelector("esp-web-install-button");
        console.log(button.shadowRoot.firstChild.name);
        if(button.shadowRoot.firstChild.name == 'activate'){
            //success: add the select picker and some info
            button.insertAdjacentHTML('beforebegin','<p>1. Connect the ESP device to your computer using USB or serial-to-USB adapter</p><p>2. Select the firmware variant suitable for your device</p>');
            button.insertAdjacentElement('beforebegin',p);
            button.insertAdjacentHTML('beforebegin','<p>3. Hit "CONNECT" and select the correct port or find help if no device found</p>');
            const selectEl = document.querySelector(".pick-variant");
            button.manifest = selectEl.value;
            selectEl.addEventListener("change", () => {
                button.manifest = selectEl.value;
                console.log(button.manifest);
            });
        }

    }
    catch(e){
        const anchor_point =document.getElementById("web_installer").parentElement.nextElementSibling.nextElementSibling.children[5].firstElementChild.firstElementChild;
        anchor_point.insertAdjacentHTML('afterbegin','<p>Unsupported platform/browser. Use another flashing method.</p>');
        console.log(e);
    }

},{ once: true });
