import re,csv,json,sys,unicodedata,difflib,collections
txt,ign,out=sys.argv[1:4]
PROV={'buenos aires':'06','catamarca':'10','cordoba':'14','corrientes':'18','chaco':'22','chubut':'26','entre rios':'30','formosa':'34','jujuy':'38','la pampa':'42','la rioja':'46','mendoza':'50','misiones':'54','neuquen':'58','rio negro':'62','salta':'66','san juan':'70','san luis':'74','santa cruz':'78','santa fe':'82','santiago del estero':'86','tucuman':'90','tierra del fuego':'94','ciudad autonoma de buenos aires':'02'}
def n(s): s=unicodedata.normalize('NFD',s.lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn'); return re.sub(r'[^a-z0-9 ]','',s).strip()
ALIAS={('06','ameghino'):'06277',('06','juarez'):'06084',('06','pte peron'):'06648',('10','antofagasta'):'10028',('26','ameghino'):'26028',('46','general angel v penaloza'):'46056',('06','coronel rosales'):'06182',('90','san miguel de tucuman'):'90084'}
def num(s): return float(s.replace('.','').replace(',','.'))
igd=collections.defaultdict(dict)
for f in json.load(open(ign))['features']:
    p=f['properties']; igd[p['in1'][:2]][n(p['nam'])]=p['in1']
rows=[];prov=None;pc=None
rx=re.compile(r'^\s*(.+?)\s{2,}([\d.]+,\d+)\s+([\d.]+,\d+)\s+([\d.,]+)\s*$')
rz=re.compile(r'^\s*(.+?)\s{2,}([\d.]+,\d+)(?:\s+0,00)?\s*$')
for line in open(txt):
    line=line.replace('\f','')
    tk=re.split(r'\s{2,}',line.strip())
    if len(tk)<2 or not all(re.fullmatch(r'[\d.]+,\d+',x) for x in tk[1:]) or len(tk)>4: continue
    name=tk[0]; sup=tk[1]; ext=tk[2] if len(tk)>2 else '0,00'
    pct=tk[3] if len(tk)>3 else ('0,00' if num(ext)==0 else None)
    nm=n(name)
    if nm=='nacion': rows.append(dict(nivel='pais',cod_prov='',cod_dep='',provincia='',departamento='Nación',sup_rural_ha=num(sup),sup_extranjera_ha=num(ext),pct_extranjerizado=num(pct) if pct else '')); continue
    key=next((k for k in PROV if nm==k or nm.startswith(k) and not line.startswith(' ')),None)
    if key and not line.startswith('  '):
        # province line (unindented). Beware departments with same name as province appear indented
        if nm in PROV or nm.startswith('tierra del fuego') or nm.startswith('ciudad'):
            prov=name.strip(); pc=PROV[key]
            rows.append(dict(nivel='provincia',cod_prov=pc,cod_dep='',provincia=prov,departamento='',sup_rural_ha=num(sup),sup_extranjera_ha=num(ext),pct_extranjerizado=num(pct) if pct else '')); continue
    cand=igd.get(pc,{})
    nn=nm.replace('veinticinco','25').replace('nueve','9')
    cod=ALIAS.get((pc,nm)) or cand.get(nm) or cand.get(nn)
    match='exacto' if cod else ''
    if not cod:
        mm=difflib.get_close_matches(nn,list(cand),n=1,cutoff=0.75)
        if mm: cod=cand[mm[0]]; match='aprox:'+mm[0]
    rows.append(dict(nivel='departamento',cod_prov=pc,cod_dep=cod or '',provincia=prov,departamento=name.strip(),sup_rural_ha=num(sup),sup_extranjera_ha=num(ext),pct_extranjerizado=num(pct) if pct else '',match_ign=match))
with open(out,'w',newline='') as fo:
    w=csv.DictWriter(fo,fieldnames=['nivel','cod_prov','cod_dep','provincia','departamento','sup_rural_ha','sup_extranjera_ha','pct_extranjerizado','match_ign']); w.writeheader(); w.writerows(rows)
c=collections.Counter(r['nivel'] for r in rows); print(c)
print('sin codigo',[(r['provincia'],r['departamento']) for r in rows if r['nivel']=='departamento' and not r['cod_dep']])
print('aprox',[(r['departamento'],r['match_ign']) for r in rows if r.get('match_ign','').startswith('aprox')])
d=collections.Counter(r['cod_dep'] for r in rows if r['cod_dep']); print('dups',[k for k,v in d.items() if v>1])
print('>15%',sum(1 for r in rows if r['nivel']=='departamento' and (r['pct_extranjerizado'] or 0)>15))
