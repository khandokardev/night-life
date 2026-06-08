import React, { useState } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

const GOLD = "#D4AF37";

export const COUNTRIES = [
  { code: "+93",   flag: "🇦🇫", name: "Afghanistan",                   iso: "AF" },
  { code: "+355",  flag: "🇦🇱", name: "Albania",                       iso: "AL" },
  { code: "+213",  flag: "🇩🇿", name: "Algeria",                       iso: "DZ" },
  { code: "+1684", flag: "🇦🇸", name: "American Samoa",                iso: "AS" },
  { code: "+376",  flag: "🇦🇩", name: "Andorra",                       iso: "AD" },
  { code: "+244",  flag: "🇦🇴", name: "Angola",                        iso: "AO" },
  { code: "+1264", flag: "🇦🇮", name: "Anguilla",                      iso: "AI" },
  { code: "+1268", flag: "🇦🇬", name: "Antigua & Barbuda",             iso: "AG" },
  { code: "+54",   flag: "🇦🇷", name: "Argentina",                     iso: "AR" },
  { code: "+374",  flag: "🇦🇲", name: "Armenia",                       iso: "AM" },
  { code: "+297",  flag: "🇦🇼", name: "Aruba",                         iso: "AW" },
  { code: "+61",   flag: "🇦🇺", name: "Australia",                     iso: "AU" },
  { code: "+43",   flag: "🇦🇹", name: "Austria",                       iso: "AT" },
  { code: "+994",  flag: "🇦🇿", name: "Azerbaijan",                    iso: "AZ" },
  { code: "+1242", flag: "🇧🇸", name: "Bahamas",                       iso: "BS" },
  { code: "+973",  flag: "🇧🇭", name: "Bahrain",                       iso: "BH" },
  { code: "+880",  flag: "🇧🇩", name: "Bangladesh",                    iso: "BD" },
  { code: "+1246", flag: "🇧🇧", name: "Barbados",                      iso: "BB" },
  { code: "+375",  flag: "🇧🇾", name: "Belarus",                       iso: "BY" },
  { code: "+32",   flag: "🇧🇪", name: "Belgium",                       iso: "BE" },
  { code: "+501",  flag: "🇧🇿", name: "Belize",                        iso: "BZ" },
  { code: "+229",  flag: "🇧🇯", name: "Benin",                         iso: "BJ" },
  { code: "+1441", flag: "🇧🇲", name: "Bermuda",                       iso: "BM" },
  { code: "+975",  flag: "🇧🇹", name: "Bhutan",                        iso: "BT" },
  { code: "+591",  flag: "🇧🇴", name: "Bolivia",                       iso: "BO" },
  { code: "+387",  flag: "🇧🇦", name: "Bosnia & Herzegovina",          iso: "BA" },
  { code: "+267",  flag: "🇧🇼", name: "Botswana",                      iso: "BW" },
  { code: "+55",   flag: "🇧🇷", name: "Brazil",                        iso: "BR" },
  { code: "+246",  flag: "🇮🇴", name: "British Indian Ocean Territory", iso: "IO" },
  { code: "+1284", flag: "🇻🇬", name: "British Virgin Islands",        iso: "VG" },
  { code: "+673",  flag: "🇧🇳", name: "Brunei",                        iso: "BN" },
  { code: "+359",  flag: "🇧🇬", name: "Bulgaria",                      iso: "BG" },
  { code: "+226",  flag: "🇧🇫", name: "Burkina Faso",                  iso: "BF" },
  { code: "+257",  flag: "🇧🇮", name: "Burundi",                       iso: "BI" },
  { code: "+855",  flag: "🇰🇭", name: "Cambodia",                      iso: "KH" },
  { code: "+237",  flag: "🇨🇲", name: "Cameroon",                      iso: "CM" },
  { code: "+1",    flag: "🇨🇦", name: "Canada",                        iso: "CA" },
  { code: "+238",  flag: "🇨🇻", name: "Cape Verde",                    iso: "CV" },
  { code: "+1345", flag: "🇰🇾", name: "Cayman Islands",                iso: "KY" },
  { code: "+236",  flag: "🇨🇫", name: "Central African Republic",      iso: "CF" },
  { code: "+235",  flag: "🇹🇩", name: "Chad",                          iso: "TD" },
  { code: "+56",   flag: "🇨🇱", name: "Chile",                         iso: "CL" },
  { code: "+86",   flag: "🇨🇳", name: "China",                         iso: "CN" },
  { code: "+57",   flag: "🇨🇴", name: "Colombia",                      iso: "CO" },
  { code: "+269",  flag: "🇰🇲", name: "Comoros",                       iso: "KM" },
  { code: "+242",  flag: "🇨🇬", name: "Congo",                         iso: "CG" },
  { code: "+243",  flag: "🇨🇩", name: "Congo (DRC)",                   iso: "CD" },
  { code: "+682",  flag: "🇨🇰", name: "Cook Islands",                  iso: "CK" },
  { code: "+506",  flag: "🇨🇷", name: "Costa Rica",                    iso: "CR" },
  { code: "+385",  flag: "🇭🇷", name: "Croatia",                       iso: "HR" },
  { code: "+53",   flag: "🇨🇺", name: "Cuba",                          iso: "CU" },
  { code: "+599",  flag: "🇨🇼", name: "Curaçao",                       iso: "CW" },
  { code: "+357",  flag: "🇨🇾", name: "Cyprus",                        iso: "CY" },
  { code: "+420",  flag: "🇨🇿", name: "Czech Republic",                iso: "CZ" },
  { code: "+45",   flag: "🇩🇰", name: "Denmark",                       iso: "DK" },
  { code: "+253",  flag: "🇩🇯", name: "Djibouti",                      iso: "DJ" },
  { code: "+1767", flag: "🇩🇲", name: "Dominica",                      iso: "DM" },
  { code: "+1809", flag: "🇩🇴", name: "Dominican Republic",            iso: "DO" },
  { code: "+593",  flag: "🇪🇨", name: "Ecuador",                       iso: "EC" },
  { code: "+20",   flag: "🇪🇬", name: "Egypt",                         iso: "EG" },
  { code: "+503",  flag: "🇸🇻", name: "El Salvador",                   iso: "SV" },
  { code: "+240",  flag: "🇬🇶", name: "Equatorial Guinea",             iso: "GQ" },
  { code: "+291",  flag: "🇪🇷", name: "Eritrea",                       iso: "ER" },
  { code: "+372",  flag: "🇪🇪", name: "Estonia",                       iso: "EE" },
  { code: "+268",  flag: "🇸🇿", name: "Eswatini",                      iso: "SZ" },
  { code: "+251",  flag: "🇪🇹", name: "Ethiopia",                      iso: "ET" },
  { code: "+298",  flag: "🇫🇴", name: "Faroe Islands",                 iso: "FO" },
  { code: "+679",  flag: "🇫🇯", name: "Fiji",                          iso: "FJ" },
  { code: "+358",  flag: "🇫🇮", name: "Finland",                       iso: "FI" },
  { code: "+33",   flag: "🇫🇷", name: "France",                        iso: "FR" },
  { code: "+594",  flag: "🇬🇫", name: "French Guiana",                 iso: "GF" },
  { code: "+689",  flag: "🇵🇫", name: "French Polynesia",              iso: "PF" },
  { code: "+241",  flag: "🇬🇦", name: "Gabon",                         iso: "GA" },
  { code: "+220",  flag: "🇬🇲", name: "Gambia",                        iso: "GM" },
  { code: "+995",  flag: "🇬🇪", name: "Georgia",                       iso: "GE" },
  { code: "+49",   flag: "🇩🇪", name: "Germany",                       iso: "DE" },
  { code: "+233",  flag: "🇬🇭", name: "Ghana",                         iso: "GH" },
  { code: "+350",  flag: "🇬🇮", name: "Gibraltar",                     iso: "GI" },
  { code: "+30",   flag: "🇬🇷", name: "Greece",                        iso: "GR" },
  { code: "+299",  flag: "🇬🇱", name: "Greenland",                     iso: "GL" },
  { code: "+1473", flag: "🇬🇩", name: "Grenada",                       iso: "GD" },
  { code: "+590",  flag: "🇬🇵", name: "Guadeloupe",                    iso: "GP" },
  { code: "+1671", flag: "🇬🇺", name: "Guam",                          iso: "GU" },
  { code: "+502",  flag: "🇬🇹", name: "Guatemala",                     iso: "GT" },
  { code: "+44",   flag: "🇬🇬", name: "Guernsey",                      iso: "GG" },
  { code: "+224",  flag: "🇬🇳", name: "Guinea",                        iso: "GN" },
  { code: "+245",  flag: "🇬🇼", name: "Guinea-Bissau",                 iso: "GW" },
  { code: "+592",  flag: "🇬🇾", name: "Guyana",                        iso: "GY" },
  { code: "+509",  flag: "🇭🇹", name: "Haiti",                         iso: "HT" },
  { code: "+504",  flag: "🇭🇳", name: "Honduras",                      iso: "HN" },
  { code: "+852",  flag: "🇭🇰", name: "Hong Kong",                     iso: "HK" },
  { code: "+36",   flag: "🇭🇺", name: "Hungary",                       iso: "HU" },
  { code: "+354",  flag: "🇮🇸", name: "Iceland",                       iso: "IS" },
  { code: "+91",   flag: "🇮🇳", name: "India",                         iso: "IN" },
  { code: "+62",   flag: "🇮🇩", name: "Indonesia",                     iso: "ID" },
  { code: "+98",   flag: "🇮🇷", name: "Iran",                          iso: "IR" },
  { code: "+964",  flag: "🇮🇶", name: "Iraq",                          iso: "IQ" },
  { code: "+353",  flag: "🇮🇪", name: "Ireland",                       iso: "IE" },
  { code: "+44",   flag: "🇮🇲", name: "Isle of Man",                   iso: "IM" },
  { code: "+972",  flag: "🇮🇱", name: "Israel",                        iso: "IL" },
  { code: "+39",   flag: "🇮🇹", name: "Italy",                         iso: "IT" },
  { code: "+225",  flag: "🇨🇮", name: "Ivory Coast",                   iso: "CI" },
  { code: "+1876", flag: "🇯🇲", name: "Jamaica",                       iso: "JM" },
  { code: "+81",   flag: "🇯🇵", name: "Japan",                         iso: "JP" },
  { code: "+44",   flag: "🇯🇪", name: "Jersey",                        iso: "JE" },
  { code: "+962",  flag: "🇯🇴", name: "Jordan",                        iso: "JO" },
  { code: "+7",    flag: "🇰🇿", name: "Kazakhstan",                    iso: "KZ" },
  { code: "+254",  flag: "🇰🇪", name: "Kenya",                         iso: "KE" },
  { code: "+686",  flag: "🇰🇮", name: "Kiribati",                      iso: "KI" },
  { code: "+383",  flag: "🇽🇰", name: "Kosovo",                        iso: "XK" },
  { code: "+965",  flag: "🇰🇼", name: "Kuwait",                        iso: "KW" },
  { code: "+996",  flag: "🇰🇬", name: "Kyrgyzstan",                    iso: "KG" },
  { code: "+856",  flag: "🇱🇦", name: "Laos",                          iso: "LA" },
  { code: "+371",  flag: "🇱🇻", name: "Latvia",                        iso: "LV" },
  { code: "+961",  flag: "🇱🇧", name: "Lebanon",                       iso: "LB" },
  { code: "+266",  flag: "🇱🇸", name: "Lesotho",                       iso: "LS" },
  { code: "+231",  flag: "🇱🇷", name: "Liberia",                       iso: "LR" },
  { code: "+218",  flag: "🇱🇾", name: "Libya",                         iso: "LY" },
  { code: "+423",  flag: "🇱🇮", name: "Liechtenstein",                 iso: "LI" },
  { code: "+370",  flag: "🇱🇹", name: "Lithuania",                     iso: "LT" },
  { code: "+352",  flag: "🇱🇺", name: "Luxembourg",                    iso: "LU" },
  { code: "+853",  flag: "🇲🇴", name: "Macau",                         iso: "MO" },
  { code: "+261",  flag: "🇲🇬", name: "Madagascar",                    iso: "MG" },
  { code: "+265",  flag: "🇲🇼", name: "Malawi",                        iso: "MW" },
  { code: "+60",   flag: "🇲🇾", name: "Malaysia",                      iso: "MY" },
  { code: "+960",  flag: "🇲🇻", name: "Maldives",                      iso: "MV" },
  { code: "+223",  flag: "🇲🇱", name: "Mali",                          iso: "ML" },
  { code: "+356",  flag: "🇲🇹", name: "Malta",                         iso: "MT" },
  { code: "+692",  flag: "🇲🇭", name: "Marshall Islands",              iso: "MH" },
  { code: "+596",  flag: "🇲🇶", name: "Martinique",                    iso: "MQ" },
  { code: "+222",  flag: "🇲🇷", name: "Mauritania",                    iso: "MR" },
  { code: "+230",  flag: "🇲🇺", name: "Mauritius",                     iso: "MU" },
  { code: "+262",  flag: "🇾🇹", name: "Mayotte",                       iso: "YT" },
  { code: "+52",   flag: "🇲🇽", name: "Mexico",                        iso: "MX" },
  { code: "+691",  flag: "🇫🇲", name: "Micronesia",                    iso: "FM" },
  { code: "+373",  flag: "🇲🇩", name: "Moldova",                       iso: "MD" },
  { code: "+377",  flag: "🇲🇨", name: "Monaco",                        iso: "MC" },
  { code: "+976",  flag: "🇲🇳", name: "Mongolia",                      iso: "MN" },
  { code: "+382",  flag: "🇲🇪", name: "Montenegro",                    iso: "ME" },
  { code: "+1664", flag: "🇲🇸", name: "Montserrat",                    iso: "MS" },
  { code: "+212",  flag: "🇲🇦", name: "Morocco",                       iso: "MA" },
  { code: "+258",  flag: "🇲🇿", name: "Mozambique",                    iso: "MZ" },
  { code: "+95",   flag: "🇲🇲", name: "Myanmar",                       iso: "MM" },
  { code: "+264",  flag: "🇳🇦", name: "Namibia",                       iso: "NA" },
  { code: "+674",  flag: "🇳🇷", name: "Nauru",                         iso: "NR" },
  { code: "+977",  flag: "🇳🇵", name: "Nepal",                         iso: "NP" },
  { code: "+31",   flag: "🇳🇱", name: "Netherlands",                   iso: "NL" },
  { code: "+64",   flag: "🇳🇿", name: "New Zealand",                   iso: "NZ" },
  { code: "+505",  flag: "🇳🇮", name: "Nicaragua",                     iso: "NI" },
  { code: "+227",  flag: "🇳🇪", name: "Niger",                         iso: "NE" },
  { code: "+234",  flag: "🇳🇬", name: "Nigeria",                       iso: "NG" },
  { code: "+850",  flag: "🇰🇵", name: "North Korea",                   iso: "KP" },
  { code: "+389",  flag: "🇲🇰", name: "North Macedonia",               iso: "MK" },
  { code: "+47",   flag: "🇳🇴", name: "Norway",                        iso: "NO" },
  { code: "+968",  flag: "🇴🇲", name: "Oman",                          iso: "OM" },
  { code: "+92",   flag: "🇵🇰", name: "Pakistan",                      iso: "PK" },
  { code: "+680",  flag: "🇵🇼", name: "Palau",                         iso: "PW" },
  { code: "+970",  flag: "🇵🇸", name: "Palestine",                     iso: "PS" },
  { code: "+507",  flag: "🇵🇦", name: "Panama",                        iso: "PA" },
  { code: "+675",  flag: "🇵🇬", name: "Papua New Guinea",              iso: "PG" },
  { code: "+595",  flag: "🇵🇾", name: "Paraguay",                      iso: "PY" },
  { code: "+51",   flag: "🇵🇪", name: "Peru",                          iso: "PE" },
  { code: "+63",   flag: "🇵🇭", name: "Philippines",                   iso: "PH" },
  { code: "+48",   flag: "🇵🇱", name: "Poland",                        iso: "PL" },
  { code: "+351",  flag: "🇵🇹", name: "Portugal",                      iso: "PT" },
  { code: "+1787", flag: "🇵🇷", name: "Puerto Rico",                   iso: "PR" },
  { code: "+974",  flag: "🇶🇦", name: "Qatar",                         iso: "QA" },
  { code: "+262",  flag: "🇷🇪", name: "Réunion",                       iso: "RE" },
  { code: "+40",   flag: "🇷🇴", name: "Romania",                       iso: "RO" },
  { code: "+7",    flag: "🇷🇺", name: "Russia",                        iso: "RU" },
  { code: "+250",  flag: "🇷🇼", name: "Rwanda",                        iso: "RW" },
  { code: "+1869", flag: "🇰🇳", name: "Saint Kitts & Nevis",           iso: "KN" },
  { code: "+1758", flag: "🇱🇨", name: "Saint Lucia",                   iso: "LC" },
  { code: "+1784", flag: "🇻🇨", name: "Saint Vincent & Grenadines",    iso: "VC" },
  { code: "+685",  flag: "🇼🇸", name: "Samoa",                         iso: "WS" },
  { code: "+378",  flag: "🇸🇲", name: "San Marino",                    iso: "SM" },
  { code: "+239",  flag: "🇸🇹", name: "São Tomé & Príncipe",           iso: "ST" },
  { code: "+966",  flag: "🇸🇦", name: "Saudi Arabia",                  iso: "SA" },
  { code: "+221",  flag: "🇸🇳", name: "Senegal",                       iso: "SN" },
  { code: "+381",  flag: "🇷🇸", name: "Serbia",                        iso: "RS" },
  { code: "+248",  flag: "🇸🇨", name: "Seychelles",                    iso: "SC" },
  { code: "+232",  flag: "🇸🇱", name: "Sierra Leone",                  iso: "SL" },
  { code: "+65",   flag: "🇸🇬", name: "Singapore",                     iso: "SG" },
  { code: "+1721", flag: "🇸🇽", name: "Sint Maarten",                  iso: "SX" },
  { code: "+421",  flag: "🇸🇰", name: "Slovakia",                      iso: "SK" },
  { code: "+386",  flag: "🇸🇮", name: "Slovenia",                      iso: "SI" },
  { code: "+677",  flag: "🇸🇧", name: "Solomon Islands",               iso: "SB" },
  { code: "+252",  flag: "🇸🇴", name: "Somalia",                       iso: "SO" },
  { code: "+27",   flag: "🇿🇦", name: "South Africa",                  iso: "ZA" },
  { code: "+82",   flag: "🇰🇷", name: "South Korea",                   iso: "KR" },
  { code: "+211",  flag: "🇸🇸", name: "South Sudan",                   iso: "SS" },
  { code: "+34",   flag: "🇪🇸", name: "Spain",                         iso: "ES" },
  { code: "+94",   flag: "🇱🇰", name: "Sri Lanka",                     iso: "LK" },
  { code: "+249",  flag: "🇸🇩", name: "Sudan",                         iso: "SD" },
  { code: "+597",  flag: "🇸🇷", name: "Suriname",                      iso: "SR" },
  { code: "+47",   flag: "🇸🇯", name: "Svalbard & Jan Mayen",          iso: "SJ" },
  { code: "+46",   flag: "🇸🇪", name: "Sweden",                        iso: "SE" },
  { code: "+41",   flag: "🇨🇭", name: "Switzerland",                   iso: "CH" },
  { code: "+963",  flag: "🇸🇾", name: "Syria",                         iso: "SY" },
  { code: "+886",  flag: "🇹🇼", name: "Taiwan",                        iso: "TW" },
  { code: "+992",  flag: "🇹🇯", name: "Tajikistan",                    iso: "TJ" },
  { code: "+255",  flag: "🇹🇿", name: "Tanzania",                      iso: "TZ" },
  { code: "+66",   flag: "🇹🇭", name: "Thailand",                      iso: "TH" },
  { code: "+670",  flag: "🇹🇱", name: "Timor-Leste",                   iso: "TL" },
  { code: "+228",  flag: "🇹🇬", name: "Togo",                          iso: "TG" },
  { code: "+676",  flag: "🇹🇴", name: "Tonga",                         iso: "TO" },
  { code: "+1868", flag: "🇹🇹", name: "Trinidad & Tobago",             iso: "TT" },
  { code: "+216",  flag: "🇹🇳", name: "Tunisia",                       iso: "TN" },
  { code: "+90",   flag: "🇹🇷", name: "Turkey",                        iso: "TR" },
  { code: "+993",  flag: "🇹🇲", name: "Turkmenistan",                  iso: "TM" },
  { code: "+1649", flag: "🇹🇨", name: "Turks & Caicos Islands",        iso: "TC" },
  { code: "+688",  flag: "🇹🇻", name: "Tuvalu",                        iso: "TV" },
  { code: "+256",  flag: "🇺🇬", name: "Uganda",                        iso: "UG" },
  { code: "+380",  flag: "🇺🇦", name: "Ukraine",                       iso: "UA" },
  { code: "+971",  flag: "🇦🇪", name: "United Arab Emirates",          iso: "AE" },
  { code: "+44",   flag: "🇬🇧", name: "United Kingdom",                iso: "GB" },
  { code: "+1",    flag: "🇺🇸", name: "United States",                 iso: "US" },
  { code: "+598",  flag: "🇺🇾", name: "Uruguay",                       iso: "UY" },
  { code: "+1340", flag: "🇻🇮", name: "US Virgin Islands",             iso: "VI" },
  { code: "+998",  flag: "🇺🇿", name: "Uzbekistan",                    iso: "UZ" },
  { code: "+678",  flag: "🇻🇺", name: "Vanuatu",                       iso: "VU" },
  { code: "+39",   flag: "🇻🇦", name: "Vatican City",                  iso: "VA" },
  { code: "+58",   flag: "🇻🇪", name: "Venezuela",                     iso: "VE" },
  { code: "+84",   flag: "🇻🇳", name: "Vietnam",                       iso: "VN" },
  { code: "+681",  flag: "🇼🇫", name: "Wallis & Futuna",               iso: "WF" },
  { code: "+967",  flag: "🇾🇪", name: "Yemen",                         iso: "YE" },
  { code: "+260",  flag: "🇿🇲", name: "Zambia",                        iso: "ZM" },
  { code: "+263",  flag: "🇿🇼", name: "Zimbabwe",                      iso: "ZW" },
];

export type Country = typeof COUNTRIES[0];
export const DEFAULT_COUNTRY = COUNTRIES.find(c => c.iso === "ZA")!;

interface Props {
  selected: Country;
  onChange: (c: Country) => void;
}

export function CountryCodePicker({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search) ||
        c.iso.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  const close = () => { setOpen(false); setSearch(""); };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 bg-white/5 border border-white/15 rounded-2xl flex-shrink-0 active:scale-95 transition-transform"
        style={{ minHeight: 50 }}>
        <span className="text-[18px] leading-none">{selected.flag}</span>
        <span className="text-white text-sm font-semibold tracking-wide">{selected.code}</span>
        <ChevronDown size={13} className="text-[#666]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={close}>
          <div className="w-full bg-[#111] rounded-t-[28px] flex flex-col"
            style={{ maxHeight: "72vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}
            onClick={e => e.stopPropagation()}>

            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <h3 className="font-['Poppins'] font-bold text-white text-[17px]">Select Country Code</h3>
              <button onClick={close}
                className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center active:scale-90 transition-transform"
                style={{ background: "rgba(255,255,255,0.08)" }}>
                <X size={15} className="text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search country or dial code…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-[13px] placeholder:text-[#555] outline-none"
                  style={{ caretColor: GOLD }}
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 px-3 pb-6">
              {filtered.length === 0 && (
                <p className="text-center text-[#666] text-sm py-8">No countries found</p>
              )}
              {filtered.map(c => {
                const active = selected.iso === c.iso && selected.code === c.code;
                return (
                  <button key={`${c.iso}-${c.code}`}
                    onClick={() => { onChange(c); close(); }}
                    className="w-full flex items-center gap-0 px-3 py-3 rounded-2xl transition-all text-left mb-0.5 active:scale-[0.98]"
                    style={active
                      ? { background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)" }
                      : { border: "1px solid transparent" }}>
                    {/* Flag — fixed width */}
                    <span className="text-[20px] leading-none w-9 text-center flex-shrink-0">{c.flag}</span>
                    {/* Dial code — fixed width, right-aligned so columns snap */}
                    <span className="w-14 flex-shrink-0 text-right text-[12px] font-bold pr-3"
                      style={{ color: GOLD, fontVariantNumeric: "tabular-nums" }}>{c.code}</span>
                    {/* Country name — fills remaining space */}
                    <span className="flex-1 text-white text-[13px] font-medium truncate">{c.name}</span>
                    {active && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2"
                        style={{ background: GOLD }}>
                        <Check size={11} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CountryCodePicker;
