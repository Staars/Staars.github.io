


s=document.createElement('script');s.type='module';s.src="https://unpkg.com/esp-web-tools@7.3.1/dist/web/install-button.js?module";
document.body.append(s);
b=document.createElement("esp-web-install-button");b.manifest="https://tasmota.github.io/install/manifest/release.tasmota.manifest.json";

p=document.createElement('div');
sel=document.createElement('select');
sel.classList.add('pick-variant');
p.appendChild(sel);

fetch('../extra_javascript/manifests.json')
  .then(response => response.json())
  .then(data => make_select(data));


function make_select(data){
    console.log(data);
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
            var prefix = "https://raw.githubusercontent.com/tasmota/install/main"; //to be removed on the real server
            opt.value = prefix + "/manifest/" + opt_group + "." +name + ".manifest.json";
            console.log( opt.value);
            og.appendChild(opt);
        }
    }
}


function appendInTable(){
const anchor_point =document.getElementById("web_installer").parentElement.nextElementSibling.nextElementSibling.children[5].firstElementChild.firstElementChild;
// console.log(b.shadowRoot.firstChild.name);
// anchor_point.parentNode.append(p);
anchor_point.parentNode.append(b);
const selectEl = document.querySelector(".pick-variant");
const installEl = document.querySelector("esp-web-install-button");
installEl.manifest = selectEl.value;
selectEl.addEventListener("change", () => {
    installEl.manifest = selectEl.value;
    console.log(installEl.manifest);
});
}

window.addEventListener("load", function(event) {
    const button = document.querySelector("esp-web-install-button");
    // const unsupp = document.querySelector("esp-web-install-button").shadowRoot.firstChild.name
    console.log(button.shadowRoot.firstChild.name);
    if(button.shadowRoot.firstChild.name == 'activate'){
        // $("esp-web-install-button").before(p);
        button.insertAdjacentHTML('beforebegin','<ol><li> <p>Connect the ESP device to your computer using USB or serial-to-USB adapter</p> </li><li> <p>Select the firmware variant suitable for your device</p> </li></ol>');
        // button.insertAdjacentHTML('beforebegin','<br>');
        button.insertAdjacentElement('beforebegin',p);
        button.insertAdjacentHTML('beforebegin','<ol><li> <p>Hit "CONNECT" and select the correct port or find help if no device found</p> </li></ol>');
        // button.insertAdjacentHTML('beforebegin','<br>');
    }
},{ once: true });

{/* <ol>
<li> <p>Connect the ESP device to your computer using USB or serial-to-USB adapter</p> </li>
<li> <p>Select the firmware variant suitable for your device</p> </li>
<li> <p>Hit "Install" and select the correct port or find help if no device found</p> </li>
</ol> */}