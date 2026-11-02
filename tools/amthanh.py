# Tao giong doc cho moi cau chua co trong audio.json. Chay: python tools/amthanh.py cau.json
# cau.json la mang cac cau tieng Trung can co am thanh. Can goi edge-tts.
import asyncio, base64, json, os, sys
goc = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(goc, 'tools', 'pydeps'))
if len(sys.argv) > 2: sys.path.insert(0, sys.argv[2])
import edge_tts

p = os.path.join(goc, 'audio.json')
am = json.load(open(p, encoding='utf8'))
ds = [t for t in json.load(open(sys.argv[1], encoding='utf8')) if t not in am]
os.makedirs(os.path.join(goc, 'tools', 'tam'), exist_ok=True)
tam = os.path.join(goc, 'tools', 'tam', 'x.mp3')
async def chinh():
    for t in ds:
        await edge_tts.Communicate(t, 'zh-CN-XiaoxiaoNeural', rate='-10%').save(tam)
        am[t] = base64.b64encode(open(tam, 'rb').read()).decode()
asyncio.run(chinh())
json.dump(am, open(p, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('them', len(ds), 'cau; tong', len(am), '; MB', round(os.path.getsize(p) / 1e6, 2))
