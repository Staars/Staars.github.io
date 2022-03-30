


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
            opt.value = prefix + "/manifest/" + name + ".manifest.json";
            og.appendChild(opt);
        }
    }
}


function appendInTable(){
const anchor_point =document.getElementById("web_installer").parentElement.nextElementSibling.nextElementSibling.children[5].firstElementChild.firstElementChild;
anchor_point.parentNode.append(p);
anchor_point.parentNode.append(b);
const selectEl = document.querySelector(".pick-variant");
const installEl = document.querySelector("esp-web-install-button");
installEl.manifest = selectEl.value;
selectEl.addEventListener("change", () => {
    installEl.manifest = selectEl.value;
    console.log(installEl.manifest);
});
}