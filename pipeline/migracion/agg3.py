import csv,sys,json
rows=list(csv.reader(open(sys.argv[1])))
d=json.load(open("mig_dame_prov.json"))
names=d["names"]; n=len(names)
num=lambda x: 0 if str(x).strip() in ("","-") else int(float(x))
M=[[num(v) for v in r[2:2+n]] for r in rows[4:4+n]]  # M[dest][orig]
STD={"Río negro":"Río Negro","Tierra del Fuego":"Tierra del Fuego, Antártida e Islas del Atlántico Sur"}
AMBA={"ALMIRANTE BROWN","AVELLANEDA","BERAZATEGUI","ESTEBAN ECHEVERRIA","EZEIZA","FLORENCIO VARELA","GENERAL SAN MARTIN","HURLINGHAM","ITUZAINGO","JOSE C. PAZ","LA MATANZA","LANUS","LOMAS DE ZAMORA","MALVINAS ARGENTINAS","MERLO","MORENO","MORON","QUILMES","SAN FERNANDO","SAN ISIDRO","SAN MIGUEL","TIGRE","TRES DE FEBRERO","VICENTE LOPEZ","CABA"}
reg=[None]*n; prov=[None]*n
for name,a,b in d["bounds"]:
    for k in range(a,b+1):
        prov[k]=STD.get(name,name)
        base=names[k].split(". ",1)[1]
        if prov[k] in ("Ciudad Autónoma de Buenos Aires","Buenos Aires"):
            reg[k]="AMBA" if base in AMBA else "Resto de Buenos Aires"
        else: reg[k]=prov[k]
assert sum(1 for r in reg if r=="AMBA")==25
order=["AMBA","Resto de Buenos Aires"]+[STD.get(x[0],x[0]) for x in d["bounds"][2:]]
R={o:{t:0 for t in order} for o in order}
for i in range(n):
    for j in range(n):
        if M[i][j]: R[reg[j]][reg[i]]+=M[i][j]
pop={o:sum(R[x][o] for x in order) for o in order}  # current pop (dest)
inter=sum(R[o][t] for o in order for t in order if o!=t)
print("total inter-region migrants", inter)
for o in order:
    inn=sum(R[x][o] for x in order if x!=o); out=sum(R[o][x] for x in order if x!=o)
    print(f"{o[:25]:25s} pop={pop[o]:9d} in={inn:7d} out={out:7d} net={inn-out:7d}")
json.dump({"order":order,"R":R,"pop2010_5mas":pop},open("mig_2010_amba.json","w"),ensure_ascii=False)
# municipio-level net
res=[]
for i in range(n):
    inn=sum(M[i][j] for j in range(n) if j!=i); out=sum(M[j][i] for j in range(n) if j!=i)
    popi=sum(M[i]); 
    # interprovincial-only in
    inp=sum(M[i][j] for j in range(n) if prov[j]!=prov[i])
    res.append((names[i],prov[i],popi,inn,out,inn-out,inp))
json.dump(res,open("mig_2010_muni.json","w"),ensure_ascii=False)
res.sort(key=lambda x:-x[5])
print("top net abs");[print(r) for r in res[:25]]
print("top net rate (pop>=20000)")
for r in sorted([r for r in res if r[2]>=20000],key=lambda x:-x[5]/x[2])[:25]: print(r, round(100*r[5]/r[2]/5,2),"%/yr")
