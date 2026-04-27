// amCharts Map Initialization
let currentLang = localStorage.getItem('lang') || 'en';

function loadLanguage(lang) {
  fetch(`/assets/lang/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (data[lang] && data[lang][key.split('.')[0]] && data[lang][key.split('.')[0]][key.split('.')[1]]) {
          el.textContent = data[lang][key.split('.')[0]][key.split('.')[1]];
        }
      });
    });
}

/* ---------------------- ISO COUNTRY CODES ---------------------- */
const ISO = {
  "Afghanistan":"af","Albania":"al","Algeria":"dz","Andorra":"ad","Angola":"ao","Antigua and Barbuda":"ag",
  "Argentina":"ar","Armenia":"am","Australia":"au","Austria":"at","Azerbaijan":"az",
  "Bahamas":"bs","Bahrain":"bh","Bangladesh":"bd","Barbados":"bb","Belarus":"by","Belgium":"be",
  "Belize":"bz","Benin":"bj","Bhutan":"bt","Bolivia":"bo","Bosnia and Herzegovina":"ba",
  "Botswana":"bw","Brazil":"br","Brunei":"bn","Bulgaria":"bg","Burkina Faso":"bf","Burundi":"bi",
  "Cabo Verde":"cv","Cambodia":"kh","Cameroon":"cm","Canada":"ca","Central African Republic":"cf",
  "Chad":"td","Chile":"cl","China":"cn","Colombia":"co","Comoros":"km","Congo (Congo-Brazzaville)":"cg",
  "Costa Rica":"cr","Croatia":"hr","Cuba":"cu","Cyprus":"cy","Czechia":"cz",
  "Democratic Republic of the Congo":"cd",
  "Denmark":"dk","Djibouti":"dj","Dominica":"dm","Dominican Republic":"do",
  "Ecuador":"ec","Egypt":"eg","El Salvador":"sv","Equatorial Guinea":"gq","Eritrea":"er",
  "Estonia":"ee","Eswatini":"sz","Ethiopia":"et","Fiji":"fj","Finland":"fi","France":"fr",
  "Gabon":"ga","Gambia":"gm","Georgia":"ge","Germany":"de","Ghana":"gh","Greece":"gr",
  "Grenada":"gd","Guatemala":"gt","Guinea":"gn","Guinea-Bissau":"gw","Guyana":"gy","Haiti":"ht",
  "Honduras":"hn","Hungary":"hu","Iceland":"is","India":"in","Indonesia":"id","Iran":"ir",
  "Iraq":"iq","Ireland":"ie","Israel":"il","Italy":"it","Jamaica":"jm","Japan":"jp",
  "Jordan":"jo","Kazakhstan":"kz","Kenya":"ke","Kiribati":"ki","Kuwait":"kw","Kyrgyzstan":"kg",
  "Laos":"la","Latvia":"lv","Lebanon":"lb","Lesotho":"ls","Liberia":"lr","Libya":"ly",
  "Liechtenstein":"li","Lithuania":"lt","Luxembourg":"lu","Madagascar":"mg","Malawi":"mw",
  "Malaysia":"my","Maldives":"mv","Mali":"ml","Malta":"mt","Marshall Islands":"mh","Mauritania":"mr",
  "Mauritius":"mu","Mexico":"mx","Micronesia":"fm","Moldova":"md","Monaco":"mc","Mongolia":"mn",
  "Montenegro":"me","Morocco":"ma","Mozambique":"mz","Myanmar":"mm","Namibia":"na","Nauru":"nr",
  "Nepal":"np","Netherlands":"nl","New Zealand":"nz","Nicaragua":"ni","Niger":"ne","Nigeria":"ng",
  "North Korea":"kp","North Macedonia":"mk","Norway":"no","Oman":"om","Pakistan":"pk",
  "Palau":"pw","Panama":"pa","Papua New Guinea":"pg","Paraguay":"py","Peru":"pe",
  "Philippines":"ph","Poland":"pl","Portugal":"pt","Qatar":"qa","Romania":"ro","Russia":"ru",
  "Rwanda":"rw","Saint Kitts and Nevis":"kn","Saint Lucia":"lc",
  "Saint Vincent and the Grenadines":"vc","Samoa":"ws","San Marino":"sm",
  "Sao Tome and Principe":"st","Saudi Arabia":"sa","Senegal":"sn","Serbia":"rs","Seychelles":"sc",
  "Sierra Leone":"sl","Singapore":"sg","Slovakia":"sk","Slovenia":"si","Solomon Islands":"sb",
  "Somalia":"so","South Africa":"za","South Korea":"kr","South Sudan":"ss","Spain":"es",
  "Sri Lanka":"lk","Sudan":"sd","Suriname":"sr","Sweden":"se","Switzerland":"ch","Syria":"sy",
  "Taiwan":"tw","Tajikistan":"tj","Tanzania":"tz","Thailand":"th","Timor-Leste":"tl","Togo":"tg",
  "Tonga":"to","Trinidad and Tobago":"tt","Tunisia":"tn","Türkiye":"tr","Turkmenistan":"tm",
  "Tuvalu":"tv","Uganda":"ug","Ukraine":"ua","United Arab Emirates":"ae","United Kingdom":"gb",
  "United States":"us","Uruguay":"uy","Uzbekistan":"uz","Vanuatu":"vu","Vatican City":"va",
  "Venezuela":"ve","Vietnam":"vn","Yemen":"ye","Zambia":"zm","Zimbabwe":"zw"
};

/* ---------------------- Helper Slug ---------------------- */
function toSlug(name){
  return name.normalize('NFKD')
             .replace(/[\u0300-\u036f]/g,'')
             .replace(/[^0-9a-zA-Z\s\-]/g,'')
             .trim().toLowerCase().replace(/\s+/g,'-');
}

/* ---------------------- Countries List ---------------------- */
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic",
  "Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba",
  "Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica",
  "Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini",
  "Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada",
  "Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
  "Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein",
  "Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands",
  "Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco",
  "Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger",
  "Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa",
  "San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea",
  "South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia",
  "Türkiye","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia",
  "Zimbabwe"
];

document.addEventListener('DOMContentLoaded', function() {
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("mapdiv", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    chart.maxZoomLevel = 32;

    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.valign = "bottom";
    chart.zoomControl.align = "right";

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.exclude = ["AQ"];

    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.fill = am4core.color("#3aa0ff");
    polygonTemplate.fillOpacity = 0.9;
    polygonTemplate.stroke = am4core.color("#ffffff");
    polygonTemplate.strokeOpacity = 0.6;
    polygonTemplate.tooltipText = "{name}";

    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#0b64b2");

    function findBestCountryNameFromGeodata(name) {
      const geoSlug = toSlug(name);
      for (const candidate of COUNTRIES) {
        const candSlug = toSlug(candidate);
        if (candSlug === geoSlug) return candidate;
        const candSimple = candSlug.replace(/-the-/g,'-');
        const geoSimple = geoSlug.replace(/-the-/g,'-');
        if (candSimple === geoSimple) return candidate;
      }
      return name;
    }

    polygonTemplate.events.on("hit", function(ev) {
      var name = ev.target.dataItem.dataContext.name;
      var canonical = findBestCountryNameFromGeodata(name);
      var slug = toSlug(canonical);
      window.location.href = "countries/right-in-the-middle-of-" + slug + ".html";
    });

    chart.responsive.enabled = true;
  });

  // Render countries grid
  (function renderCountryCards(){
    const grid = document.getElementById('countries-grid');
    // ... COUNTRIES and ISO ...
    for(const name of COUNTRIES){
      const slug = toSlug(name);
      const iso = ISO[name] || "";
      const flag = iso ? `assets/flags/${iso}.svg` : `assets/flags/unknown.svg`;

      const card = document.createElement('div');
      card.innerHTML = `
        <a href="countries/right-in-the-middle-of-${slug}.html" style="text-decoration:none">
          <div class="country-card">
            <div class="country-flag" style="background-image:url('${flag}')"></div>
            <div style="flex:1">
              <div class="country-name">${name}</div>
              <div style="font-size:0.8rem;color:var(--muted)" data-lang="countries.open">Open page</div>
            </div>
          </div>
        </a>
      `;
      grid.appendChild(card);
    }
  })();

  // Load language after dynamic content
  loadLanguage(currentLang);

  // Notify search system that cards are ready
  document.dispatchEvent(new CustomEvent('countryCardsRendered'));
});