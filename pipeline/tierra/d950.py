import pdfplumber,csv,re,sys
src,out=sys.argv[1:3]
rows=[];meta={}
with pdfplumber.open(src) as pdf:
    for i,p in enumerate(pdf.pages):
        if i<2:
            for t in p.extract_tables():
                for r in t:
                    if r and r[-1] and re.fullmatch(r'\d+',(r[-1] or '').strip()):
                        rows.append([ (c or '').replace('\n',' ').strip() for c in r])
        else:
            tx=p.extract_text() or ''
            m=re.search(r'N[ÚU]MERO DE ORDEN\s*(\d+)',tx)
            if not m: continue
            o=int(m.group(1)); d=meta.setdefault(o,{'sup':[], 'lat':[], 'lon':[], 'cie':[]})
            d['sup']+=re.findall(r'Superficie aprox\.?:\s*([\d.,]+)\s*m2',tx)
            for la,lo in re.findall(r'Latitud\s*(-?[\d.]+)\.?\s*Longitud\s*(-?[\d.]+)',tx): d['lat'].append(la.rstrip('.')); d['lon'].append(lo.rstrip('.'))
            d['cie']+=re.findall(r'CIE\s*([\d/]+)',tx)
with open(out,'w',newline='') as fo:
    w=csv.writer(fo); w.writerow(['orden','domicilio','cantidad_inmuebles','localidad','departamento_partido','provincia','cie','croquis_cie','croquis_superficie_m2','croquis_lat','croquis_lon'])
    for r in rows:
        o=int(r[-1]); d=meta.get(o,{})
        sup=[float(s.replace(',','')) for s in d.get('sup',[])]
        w.writerow([o]+r[:6]+['|'.join(d.get('cie',[])), round(sum(sup),2) if sup else '', d.get('lat',[''])[0] if d.get('lat') else '', d.get('lon',[''])[0] if d.get('lon') else ''])
print(len(rows),'rows; croquis for',len(meta))
