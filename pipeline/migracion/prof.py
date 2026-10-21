import openpyxl,sys,re,json
def cells(p):
    ws=openpyxl.load_workbook(p,data_only=True,read_only=True).worksheets[0]
    return [list(r) for r in ws.iter_rows(values_only=True)]
def n(v):
    if v is None: return 0
    s=str(v).replace(" ","").replace("\xa0","")
    return 0 if s in("","-") else float(s)
base="/home/user/Desarrollo/data/raw/migracion/"
out={}
for y,mig_first in (("2022",False),("2010",True)):
    # EE: age x years x condition
    rows=cells(f"{base}m{y}/ARG_{y}_D5EE.xlsx")
    age=None; acc={}
    for r in rows:
        a=r[1]; e=r[2]
        if a not in (None,"") and str(a).strip()[:1].isdigit():
            age=int(re.match(r"\s*(\d+)",str(a)).group(1))
        if age is None or e in (None,"") : continue
        es=str(e).strip()
        if not es.isdigit() or es=="99": continue
        yrs=int(es)
        if mig_first: m,nm=n(r[3]),n(r[4])
        else: nm,m=n(r[3]),n(r[4])
        d=acc.setdefault(age,{"m":[0,0,0],"nm":[0,0,0]})
        for k,c in (("m",m),("nm",nm)):
            d[k][0]+=c; d[k][1]+=c*yrs; d[k][2]+=c*(yrs>=13)
    res={}
    for lo,hi in ((25,39),(25,34),(30,39)):
        S={"m":[0,0,0],"nm":[0,0,0]}
        for a,d in acc.items():
            if lo<=a<=hi:
                for k in S:
                    for i in range(3): S[k][i]+=d[k][i]
        res[f"{lo}-{hi}"]={k:{"anios_medios":round(S[k][1]/S[k][0],2),"pct_13mas":round(100*S[k][2]/S[k][0],1)} for k in S}
    out[y]={"educ":res}
    # age shares
    rows=cells(f"{base}m{y}/ARG_{y}_D5DA.xlsx")
    ages={}
    for r in rows:
        a=r[1]
        if a and str(a).strip()[:1].isdigit():
            lo=int(re.match(r"\s*(\d+)",str(a)).group(1))
            if mig_first: m,nm=n(r[2]),n(r[3])
            else: nm,m=n(r[2]),n(r[3])
            ages[lo]=(m,nm)
    M=sum(v[0] for v in ages.values()); NM=sum(v[1] for v in ages.values())
    sh=lambda lo,hi,i,T: round(100*sum(v[i] for a,v in ages.items() if lo<=a<=hi)/T,1)
    out[y]["edad"]={"migrantes_total":M,"m_5_14":sh(5,14,0,M),"m_15_34":sh(15,34,0,M),"m_20_34":sh(20,34,0,M),"m_35_59":sh(35,59,0,M),"m_60mas":sh(60,200,0,M),
        "nm_15_34":sh(15,34,1,NM),"nm_5_14":sh(5,14,1,NM),"nm_60mas":sh(60,200,1,NM),
        "tasa_migr_20_34_pct":round(100*sum(v[0] for a,v in ages.items() if 20<=a<=34)/sum(v[0]+v[1] for a,v in ages.items() if 20<=a<=34),2),
        "tasa_migr_total_pct":round(100*M/(M+NM),2),
        "tasa_por_edad":{a:round(100*v[0]/(v[0]+v[1]),2) for a,v in sorted(ages.items()) if v[0]+v[1]>0 and a<=80}}
print(json.dumps(out,indent=1))
json.dump(out,open("mig_perfil.json","w"))
