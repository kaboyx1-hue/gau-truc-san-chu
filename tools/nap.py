# Nap bai moi len Sheet. Chay: python tools/nap.py dot.json [--thu]
# dot.json = {"kho": [{"id","loai","data"}], "lich": [{"ngay","bai","tro","loi"}]}
# Thu tu: kiem tra -> tao am thanh -> day audio.json len GitHub -> nap Sheet. Sai o dau dung o do, khong nap nua chung.
import json, os, re, subprocess, sys, urllib.request, unicodedata, csv
goc = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(goc, 'tools', 'pydeps'))
for p in sys.argv[3:]: sys.path.insert(0, p)

THU = '--thu' in sys.argv
dot = json.load(open(sys.argv[1], encoding='utf8'))
cfg = dict(l.split('=', 1) for l in open(os.path.join(goc, 'LINK-RIENG.txt'), encoding='utf8').read().splitlines() if '=' in l and not l.startswith('#'))
loi = []

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kiempy import kiem
def kiemPy(zh, py, ten): loi.extend(kiem(zh, py, ten))

# Tu da co: trong data.js va cac dot da nap
node = r'D:/Claude/JODE/node.exe' if os.path.exists(r'D:/Claude/JODE/node.exe') else 'node'
da = set(json.loads(subprocess.check_output([node, '-e', "const fs=require('fs');const D=new Function(fs.readFileSync('data.js','utf8')+';return WORLDS')();console.log(JSON.stringify(D.flatMap(W=>W.lessons.flatMap(L=>L.w.split('\\n').map(l=>l.split('|')[0])))))"], cwd=goc)))
nhat_ky = os.path.join(goc, 'tools', 'da-nap.json')
cu = json.load(open(nhat_ky, encoding='utf8')) if os.path.exists(nhat_ky) else []
for m in cu:
    if m['loai'] == 'bai': da |= {l.split('|')[0] for l in m['data']['w'].split('\n')}
id_cu = {m['id'] for m in cu}
cap = {}
for r in csv.DictReader(open(os.path.join(goc, 'tools', 'tu-vung-hsk.csv'), encoding='utf-8-sig')):
    k = {'一级': 1, '二级': 2, '三级': 3}.get(r['Level'][:2])
    if k: cap.setdefault(re.sub(r'[0-9\s]', '', r['Word']), k)

doc = []
for m in dot.get('kho', []):
    if m['id'] in id_cu: loi.append(f"{m['id']}: id da nap truoc day")
    d = m['data']
    if m['loai'] == 'bai':
        dong = d['w'].split('\n')
        if len(dong) != 8: loi.append(f"{m['id']}: can 8 tu, co {len(dong)}")
        d['lv'] = {}
        for l in dong:
            f = l.split('|')
            if len(f) != 7: loi.append(f'{m["id"]}: thieu cot o "{l}"'); continue
            h, p, v, e, c, cp, cv = f
            if h in da: loi.append(f'{h}: da co trong bai cu')
            da.add(h)
            if h not in c: loi.append(f'{h}: cum "{c}" khong chua tu')
            kiemPy(h, p, h); kiemPy(c, cp, c)
            if h in cap: d['lv'][h] = cap[h]
            doc += [h, c]
    elif m['loai'] == 'riddle':
        kiemPy(d[0], d[1], d[0]); kiemPy(d[3], d[4], d[3]); doc += [d[0], d[3]]
        if len(d[7]) != 3 or d[3] in d[7] or d[3] in d[0]: loi.append(f'{d[0]}: phuong an sai')
    elif m['loai'] == 'order':
        kiemPy(d[0].replace('|', ''), d[1], d[0]); doc.append(d[0].replace('|', ''))
    elif m['loai'] == 'tip':
        if d[1]: kiemPy(d[0], d[1], d[0]); doc.append(d[0])
        kiemPy(d[2], d[3], d[2]); doc.append(d[2])
    elif m['loai'] == 'speak':
        kiemPy(d[2], d[3], d[2]); kiemPy(d[5], d[6], d[5]); doc += [d[2], d[5]]
    elif m['loai'] == 'chat':
        for s in d['s']: kiemPy(s[0], s[1], s[0]); kiemPy(s[3], s[4], s[3]); doc += [s[0], s[3]]
    else: loi.append(f"{m['id']}: loai la {m['loai']}")

if loi:
    print('KHONG NAP, sua cac loi sau:'); [print(' -', x) for x in loi]; sys.exit(1)
print('kiem tra dat:', len(dot.get('kho', [])), 'bai,', len(dot.get('lich', [])), 'ngay lich,', sum(len(m['data'].get('lv', {})) for m in dot.get('kho', []) if m['loai'] == 'bai'), 'tu thuoc de')
if THU: sys.exit(0)

tam = os.path.join(goc, 'tools', 'tam', 'cau.json'); os.makedirs(os.path.dirname(tam), exist_ok=True)
json.dump(doc, open(tam, 'w', encoding='utf8'), ensure_ascii=False)
subprocess.check_call([sys.executable, os.path.join(goc, 'tools', 'amthanh.py'), tam] + sys.argv[3:4])
json.dump(cu + dot.get('kho', []), open(nhat_ky, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
subprocess.check_call(['git', 'add', 'audio.json', 'tools/da-nap.json'], cwd=goc)
if subprocess.call(['git', 'diff', '--cached', '--quiet'], cwd=goc):
    subprocess.check_call(['git', '-c', 'user.name=kaboyx1-hue', 'commit', '-q', '-m', 'Them bai moi: ' + ', '.join(m['id'] for m in dot.get('kho', []))], cwd=goc)
    subprocess.check_call(['git', 'push', '-q'], cwd=goc)
req = urllib.request.Request(cfg['URL'], data=json.dumps({'k': cfg['KHOA'], 'nap': dot}).encode(), headers={'Content-Type': 'text/plain'})
kq = json.load(urllib.request.urlopen(req, timeout=120))
print('ket qua nap Sheet:', kq)
if not kq.get('ok'): sys.exit(1)
