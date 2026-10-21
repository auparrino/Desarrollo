import re,html,glob,os,csv,sys
base=sys.argv[1]
def num(s):
    s=s.strip()
    if s in ('-','','///','...'): return 0.0 if s=='-' else None
    if ',' in s: return float(s.replace('.','').replace(',','.'))
    try: return float(s)
    except: return s
def clean(c): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',c))).strip()
for tab in ('c31','c32','c33'):
    out=[]; header=None
    for f in sorted(glob.glob(f'{base}/html/{tab}_prov*.html')):
        prov=int(re.search(r'prov(\d+)',f).group(1))
        h=open(f,encoding='utf-8').read()
        t=re.findall(r'<table.*?</table>',h,flags=re.S)[0]
        rows=[[clean(c) for c in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>',r,flags=re.S)] for r in re.findall(r'<tr.*?</tr>',t,flags=re.S)]
        rows=[r for r in rows if len(r)>3]
        hd=[x.replace('TIPO DE DOMINIO Y REGIMEN DE TENECIA DE LA TIERRA','').strip() for x in rows[0]]
        if header is None: header=hd
        assert hd==header,(f,hd)
        for r in rows[1:]:
            out.append([prov]+r[:2]+[num(x) for x in r[2:]])
    cols=['prov_param','codigo','nombre']+[re.sub(r'[^a-z0-9]+','_',h.lower()).strip('_') for h in header[2:]]
    with open(f'{base}/{tab}_raw.csv','w',newline='') as fo:
        w=csv.writer(fo); w.writerow(cols); w.writerows(out)
    print(tab,len(out),cols)
