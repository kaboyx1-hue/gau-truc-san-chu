// Du lieu bai hoc goc. Bai moi hang tuan nam trong Sheet (KHO_BAI), khong sua o day.
const WORLDS=[
{id:'w1',name:'Nhà của tôi',zh:'我的家',e:'🏠',c:'#12B76A',d:'#0B8F52',cap:'Ôn chắc cấp 1–2',goal:'Kể về gia đình và một ngày của mình',game:{g:'radical',n:'Ghép chữ'},boss:{e:'🐭',n:'Chuột trộm chữ'},lessons:[
{t:'Người thân',e:'👨‍👩‍👧',w:`丈夫|zhàngfu|chồng|🤵|我丈夫很帅|wǒ zhàngfu hěn shuài|Chồng tôi rất đẹp trai
妻子|qīzi|vợ|👰|他妻子是老师|tā qīzi shì lǎoshī|Vợ anh ấy là giáo viên
孩子|háizi|con, trẻ con|🧒|两个孩子|liǎng gè háizi|Hai đứa con
哥哥|gēge|anh trai|👦|我哥哥比我高|wǒ gēge bǐ wǒ gāo|Anh trai tôi cao hơn tôi
姐姐|jiějie|chị gái|👧|姐姐在上班|jiějie zài shàngbān|Chị đang đi làm
弟弟|dìdi|em trai|🧑|弟弟还小|dìdi hái xiǎo|Em trai còn nhỏ
妹妹|mèimei|em gái|👶|我妹妹爱唱歌|wǒ mèimei ài chànggē|Em gái tôi thích hát
朋友|péngyou|bạn bè|🤝|老朋友|lǎo péngyou|Bạn cũ`},
{t:'Một ngày của tôi',e:'⏰',w:`起床|qǐchuáng|thức dậy|⏰|早上七点起床|zǎoshang qī diǎn qǐchuáng|7 giờ sáng thức dậy
洗澡|xǐzǎo|tắm|🛁|先洗澡再睡觉|xiān xǐzǎo zài shuìjiào|Tắm xong rồi ngủ
穿|chuān|mặc|👕|穿衣服|chuān yīfu|Mặc quần áo
跑步|pǎobù|chạy bộ|🏃|每天跑步|měitiān pǎobù|Ngày nào cũng chạy bộ
锻炼|duànliàn|tập luyện|🏋️|每天锻炼身体|měitiān duànliàn shēntǐ|Ngày nào cũng tập thể dục
跳舞|tiàowǔ|nhảy múa|💃|她跳舞很好看|tā tiàowǔ hěn hǎokàn|Cô ấy nhảy rất đẹp
休息|xiūxi|nghỉ ngơi|🛋️|休息一下|xiūxi yíxià|Nghỉ một chút
旅游|lǚyóu|du lịch|🧳|去北京旅游|qù Běijīng lǚyóu|Đi Bắc Kinh du lịch`},
{t:'Tả người tả vật',e:'😄',w:`高兴|gāoxìng|vui|😄|很高兴认识你|hěn gāoxìng rènshi nǐ|Rất vui được biết bạn
累|lèi|mệt|😩|今天好累|jīntiān hǎo lèi|Hôm nay mệt quá
忙|máng|bận|🗂️|最近很忙|zuìjìn hěn máng|Dạo này rất bận
便宜|piányi|rẻ|🏷️|便宜一点儿|piányi yìdiǎnr|Rẻ hơn chút đi
贵|guì|đắt|💸|太贵了|tài guì le|Đắt quá
远|yuǎn|xa|🛣️|离这儿不远|lí zhèr bù yuǎn|Cách đây không xa
近|jìn|gần|📍|我家很近|wǒ jiā hěn jìn|Nhà tôi rất gần
快|kuài|nhanh|⚡|快一点儿|kuài yìdiǎnr|Nhanh lên chút`}]},
{id:'w2',name:'Quán trà sữa',zh:'奶茶店',e:'🧋',c:'#E58E00',d:'#B86F00',cap:'Cấp 2 sang cấp 3',goal:'Tự gọi món, trả giá, trả tiền',game:{g:'measure',n:'Quán lượng từ'},boss:{e:'🐙',n:'Bạch tuộc tham ăn'},lessons:[
{t:'Món ngon',e:'🍜',w:`牛奶|niúnǎi|sữa bò|🥛|喝牛奶|hē niúnǎi|Uống sữa
鸡蛋|jīdàn|trứng gà|🥚|两个鸡蛋|liǎng gè jīdàn|Hai quả trứng
方便面|fāngbiànmiàn|mì tôm|🍜|吃方便面|chī fāngbiànmiàn|Ăn mì tôm
西瓜|xīguā|dưa hấu|🍉|西瓜很甜|xīguā hěn tián|Dưa hấu rất ngọt
蛋糕|dàngāo|bánh kem|🍰|生日蛋糕|shēngrì dàngāo|Bánh sinh nhật
啤酒|píjiǔ|bia|🍺|来两瓶啤酒|lái liǎng píng píjiǔ|Cho hai chai bia
奶茶|nǎichá|trà sữa|🧋|一杯奶茶|yì bēi nǎichá|Một ly trà sữa
甜|tián|ngọt|🍯|太甜了|tài tián le|Ngọt quá`},
{t:'Trong quán ăn',e:'🥢',w:`菜单|càidān|thực đơn|📜|看一下菜单|kàn yíxià càidān|Xem thực đơn một chút
饱|bǎo|no|😋|我吃饱了|wǒ chī bǎo le|Tôi no rồi
筷子|kuàizi|đũa|🥢|一双筷子|yì shuāng kuàizi|Một đôi đũa
碗|wǎn|bát|🥣|再来一碗|zài lái yì wǎn|Cho thêm một bát
饿|è|đói|🤤|我饿了|wǒ è le|Tôi đói rồi
渴|kě|khát|🥵|口渴了|kǒu kě le|Khát nước rồi
外卖|wàimài|đồ ăn giao tận nơi|🛵|点个外卖吧|diǎn gè wàimài ba|Gọi đồ ăn về đi
请客|qǐngkè|mời, đãi|🍽️|今天我请客|jīntiān wǒ qǐngkè|Hôm nay tôi mời`},
{t:'Đi mua sắm',e:'🛍️',w:`超市|chāoshì|siêu thị|🛒|去超市买菜|qù chāoshì mǎi cài|Đi siêu thị mua đồ ăn
裙子|qúnzi|váy|👗|这条裙子真好看|zhè tiáo qúnzi zhēn hǎokàn|Cái váy này đẹp thật
衬衫|chènshān|áo sơ mi|👔|一件白衬衫|yí jiàn bái chènshān|Một chiếc sơ mi trắng
鞋|xié|giày|👟|一双新鞋|yì shuāng xīn xié|Một đôi giày mới
换|huàn|đổi|🔄|能换一个吗|néng huàn yí gè ma|Đổi cái khác được không
试|shì|thử|🪞|可以试试吗|kěyǐ shìshi ma|Thử được không
信用卡|xìnyòngkǎ|thẻ tín dụng|💳|可以用信用卡吗|kěyǐ yòng xìnyòngkǎ ma|Dùng thẻ tín dụng được không
合适|héshì|vừa vặn, phù hợp|👌|这双鞋很合适|zhè shuāng xié hěn héshì|Đôi giày này rất vừa`}]},
{id:'w3',name:'Thành phố lớn',zh:'大城市',e:'🚕',c:'#2B9DFF',d:'#1577CF',cap:'Cấp 3',goal:'Bắt xe, hỏi đường, không bị lạc',game:{g:'chat',n:'Nhập vai đi taxi',p:1},boss:{e:'🦊',n:'Cáo lạc đường'},lessons:[
{t:'Đi lại',e:'🚇',w:`地铁|dìtiě|tàu điện ngầm|🚇|坐地铁上班|zuò dìtiě shàngbān|Đi tàu điện đi làm
司机|sījī|tài xế|🚖|司机师傅|sījī shīfu|Bác tài
机场|jīchǎng|sân bay|🛫|去机场|qù jīchǎng|Ra sân bay
高铁|gāotiě|tàu cao tốc|🚄|坐高铁去上海|zuò gāotiě qù Shànghǎi|Đi tàu cao tốc tới Thượng Hải
护照|hùzhào|hộ chiếu|🛂|别忘了护照|bié wàng le hùzhào|Đừng quên hộ chiếu
行李|xíngli|hành lý|🧳|行李太重了|xíngli tài zhòng le|Hành lý nặng quá
迟到|chídào|đến muộn|⏳|别迟到|bié chídào|Đừng đến muộn
晚点|wǎndiǎn|trễ giờ (tàu, máy bay)|🕙|飞机晚点了|fēijī wǎndiǎn le|Máy bay trễ giờ rồi`},
{t:'Hỏi đường',e:'🧭',w:`附近|fùjìn|gần đây|📌|附近有超市吗|fùjìn yǒu chāoshì ma|Gần đây có siêu thị không
左边|zuǒbian|bên trái|⬅️|在左边|zài zuǒbian|Ở bên trái
右边|yòubian|bên phải|➡️|往右边走|wǎng yòubian zǒu|Đi về bên phải
旁边|pángbiān|bên cạnh|👫|银行旁边|yínháng pángbiān|Bên cạnh ngân hàng
地图|dìtú|bản đồ|🗺️|看手机地图|kàn shǒujī dìtú|Xem bản đồ trên điện thoại
过|guò|qua, băng qua|🚶|过马路|guò mǎlù|Qua đường
楼|lóu|tòa nhà, tầng|🏢|我住三楼|wǒ zhù sān lóu|Tôi ở tầng ba
电梯|diàntī|thang máy|🛗|坐电梯上楼|zuò diàntī shàng lóu|Đi thang máy lên`},
{t:'Nơi chốn, thời tiết',e:'⛅',w:`银行|yínháng|ngân hàng|🏦|去银行取钱|qù yínháng qǔ qián|Đến ngân hàng rút tiền
公园|gōngyuán|công viên|🌳|去公园走走|qù gōngyuán zǒuzou|Ra công viên đi dạo
图书馆|túshūguǎn|thư viện|📚|在图书馆看书|zài túshūguǎn kàn shū|Đọc sách ở thư viện
医院|yīyuàn|bệnh viện|🏥|去医院看病|qù yīyuàn kàn bìng|Đến bệnh viện khám
凉快|liángkuai|mát mẻ|🍃|今天很凉快|jīntiān hěn liángkuai|Hôm nay rất mát
季节|jìjié|mùa|🍂|我喜欢这个季节|wǒ xǐhuan zhège jìjié|Tôi thích mùa này
晴|qíng|nắng|☀️|明天是晴天|míngtiān shì qíngtiān|Mai trời nắng
伞|sǎn|cái ô|☂️|记得带伞|jìde dài sǎn|Nhớ mang ô`}]},
{id:'w4',name:'Học và làm',zh:'学习和工作',e:'💼',c:'#8E6BFF',d:'#6B46E0',cap:'Cấp 3',goal:'Nói về việc học, việc làm, xin nghỉ',game:{g:'order',n:'Xếp câu'},boss:{e:'🦉',n:'Cú giám thị'},lessons:[
{t:'Trường lớp',e:'📝',w:`作业|zuòyè|bài tập|📝|写作业|xiě zuòyè|Làm bài tập
考试|kǎoshì|thi|✍️|明天考试|míngtiān kǎoshì|Mai thi
成绩|chéngjì|điểm số, thành tích|🏅|成绩不错|chéngjì búcuò|Điểm khá tốt
练习|liànxí|luyện tập|🔁|多练习|duō liànxí|Luyện nhiều vào
复习|fùxí|ôn tập|📖|复习生词|fùxí shēngcí|Ôn từ mới
词典|cídiǎn|từ điển|📕|查词典|chá cídiǎn|Tra từ điển
句子|jùzi|câu|💬|这个句子|zhège jùzi|Câu này
水平|shuǐpíng|trình độ|📈|汉语水平|Hànyǔ shuǐpíng|Trình độ tiếng Trung`},
{t:'Văn phòng',e:'🏬',w:`经理|jīnglǐ|giám đốc, quản lý|👔|王经理|Wáng jīnglǐ|Giám đốc Vương
同事|tóngshì|đồng nghiệp|👥|新同事|xīn tóngshì|Đồng nghiệp mới
办公室|bàngōngshì|văn phòng|🏬|在办公室|zài bàngōngshì|Ở văn phòng
会议|huìyì|cuộc họp|📊|下午有个会议|xiàwǔ yǒu gè huìyì|Chiều có cuộc họp
开会|kāihuì|họp|💼|今天下午开会|jīntiān xiàwǔ kāihuì|Chiều nay họp
请假|qǐngjià|xin nghỉ|🙋|我想请假|wǒ xiǎng qǐngjià|Tôi muốn xin nghỉ
休假|xiūjià|nghỉ phép|🏖️|下周我休假|xià zhōu wǒ xiūjià|Tuần sau tôi nghỉ phép
邮件|yóujiàn|email, thư|📧|发邮件|fā yóujiàn|Gửi email`},
{t:'Làm cho xong việc',e:'✅',w:`准备|zhǔnbèi|chuẩn bị|🎒|准备好了|zhǔnbèi hǎo le|Chuẩn bị xong rồi
检查|jiǎnchá|kiểm tra|🔍|再检查一下|zài jiǎnchá yíxià|Kiểm tra lại chút
解决|jiějué|giải quyết|🛠️|解决问题|jiějué wèntí|Giải quyết vấn đề
完成|wánchéng|hoàn thành|✅|完成工作|wánchéng gōngzuò|Hoàn thành công việc
提高|tígāo|nâng cao|🚀|提高水平|tígāo shuǐpíng|Nâng cao trình độ
决定|juédìng|quyết định|🎯|我决定了|wǒ juédìng le|Tôi quyết định rồi
帮忙|bāngmáng|giúp đỡ|🤲|请你帮忙|qǐng nǐ bāngmáng|Nhờ bạn giúp
发现|fāxiàn|phát hiện|💡|我发现一个问题|wǒ fāxiàn yí gè wèntí|Tôi phát hiện một vấn đề`}]},
{id:'w5',name:'Nói như người bản địa',zh:'地道中文',e:'🐉',c:'#FF6252',d:'#D9402F',cap:'Cấp 3 + từ đời thật',goal:'Bày tỏ cảm xúc, chat với bạn Trung Quốc',game:{g:'riddle',n:'Đố chữ đèn lồng'},boss:{e:'🐲',n:'Rồng giấy'},lessons:[
{t:'Cảm xúc',e:'😟',w:`担心|dānxīn|lo lắng|😟|别担心|bié dānxīn|Đừng lo
害怕|hàipà|sợ|😱|我害怕狗|wǒ hàipà gǒu|Tôi sợ chó
生气|shēngqì|tức giận|😠|别生气|bié shēngqì|Đừng giận
着急|zháojí|sốt ruột|😣|别着急|bié zháojí|Đừng vội
难过|nánguò|buồn|😢|我很难过|wǒ hěn nánguò|Tôi rất buồn
满意|mǎnyì|hài lòng|😌|我很满意|wǒ hěn mǎnyì|Tôi rất hài lòng
相信|xiāngxìn|tin tưởng|🤞|我相信你|wǒ xiāngxìn nǐ|Tôi tin bạn
关心|guānxīn|quan tâm|🫶|谢谢你的关心|xièxie nǐ de guānxīn|Cảm ơn bạn đã quan tâm`},
{t:'Câu cửa miệng',e:'🗣️',w:`没事儿|méishìr|không sao|👌|没事儿,别客气|méishìr, bié kèqi|Không sao, đừng khách sáo
算了|suànle|thôi bỏ đi|🤷|算了,不去了|suànle, bú qù le|Thôi, không đi nữa
差不多|chàbuduō|gần như, tàm tạm|🤏|差不多了|chàbuduō le|Gần xong rồi
还行|hái xíng|cũng được|🙂|味道还行|wèidao hái xíng|Vị cũng được
加油|jiāyóu|cố lên|💪|加油!你可以的|jiāyóu! nǐ kěyǐ de|Cố lên! Bạn làm được mà
随便|suíbiàn|tùy, sao cũng được|🎲|随便吃点儿|suíbiàn chī diǎnr|Ăn tạm gì đó
不好意思|bù hǎoyìsi|ngại quá, xin lỗi|🙇|不好意思,来晚了|bù hǎoyìsi, lái wǎn le|Ngại quá, tôi đến muộn
怎么办|zěnme bàn|làm sao đây|🤔|现在怎么办|xiànzài zěnme bàn|Giờ làm sao đây`},
{t:'Chat với bạn bè',e:'📲',w:`聊天儿|liáotiānr|tán gẫu|💬|一起聊天儿|yìqǐ liáotiānr|Cùng tán gẫu
微信|wēixìn|WeChat|📲|加个微信吧|jiā gè wēixìn ba|Kết bạn WeChat nhé
消息|xiāoxi|tin nhắn, tin tức|✉️|给我发消息|gěi wǒ fā xiāoxi|Nhắn tin cho tôi
有空|yǒu kòng|rảnh|🕒|周末有空吗|zhōumò yǒu kòng ma|Cuối tuần rảnh không
约|yuē|hẹn|📅|约个时间|yuē gè shíjiān|Hẹn một thời gian
火锅|huǒguō|lẩu|🍲|一起吃火锅|yìqǐ chī huǒguō|Cùng ăn lẩu
拍照|pāizhào|chụp ảnh|📸|帮我拍照|bāng wǒ pāizhào|Chụp ảnh giúp tôi
厉害|lìhai|giỏi ghê|🏆|你真厉害|nǐ zhēn lìhai|Bạn giỏi thật`}]}];

const RIDDLES=[
['一加一','yī jiā yī','Một cộng một','王','wáng','vua, họ Vương','Dấu cộng giống chữ 十, kẹp thêm hai nét 一 thành 王.',['二','三','十']],
['大口吃小口','dà kǒu chī xiǎo kǒu','Miệng lớn nuốt miệng nhỏ','回','huí','quay về','Chữ 口 to bọc chữ 口 nhỏ bên trong.',['日','品','吕']],
['两个月亮','liǎng gè yuèliang','Hai mặt trăng','朋','péng','bạn','Hai chữ 月 (trăng) đứng cạnh nhau.',['明','用','肥']],
['太阳月亮在一起','tàiyáng yuèliang zài yìqǐ','Mặt trời và mặt trăng ở cùng nhau','明','míng','sáng','日 (mặt trời) + 月 (mặt trăng).',['朋','星','早']],
['人在云上走','rén zài yún shàng zǒu','Người đi trên mây','会','huì','biết, sẽ','Chữ 人 đặt trên chữ 云.',['去','运','合']],
['门里有个人','mén lǐ yǒu gè rén','Trong cửa có một người','闪','shǎn','lóe sáng','Chữ 人 nằm trong chữ 门.',['问','闻','间']],
['门里有张口','mén lǐ yǒu zhāng kǒu','Trong cửa có cái miệng','问','wèn','hỏi','Chữ 口 nằm trong chữ 门.',['闪','间','闹']],
['十张口,一颗心','shí zhāng kǒu, yì kē xīn','Mười cái miệng, một trái tim','思','sī','suy nghĩ','十 + 口 = 田, đặt trên chữ 心.',['想','念','忘']],
['一口咬掉牛尾巴','yì kǒu yǎo diào niú wěiba','Một miếng cắn đứt đuôi con trâu','告','gào','báo cho biết','Chữ 牛 mất nét đuôi, thêm 口 ở dưới.',['吃','生','半']],
['一人一张口,口下长只手','yì rén yì zhāng kǒu, kǒu xià zhǎng zhī shǒu','Một người, một cái miệng, dưới miệng mọc bàn tay','拿','ná','cầm, lấy','人 + 一 + 口 = 合, thêm 手 ở dưới.',['打','拍','看']],
['有水养鱼虾,有土种庄稼,有人不是你我,有马走遍天下','yǒu shuǐ yǎng yú xiā, yǒu tǔ zhòng zhuāngjia, yǒu rén bú shì nǐ wǒ, yǒu mǎ zǒu biàn tiānxià','Có nước nuôi cá tôm, có đất trồng lúa, có người không phải tôi và bạn, có ngựa đi khắp thiên hạ','也','yě','cũng','也 thêm 氵 = 池 (ao), thêm 土 = 地 (đất), thêm 亻 = 他 (anh ấy), thêm 马 = 驰 (phi ngựa).',['力','木','青']]];

const RADICALS=[
['女','子','好','hǎo','tốt','Phụ nữ bế con là điều tốt đẹp.'],
['日','月','明','míng','sáng','Mặt trời cộng mặt trăng thì sáng.'],
['亻','木','休','xiū','nghỉ','Người tựa vào gốc cây để nghỉ.'],
['木','木','林','lín','rừng','Hai cái cây thành rừng.'],
['氵','每','海','hǎi','biển','氵 là bộ nước.'],
['氵','可','河','hé','sông','氵 chỉ nghĩa, 可 gợi âm.'],
['艹','化','花','huā','hoa','艹 là bộ cỏ, 化 gợi âm.'],
['田','力','男','nán','đàn ông','Dùng sức (力) làm ruộng (田).'],
['门','口','问','wèn','hỏi','Mở miệng ở cửa để hỏi.'],
['火','丁','灯','dēng','đèn','火 là lửa, ngày xưa đèn dùng lửa.'],
['日','生','星','xīng','ngôi sao','日 chỉ nghĩa, 生 gợi âm.'],
['小','大','尖','jiān','nhọn','Trên nhỏ dưới to là cái đầu nhọn.'],
['小','土','尘','chén','bụi','Đất nhỏ li ti chính là bụi.'],
['相','心','想','xiǎng','nghĩ, nhớ','心 là tim, 相 gợi âm.'],
['日','青','晴','qíng','trời nắng','日 chỉ nghĩa, 青 gợi âm qing.'],
['讠','青','请','qǐng','mời','讠 là bộ lời nói, 青 gợi âm qing.']];

const MEASURE=[
['书','shū','sách','📘','本','běn'],['咖啡','kāfēi','cà phê','☕','杯','bēi'],['衣服','yīfu','áo','👕','件','jiàn'],
['鱼','yú','cá','🐟','条','tiáo'],['票','piào','vé','🎫','张','zhāng'],['猫','māo','mèo','🐱','只','zhī'],
['车','chē','xe','🚗','辆','liàng'],['鞋','xié','giày','👟','双','shuāng'],['公司','gōngsī','công ty','🏢','家','jiā'],
['面','miàn','mì','🍜','碗','wǎn'],['伞','sǎn','ô','☂️','把','bǎ'],['老师','lǎoshī','thầy cô','🧑‍🏫','位','wèi'],
['水','shuǐ','nước','🍶','瓶','píng'],['蛋糕','dàngāo','bánh','🍰','块','kuài'],['牛','niú','con bò','🐄','头','tóu'],
['笔','bǐ','bút','🖊️','支','zhī'],['电影','diànyǐng','bộ phim','🎬','部','bù'],['信','xìn','bức thư','✉️','封','fēng'],['课','kè','tiết học','🏫','节','jié'],['学校','xuéxiào','trường học','🎒','所','suǒ']];

const ORDERS=[
['我|今天|不|想|去|上班','wǒ jīntiān bù xiǎng qù shàngbān','Hôm nay tôi không muốn đi làm','不 đứng trước 想, không đứng sau.'],
['这|杯|奶茶|太|甜|了','zhè bēi nǎichá tài tián le','Ly trà sữa này ngọt quá','太…了 là cách nói "quá" tự nhiên nhất.'],
['他|比|我|高','tā bǐ wǒ gāo','Anh ấy cao hơn tôi','A 比 B + tính từ: A hơn B.'],
['请|把|门|关|上','qǐng bǎ mén guān shàng','Làm ơn đóng cửa lại','把 đưa vật lên trước động từ, câu HSK3 rất hay gặp.'],
['我的|手机|被|弟弟|拿走|了','wǒ de shǒujī bèi dìdi ná zǒu le','Điện thoại của tôi bị em trai lấy mất','被 là câu bị động: bị ai làm gì.'],
['天气|越来越|冷|了','tiānqì yuè lái yuè lěng le','Trời càng ngày càng lạnh','越来越 + tính từ: càng ngày càng.'],
['她|一边|听|音乐|一边|做饭','tā yìbiān tīng yīnyuè yìbiān zuòfàn','Cô ấy vừa nghe nhạc vừa nấu cơm','一边…一边…: vừa làm việc này vừa làm việc kia.'],
['虽然|很|累|但是|我|很|高兴','suīrán hěn lèi dànshì wǒ hěn gāoxìng','Tuy rất mệt nhưng tôi rất vui','虽然…但是…: tuy… nhưng…'],
['如果|明天|下雨|我们|就|不|去','rúguǒ míngtiān xiàyǔ wǒmen jiù bú qù','Nếu mai mưa thì chúng ta không đi','如果…就…: nếu… thì…'],
['这家|店|又|便宜|又|好吃','zhè jiā diàn yòu piányi yòu hǎochī','Quán này vừa rẻ vừa ngon','又…又…: vừa… vừa… dùng cho tính chất.'],
['除了|奶茶|我|还|喜欢|喝|咖啡','chúle nǎichá wǒ hái xǐhuan hē kāfēi','Ngoài trà sữa, tôi còn thích uống cà phê','除了…还…: ngoài… còn…'],
['他|不但|聪明|而且|很|努力','tā búdàn cōngming érqiě hěn nǔlì','Anh ấy không những thông minh mà còn rất chăm chỉ','不但…而且…: không những… mà còn…'],
['这个|菜|一点儿|也|不|辣','zhège cài yìdiǎnr yě bú là','Món này không cay chút nào','一点儿也不…: không… chút nào.'],
['我们|先|吃饭|再|看|电影','wǒmen xiān chīfàn zài kàn diànyǐng','Mình ăn cơm trước rồi xem phim','先…再…: làm việc này trước, rồi làm việc kia.'],
['我|跟|你|一样|高','wǒ gēn nǐ yíyàng gāo','Tôi cao bằng bạn','A 跟 B 一样 + tính từ: A … bằng B.'],
['电影|已经|开始|了','diànyǐng yǐjīng kāishǐ le','Phim đã bắt đầu rồi','已经…了: đã… rồi.'],
['你|吃|过|北京|烤鸭|吗','nǐ chī guo Běijīng kǎoyā ma','Bạn đã từng ăn vịt quay Bắc Kinh chưa','过 sau động từ: đã từng.']];

const CHAINS=[
'公司|gōngsī|công ty;司机|sījī|tài xế;机场|jīchǎng|sân bay;场地|chǎngdì|bãi, sân;地图|dìtú|bản đồ;图书|túshū|sách;书店|shūdiàn|hiệu sách;店员|diànyuán|nhân viên cửa hàng;员工|yuángōng|nhân viên;工作|gōngzuò|công việc;作业|zuòyè|bài tập',
'学校|xuéxiào|trường học;校长|xiàozhǎng|hiệu trưởng;长大|zhǎngdà|lớn lên;大家|dàjiā|mọi người;家人|jiārén|người nhà;人口|rénkǒu|dân số;口语|kǒuyǔ|khẩu ngữ;语言|yǔyán|ngôn ngữ',
'今天|jīntiān|hôm nay;天气|tiānqì|thời tiết;气温|qìwēn|nhiệt độ không khí;温度|wēndù|nhiệt độ;度假|dùjià|đi nghỉ;假期|jiàqī|kỳ nghỉ;期待|qīdài|mong đợi',
'学生|xuésheng|học sinh;生活|shēnghuó|cuộc sống;活动|huódòng|hoạt động;动物|dòngwù|động vật;物价|wùjià|vật giá;价格|jiàgé|giá cả'];

const CHATS=[
{t:'Mua trà sữa',e:'🧋',npc:'🧑‍🍳',who:'Nhân viên quán',s:[
['您好,想喝点儿什么?','nín hǎo, xiǎng hē diǎnr shénme?','Chào bạn, muốn uống gì?','我要一杯奶茶。','wǒ yào yì bēi nǎichá.','Cho tôi một ly trà sữa.',[['我是学生。','Tôi là học sinh.'],['我不饿。','Tôi không đói.']]],
['要大杯还是中杯?','yào dà bēi háishi zhōng bēi?','Ly lớn hay ly vừa?','大杯吧。','dà bēi ba.','Ly lớn đi.',[['三块钱。','Ba đồng.'],['我很大。','Tôi rất to.']]],
['甜度和冰呢?','tiándù hé bīng ne?','Độ ngọt và đá thì sao?','半糖,少冰。','bàn táng, shǎo bīng.','Nửa đường, ít đá.',[['很好吃。','Rất ngon.'],['没有问题。','Không vấn đề gì.']]],
['在这儿喝还是带走?','zài zhèr hē háishi dàizǒu?','Uống ở đây hay mang đi?','带走,谢谢。','dàizǒu, xièxie.','Mang đi, cảm ơn.',[['在北京。','Ở Bắc Kinh.'],['明天喝。','Mai uống.']]],
['一共十八块,扫这里就行。','yígòng shíbā kuài, sǎo zhèlǐ jiù xíng.','Tổng 18 tệ, quét ở đây là được.','好的,扫好了。','hǎo de, sǎo hǎo le.','Được, quét xong rồi.',[['我不喝了。','Tôi không uống nữa.'],['你几岁?','Bạn mấy tuổi?']]]]},
{t:'Đi taxi ra sân bay',e:'🚕',npc:'🧔',who:'Bác tài',s:[
['您好,手机尾号多少?','nín hǎo, shǒujī wěihào duōshao?','Chào bạn, số đuôi điện thoại là bao nhiêu?','尾号六六八八。','wěihào liù liù bā bā.','Số đuôi 6688.',[['我去机场。','Tôi ra sân bay.'],['手机很贵。','Điện thoại rất đắt.']]],
['是去机场吧?','shì qù jīchǎng ba?','Đi sân bay phải không?','对,师傅,我有点儿着急。','duì, shīfu, wǒ yǒudiǎnr zháojí.','Đúng rồi bác, tôi hơi vội.',[['我不喜欢机场。','Tôi không thích sân bay.'],['今天星期三。','Hôm nay thứ tư.']]],
['现在有点儿堵车,要四十分钟。','xiànzài yǒudiǎnr dǔchē, yào sìshí fēnzhōng.','Giờ hơi kẹt xe, mất 40 phút.','没事儿,来得及。','méishìr, láidejí.','Không sao, vẫn kịp.',[['我会开车。','Tôi biết lái xe.'],['四十块吗?','40 tệ à?']]],
['到了,您慢走!','dào le, nín màn zǒu!','Đến rồi, bạn đi cẩn thận nhé!','谢谢师傅!','xièxie shīfu!','Cảm ơn bác tài!',[['慢一点儿吃。','Ăn chậm thôi.'],['再来一碗。','Cho thêm một bát.']]]]},
{t:'Bạn rủ đi ăn lẩu',e:'🍲',npc:'👩',who:'Bạn trên WeChat',s:[
['周末有空吗?一起吃火锅吧!','zhōumò yǒu kòng ma? yìqǐ chī huǒguō ba!','Cuối tuần rảnh không? Đi ăn lẩu nhé!','好呀!几点?','hǎo ya! jǐ diǎn?','Được đó! Mấy giờ?',[['我没有锅。','Tôi không có nồi.'],['周末是星期六。','Cuối tuần là thứ bảy.']]],
['晚上七点怎么样?','wǎnshang qī diǎn zěnmeyàng?','7 giờ tối được không?','行,没问题。','xíng, méi wèntí.','Được, không vấn đề gì.',[['我七岁。','Tôi 7 tuổi.'],['晚上好。','Chào buổi tối.']]],
['你能吃辣吗?','nǐ néng chī là ma?','Bạn ăn cay được không?','能吃一点儿,微辣吧。','néng chī yìdiǎnr, wēi là ba.','Ăn được chút ít, cay nhẹ thôi.',[['我不会开车。','Tôi không biết lái xe.'],['太便宜了。','Rẻ quá.']]],
['那我订位子了!','nà wǒ dìng wèizi le!','Vậy mình đặt chỗ nhé!','好的,到时候见!','hǎo de, dào shíhou jiàn!','Ok, đến lúc đó gặp nhé!',[['你几岁了?','Bạn mấy tuổi rồi?'],['我吃饱了。','Tôi no rồi.']]]]}];
const SPEAK=[
['介绍个人情况','Giới thiệu bản thân','请介绍一下你自己。','qǐng jièshào yíxià nǐ zìjǐ.','Hãy giới thiệu về bản thân.','我是越南人,结婚了,现在在学习汉语。我觉得汉语很有意思。','wǒ shì Yuènán rén, jiéhūn le, xiànzài zài xuéxí Hànyǔ. wǒ juéde Hànyǔ hěn yǒu yìsi.','Tôi là người Việt, đã kết hôn, hiện đang học tiếng Trung. Tôi thấy tiếng Trung rất thú vị.','🙋'],
['谈论交通出行','Nói về đi lại','你平时怎么去上班?','nǐ píngshí zěnme qù shàngbān?','Bình thường bạn đi làm bằng gì?','我平时坐公交车上班,大概要三十分钟。如果路上车多,就可能迟到。','wǒ píngshí zuò gōngjiāochē shàngbān, dàgài yào sānshí fēnzhōng. rúguǒ lùshang chē duō, jiù kěnéng chídào.','Tôi thường đi xe buýt, khoảng 30 phút. Nếu đường đông xe thì có thể đến muộn.','🚌'],
['交流饮食情况','Nói về ăn uống','你喜欢吃什么?','nǐ xǐhuan chī shénme?','Bạn thích ăn gì?','我喜欢吃鱼,也喜欢喝奶茶。不过奶茶太甜了,所以我常常要半糖的。','wǒ xǐhuan chī yú, yě xǐhuan hē nǎichá. búguò nǎichá tài tián le, suǒyǐ wǒ chángcháng yào bàn táng de.','Tôi thích ăn cá, cũng thích uống trà sữa. Nhưng trà sữa ngọt quá nên tôi thường gọi nửa đường.','🍲'],
['谈论休闲生活','Nói về lúc rảnh','周末你一般做什么?','zhōumò nǐ yìbān zuò shénme?','Cuối tuần bạn thường làm gì?','周末我一般先打扫房间,然后跟朋友见面。有时候我们一起去公园走走。','zhōumò wǒ yìbān xiān dǎsǎo fángjiān, ránhòu gēn péngyou jiànmiàn. yǒu shíhou wǒmen yìqǐ qù gōngyuán zǒuzou.','Cuối tuần tôi thường dọn phòng trước, rồi gặp bạn bè. Đôi khi chúng tôi cùng ra công viên đi dạo.','🌳'],
['沟通学习情况','Nói về việc học','你觉得学汉语难吗?','nǐ juéde xué Hànyǔ nán ma?','Bạn thấy học tiếng Trung có khó không?','我觉得写汉字比较难,但是我不怕。只要每天练习,水平就会越来越高。','wǒ juéde xiě Hànzì bǐjiào nán, dànshì wǒ bú pà. zhǐyào měitiān liànxí, shuǐpíng jiù huì yuè lái yuè gāo.','Tôi thấy viết chữ Hán khá khó nhưng tôi không sợ. Chỉ cần luyện mỗi ngày, trình độ sẽ ngày càng cao.','✍️'],
['谈论居住情况','Nói về nơi ở','你住的地方怎么样?','nǐ zhù de dìfang zěnmeyàng?','Nơi bạn ở thế nào?','我住的小区很安静,环境也不错。附近有超市和公园,生活很方便。','wǒ zhù de xiǎoqū hěn ānjìng, huánjìng yě búcuò. fùjìn yǒu chāoshì hé gōngyuán, shēnghuó hěn fāngbiàn.','Khu tôi ở rất yên tĩnh, môi trường cũng tốt. Gần đó có siêu thị và công viên, sinh hoạt rất tiện.','🏘️'],
['谈论就医探病、健康观念','Nói về sức khỏe','你感冒了怎么办?','nǐ gǎnmào le zěnme bàn?','Bị cảm thì bạn làm gì?','感冒的时候,我多喝水,多休息。如果发烧了,我就去医院。','gǎnmào de shíhou, wǒ duō hē shuǐ, duō xiūxi. rúguǒ fāshāo le, wǒ jiù qù yīyuàn.','Khi bị cảm, tôi uống nhiều nước, nghỉ nhiều. Nếu sốt thì tôi đi bệnh viện.','🤒']];
const PASSAGES=[
['小王每天早上七点起床,先跑步,然后吃早饭。他坐地铁去公司,路上要四十分钟。','xiǎo Wáng měitiān zǎoshang qī diǎn qǐchuáng, xiān pǎobù, ránhòu chī zǎofàn. tā zuò dìtiě qù gōngsī, lùshang yào sìshí fēnzhōng.','Tiểu Vương mỗi sáng 7 giờ dậy, chạy bộ trước rồi ăn sáng. Anh ấy đi tàu điện ngầm đến công ty, mất 40 phút.',
 [['小王几点起床?','Tiểu Vương dậy lúc mấy giờ?',['七点','六点','八点']],['他怎么去公司?','Anh ấy đến công ty bằng gì?',['坐地铁','骑自行车','打车']]]],
['今天是妈妈的生日。我买了一个蛋糕,姐姐买了一条裙子。晚上我们一起去饭馆吃饭,妈妈很高兴。','jīntiān shì māma de shēngrì. wǒ mǎi le yí gè dàngāo, jiějie mǎi le yì tiáo qúnzi. wǎnshang wǒmen yìqǐ qù fànguǎn chīfàn, māma hěn gāoxìng.','Hôm nay là sinh nhật mẹ. Tôi mua một cái bánh kem, chị mua một chiếc váy. Tối cả nhà đi ăn ở quán, mẹ rất vui.',
 [['我买了什么?','"Tôi" đã mua gì?',['蛋糕','裙子','水果']],['晚上他们去哪儿?','Buổi tối họ đi đâu?',['饭馆','公园','超市']]]],
['我住的小区离地铁站不远,附近有超市和医院,生活很方便。不过房子有点儿小,所以明年我打算搬家。','wǒ zhù de xiǎoqū lí dìtiě zhàn bù yuǎn, fùjìn yǒu chāoshì hé yīyuàn, shēnghuó hěn fāngbiàn. búguò fángzi yǒudiǎnr xiǎo, suǒyǐ míngnián wǒ dǎsuàn bānjiā.','Khu tôi ở không xa ga tàu điện, gần đó có siêu thị và bệnh viện, sinh hoạt rất tiện. Nhưng nhà hơi nhỏ nên sang năm tôi định chuyển nhà.',
 [['小区离地铁站怎么样?','Khu nhà cách ga tàu điện thế nào?',['不远','很远','不知道']],['他为什么打算搬家?','Vì sao người này định chuyển nhà?',['房子有点儿小','房子太贵了','附近没有超市']]]]];
const TIPS=[
['你好吗?','nǐ hǎo ma?','最近怎么样?','zuìjìn zěnmeyàng?','Hỏi thăm người quen','你好吗 nghe như đang lo người ta có chuyện gì.','E'],
['我很好,谢谢。','wǒ hěn hǎo, xièxie.','还行。','hái xíng.','Trả lời khi được hỏi thăm','Người Trung thường đáp nhẹ, không khoe "rất khỏe".','E+C3'],
['是的。','shì de.','对。','duì.','Xác nhận nhanh','Hoặc lặp lại động từ: 你去吗?去。','E'],
['对不起。','duìbuqǐ.','不好意思。','bù hǎoyìsi.','Lỗi nhỏ, xin đi qua, làm phiền','对不起 nặng hơn, dành cho lỗi thật sự.','E'],
['不客气。','bú kèqi.','没事儿。','méishìr.','Đáp lại lời cảm ơn','Nghe thoải mái hơn, giữa bạn bè rất hay dùng.','E'],
['我明白了。','wǒ míngbai le.','懂了。','dǒng le.','Hiểu rồi','Trong mẫu đếm: 懂了 3 lần, 知道了 2 lần, 明白了 0 lần.','E+C'],
['非常好。','fēicháng hǎo.','挺好的。','tǐng hǎo de.','Khen vừa phải','Lối khen nhẹ, tự nhiên hơn 非常.','E+C3'],
['真的吗?','zhēn de ma?','真的假的?','zhēn de jiǎ de?','Ngạc nhiên','Dùng khi nói chuyện thân mật.','E'],
['再见。','zàijiàn.','我先走了。','wǒ xiān zǒu le.','Rời đi trước','Cũng hay nói 拜拜 với bạn bè.','E'],
['(im lặng để nghĩ)','','那个…就是…','nàge… jiùshì…','Câu giờ khi đang nghĩ','Trong mẫu đếm: 就是 55 lần, 那个 10 lần.','E+C'],
['什么?','shénme?','啥?','shá?','Bạn bè, người nhà','啥 gặp 22 lần trong mẫu đếm. Không dùng khi đi thi hay nói trang trọng.','C'],
['我有点儿累。','wǒ yǒudiǎnr lèi.','我有点累。','wǒ yǒudiǎn lèi.','Khi gõ chat','Trong mẫu đếm: 有点 20 lần, 有点儿 0 lần. 儿 đậm chất miền Bắc hơn.','C'],
['我觉得是这样。','wǒ juéde shì zhèyàng.','确实。','quèshí.','Đồng tình ngắn gọn','确实 gặp 9 lần trong mẫu đếm.','C'],
['你好,小王。','nǐ hǎo, xiǎo Wáng.','小王,吃了吗?','xiǎo Wáng, chī le ma?','Chào người quen','你好 chủ yếu dùng với người chưa thân. Người quen gọi tên rồi hỏi một câu.','H'],
['你去哪儿?','nǐ qù nǎr?','你去哪儿呀?','nǐ qù nǎr ya?','Câu nói thường ngày','Thêm 呀, 吧, 啊, 嘛 ở cuối câu nghe mềm hơn. Trong mẫu đếm: 吧 69 lần, 啊 38 lần.','C']];
const NATURAL=[
['我是越南人,结婚了,最近在学中文,挺有意思的。','wǒ shì Yuènán rén, jiéhūn le, zuìjìn zài xué Zhōngwén, tǐng yǒu yìsi de.'],
['我一般坐公交,差不多半个小时吧。要是车多,那就可能迟到了。','wǒ yìbān zuò gōngjiāo, chàbuduō bàn gè xiǎoshí ba. yàoshi chē duō, nà jiù kěnéng chídào le.'],
['我挺喜欢吃鱼的,奶茶也爱喝。不过太甜了,我一般点半糖。','wǒ tǐng xǐhuan chī yú de, nǎichá yě ài hē. búguò tài tián le, wǒ yìbān diǎn bàn táng.'],
['周末嘛,就先打扫一下房间,然后约朋友出去走走。','zhōumò ma, jiù xiān dǎsǎo yíxià fángjiān, ránhòu yuē péngyou chūqù zǒuzou.'],
['写汉字确实有点难,不过还好,每天练一练,慢慢就好了。','xiě Hànzì quèshí yǒudiǎn nán, búguò hái hǎo, měitiān liàn yi liàn, mànmàn jiù hǎo le.'],
['我住的小区挺安静的,旁边就有超市和公园,还挺方便的。','wǒ zhù de xiǎoqū tǐng ānjìng de, pángbiān jiù yǒu chāoshì hé gōngyuán, hái tǐng fāngbiàn de.'],
['感冒的话,就多喝点水,多休息。要是发烧了,那还是去医院吧。','gǎnmào dehuà, jiù duō hē diǎn shuǐ, duō xiūxi. yàoshi fāshāo le, nà háishi qù yīyuàn ba.']];
const HOA=[
['玫瑰','méigui','Hoa hồng','#FF4D6D','#FFD166',12,16,34],
['向日葵','xiàngrìkuí','Hướng dương','#FFC02E','#7A4A1E',16,9,36],
['荷花','héhuā','Hoa sen','#FF9EBB','#FFE27A',10,15,38],
['樱花','yīnghuā','Hoa anh đào','#FFC2D6','#FF7FA8',5,20,28],
['菊花','júhuā','Hoa cúc','#FFD84D','#F2A900',18,6,36],
['牡丹','mǔdān','Hoa mẫu đơn','#E8407A','#FFE27A',14,18,34],
['郁金香','yùjīnxiāng','Hoa tulip','#FF6B4A','#FFD166',6,17,38],
['兰花','lánhuā','Hoa lan','#B57BFF','#FFE27A',5,18,34],
['梅花','méihuā','Hoa mai','#FFE066','#F2A900',5,20,26],
['桃花','táohuā','Hoa đào','#FF8FB1','#E8407A',5,19,27],
['百合','bǎihé','Hoa ly','#FFFFFF','#FFC02E',6,13,40],
['茉莉花','mòlìhuā','Hoa nhài','#F7F7FF','#FFE27A',8,10,26],
['水仙','shuǐxiān','Hoa thủy tiên','#FFF4B8','#FF9F1C',6,16,30],
['杜鹃','dùjuān','Hoa đỗ quyên','#FF5C9E','#FFD6E5',5,21,30],
['桂花','guìhuā','Hoa quế','#FFB347','#FF8C00',4,20,20],
['康乃馨','kāngnǎixīn','Hoa cẩm chướng','#F15BB5','#FFD6EC',20,10,32]];
const LV={"丈夫":2,"妻子":2,"孩子":1,"哥哥":1,"姐姐":1,"弟弟":1,"妹妹":1,"朋友":1,"起床":1,"洗澡":3,"穿":1,"跑步":2,"锻炼":3,"跳舞":2,"休息":1,"旅游":2,"高兴":1,"累":2,"忙":1,"便宜":1,"贵":1,"远":2,"近":2,"快":2,"牛奶":1,"鸡蛋":1,"方便面":3,"西瓜":3,"蛋糕":3,"啤酒":3,"奶茶":2,"甜":3,"菜单":3,"饱":3,"筷子":3,"碗":3,"饿":3,"渴":3,"外卖":3,"请客":3,"超市":1,"裙子":3,"衬衫":3,"鞋":3,"换":3,"试":3,"信用卡":3,"合适":3,"地铁":2,"司机":3,"机场":2,"高铁":3,"护照":3,"行李":3,"迟到":3,"晚点":3,"附近":3,"左边":2,"右边":2,"旁边":2,"地图":3,"过":2,"楼":2,"电梯":3,"银行":3,"公园":3,"图书馆":3,"医院":1,"凉快":3,"季节":3,"晴":2,"伞":3,"作业":3,"考试":2,"成绩":3,"练习":3,"复习":3,"词典":3,"句子":3,"水平":3,"经理":3,"同事":3,"办公室":3,"会议":3,"开会":3,"请假":3,"休假":3,"邮件":3,"准备":2,"检查":3,"解决":3,"完成":3,"提高":3,"决定":3,"帮忙":2,"发现":3,"担心":3,"害怕":3,"生气":3,"着急":3,"难过":3,"满意":3,"相信":3,"关心":3,"差不多":3,"不好意思":2,"怎么办":3,"聊天儿":3,"拍照":3};
