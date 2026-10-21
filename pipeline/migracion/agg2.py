import csv,sys,json,openpyxl,itertools
rows=list(csv.reader(open(sys.argv[1])))
names=[x for x in rows[3][2:] if x!=""][:-1]; n=len(names)
num=lambda x: 0 if str(x).strip() in ("","-") else int(float(x))
rowtot=[num(r[2+n]) for r in rows[4:4+n]]
coltot=[num(v) for v in rows[4+n][2:2+n]]
ws=openpyxl.load_workbook(sys.argv[2],data_only=True,read_only=True).worksheets[0]
dam=[]
for r in ws.iter_rows(min_row=5,values_only=True):
    if r[1]=="Total": colt=r[2:26]; break
    if r[1]: dam.append((r[1],r[26]))
cum=list(itertools.accumulate(rowtot)); target=0; start=0; out=[]
for name,tot in dam:
    target+=tot
    j=min(range(start,n),key=lambda k:abs(cum[k]-target))
    print(f"{name:35s} {start:5d}-{j:5d} {names[start]:30s} {names[j]:30s} diff={cum[j]-target}")
    out.append((name,start,j)); start=j+1
json.dump({"names":names,"bounds":out},open("mig_dame_prov.json","w"),ensure_ascii=False)
