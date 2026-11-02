# So pinyin tu viet voi tu dien, ca chu cai lan thanh dieu. Tra ve danh sach loi (rong la dung).
import re, unicodedata
from pypinyin import lazy_pinyin, pinyin, Style

DAU = {c: t for t, s in enumerate(['', 'āēīōūǖ', 'áéíóúǘ', 'ǎěǐǒǔǚ', 'àèìòùǜ']) for c in s}
HAN = re.compile('[^一-鿿]')

def tron(s):
    s = unicodedata.normalize('NFD', s.lower().replace('ü', 'v'))
    return re.sub(r'[^a-z]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))

def thanh(s):
    return next((DAU[c] for c in s if c in DAU), 0)

# Cach doc dung ma tu dien tu dong hay chon sai: 长 trong 多长时间, 谁 khau ngu, 喂 khi nghe dien thoai
DUNG = {'长': ['cháng'], '谁': ['shéi'], '喂': ['wéi']}

def kiem(zh, py, ten):
    han = HAN.sub('', zh)
    goc = lazy_pinyin(han, style=Style.TONE)
    thu = [DUNG[c][0] if c in DUNG else g for c, g in zip(han, goc)]
    if tron(''.join(thu)) == tron(py).replace('r', '') or tron(''.join(thu)).replace('r', '') == tron(py).replace('r', ''):
        goc = thu
    # 儿 sau chu khac doc dinh vao am truoc (一点儿 = yidianr), khong phai mot am "er" rieng
    chuan = ''.join('r' if c == '儿' and i else p for i, (c, p) in enumerate(zip(han, goc)))
    if tron(py).replace('r', '') != tron(chuan).replace('r', ''):
        return [f'{ten}: pinyin "{py}" khác từ điển "{chuan}"']
    # Cat chuoi pinyin cua minh theo do dai tung am trong tu dien roi so thanh
    chu = [c for c in unicodedata.normalize('NFC', py.lower()) if tron(c)]
    loi, i = [], 0
    for k, c in enumerate(han):
        if c == '儿' and k:
            if i < len(chu) and tron(chu[i]) == 'r':
                i += 1
            continue
        n = len(tron(goc[k]))
        am = ''.join(chu[i:i + n]); i += n
        doc = pinyin(c, style=Style.TONE, heteronym=True)[0] + DUNG.get(c, [])
        t = thanh(am)
        # Bien am cua 一/不 va thanh nhe o am sau la cach doc dung, khong bao loi
        if t in {thanh(p) for p in doc} or c in '一不' or (t == 0 and k > 0):
            continue
        loi.append(f'{ten}: chữ {c} viết "{am}", từ điển ghi {"/".join(doc)}')
    return loi

if __name__ == '__main__':
    assert kiem('感冒', 'gǎnmào', 'x') == []
    assert kiem('感冒', 'gānmào', 'x'), 'phai bat duoc sai thanh'
    assert kiem('一点儿', 'yìdiǎnr', 'x') == []
    assert kiem('不客气', 'bú kèqi', 'x') == []
    assert kiem('行李', 'xíngli', 'x') == []
    assert kiem('冰箱', 'bìngxiāng', 'x'), 'phai bat duoc sai thanh'
    assert kiem('多长时间', 'duō cháng shíjiān', 'x') == []
    assert kiem('你是谁', 'nǐ shì shéi', 'x') == []
    assert kiem('喂', 'wéi', 'x') == []
    assert kiem('长大', 'zhǎngdà', 'x') == []
    print('kiempy dung')
