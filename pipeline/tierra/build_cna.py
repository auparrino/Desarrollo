import csv,json,sys,collections
base=sys.argv[1]; ign=sys.argv[2]
PROV={6:'Buenos Aires',10:'Catamarca',14:'Córdoba',18:'Corrientes',22:'Chaco',26:'Chubut',30:'Entre Ríos',34:'Formosa',38:'Jujuy',42:'La Pampa',46:'La Rioja',50:'Mendoza',54:'Misiones',58:'Neuquén',62:'Río Negro',66:'Salta',70:'San Juan',74:'San Luis',78:'Santa Cruz',82:'Santa Fe',86:'Santiago del Estero',90:'Tucumán',94:'Tierra del Fuego, Antártida e Islas del Atlántico Sur'}
REMAP={'46006':'46056','46068':'46028','46198':'46098','58022':'58042'}
ignc={f['properties']['in1']:f['properties']['nam'] for f in json.load(open(ign))['features']}
def rd(t): return list(csv.DictReader(open(f'{base}/{t}_raw.csv')))
c31=rd('c31'); c32=rd('c32'); c33=rd('c33')
def key(r): return (int(r['prov_param']),int(float(r['codigo'])))
i32={key(r):r for r in c32}; i33={key(r):r for r in c33}
def F(r,k):
    v=r[k]
    return 0.0 if v in ('','s') else float(v)
S=lambda r,ks: any(r[k]=='s' for k in ks)
fisc=['fiscal_arrendamiento','fiscal_aparceria','fiscal_ocupacion_con_permiso','fiscal_comodato','fiscal_ocupacion_de_hecho','fiscal_consecion','fiscal_contrato_accidental','fiscal_usufructo','fiscal_otros']
priv=['privado_propiedad','privado_sucesion_indivisa','arrendamiento','privado_aparceria','privado_ocupacion_con_permiso','privado_comodato','privado_ocupacion_de_hecho','privado_concesion','privado_contrato_accidental','privado_usufructo','privado_otros']
out=[];miss=[];bad=[]
for r in c31:
    p,c=key(r)
    if p==0: continue
    if r['codigo'].strip() and int(float(r['codigo']))==p and r['nombre']==r['nombre']:
        pass
    cod_cna=f'{p:02d}{c:03d}'
    cod=REMAP.get(cod_cna,cod_cna)
    if c==p and len(r['codigo'])<=2: continue  # province total row
    tot=F(r,'total'); sf=sum(F(r,k) for k in fisc); sp=sum(F(r,k) for k in priv); sd=F(r,'sin_discriminar')
    if abs(sf+sp+sd-tot)>max(5,0.001*tot): bad.append((cod,tot,sf+sp+sd))
    q=i32.get((p,c)); t=i33.get((p,c))
    row=dict(cod_dep=cod,cod_dep_cna=cod_cna,provincia=PROV[p],departamento=r['nombre'],
      sup_total_ha=round(tot,1),sup_propiedad_ha=F(r,'privado_propiedad'),sup_sucesion_indivisa_ha=F(r,'privado_sucesion_indivisa'),
      sup_arrendamiento_ha=round(F(r,'arrendamiento')+F(r,'fiscal_arrendamiento'),1),
      sup_arrendamiento_privado_ha=F(r,'arrendamiento'),
      sup_privado_total_ha=round(sp,1),
      sup_fiscal_ha=round(sf,1),
      sup_fiscal_ocupacion_hecho_ha=F(r,'fiscal_ocupacion_de_hecho'),
      sup_fiscal_ocupacion_permiso_ha=F(r,'fiscal_ocupacion_con_permiso'),
      sup_fiscal_arrendamiento_ha=F(r,'fiscal_arrendamiento'),
      sup_fiscal_concesion_ha=F(r,'fiscal_consecion'),
      sup_fiscal_otras_formas_ha=round(F(r,'fiscal_aparceria')+F(r,'fiscal_comodato')+F(r,'fiscal_contrato_accidental')+F(r,'fiscal_usufructo')+F(r,'fiscal_otros'),1),
      sup_privado_ocupacion_hecho_ha=F(r,'privado_ocupacion_de_hecho'),
      sup_sin_discriminar_ha=F(r,'sin_discriminar'),
      pct_fiscal=round(100*sf/tot,2) if tot else None,
      pct_propiedad=round(100*F(r,'privado_propiedad')/tot,2) if tot else None,
      pct_arrendamiento=round(100*(F(r,'arrendamiento')+F(r,'fiscal_arrendamiento'))/tot,2) if tot else None,
      parcelas_total=F(q,'total') if q else None,
      parcelas_fiscales=sum(F(q,k) for k in fisc) if q else None,
      parcelas_fiscales_con_secreto=int(S(q,fisc)) if q else None,
      tsl_total=F(t,'total') if t else None,
      tsl_fiscales=(F(t,'comunal_o_comunero_total')+F(t,'comunidad_de_pueblos_originarios_total')+F(t,'otras_tierras_fiscales_total')+F(t,'parques_o_reservas_total')) if t else None,
      tsl_comunidad_pueblos_originarios=F(t,'comunidad_de_pueblos_originarios_total') if t else None,
      tsl_otras_tierras_fiscales=F(t,'otras_tierras_fiscales_total') if t else None,
      tsl_privadas=F(t,'privadas_total') if t else None,
      nombre_ign=ignc.get(cod,''))
    if cod not in ignc: miss.append((cod,r['nombre']))
    out.append(row)
with open(f'{base}/../cna2018_tenencia_departamento.csv','w',newline='') as fo:
    w=csv.DictWriter(fo,fieldnames=list(out[0])); w.writeheader(); w.writerows(out)
print(len(out),'rows; sum check failures',bad[:10],len(bad)); print('not in IGN',miss)
print('IGN not in CNA',[ (k,v) for k,v in ignc.items() if k not in {o['cod_dep'] for o in out}])

# provincial check
pt={int(float(r['codigo'])):F(r,'total') for r in c31 if r['prov_param']=='0'}
agg=collections.defaultdict(float)
for o in out: agg[int(o['cod_dep'][:2])]+=o['sup_total_ha']
print('prov diffs',[(k,round(pt[k]-v,1)) for k,v in agg.items() if abs(pt[k]-v)>5])
tot=sum(o['sup_total_ha'] for o in out); fis=sum(o['sup_fiscal_ha'] for o in out)
print('pais total',tot,'fiscal',fis,round(100*fis/tot,2))
# add department area from IGN geometry
from shapely.geometry import shape
from pyproj import Geod
g=Geod(ellps='WGS84'); area={}
for f in json.load(open(ign))['features']:
    try: area[f['properties']['in1']]=abs(g.geometry_area_perimeter(shape(f['geometry']))[0])/1e4
    except Exception as e: pass
for o in out:
    a=area.get(o['cod_dep']); o['sup_departamento_ign_ha']=round(a) if a else None
    o['pct_departamento_en_eap']=round(100*o['sup_total_ha']/a,1) if a else None
with open(f'{base}/../cna2018_tenencia_departamento.csv','w',newline='') as fo:
    w=csv.DictWriter(fo,fieldnames=list(out[0])); w.writeheader(); w.writerows(out)
print('area ok',sum(1 for o in out if o['sup_departamento_ign_ha']))
