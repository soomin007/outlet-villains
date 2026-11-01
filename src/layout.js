// 콘센트 빌런 도감 화면 배치의 유일한 기준. 게임 화면(index.html)과 배치 안내 그림(tools/make-guide.py)이 모두 이 숫자를 읽는다.
// 아래 = 기호 사이는 JSON이어야 한다(Python이 그대로 읽는다). 주석과 끝 쉼표를 넣지 않는다.
//
// 시점은 RPG Maker(쯔꾸르)처럼 위에서 살짝 비스듬히 본 시점이다. 바닥 칸은 화면과 나란한 정사각형이고, 소실점이 없다(2026-10-29 사용자 결정).
// 그림 좌표는 1920 x 1080이고 칸 하나는 96px이다. 게임은 이것을 960 x 540 장면으로 줄여 그리므로 장면에서 칸은 48px이다.
// 판은 가로 12칸, 세로 7칸(1152 x 672px)이고 왼쪽 위 모서리가 (384, 240)이다. 판 위쪽 0~240px은 카페 안쪽 벽과 카운터,
// 판 아래쪽 912~1080px은 버튼 줄 자리, 판 좌우 0~384px과 1536~1920px은 카페 옆벽과 창이다.
// 버튼은 결국 장면 위쪽에 놓였고, 배경 그림은 모두 y 880 아래를 어두운 띠로 그렸다. 그래서 게임은 viewBottom(880) 아래를 잘라 내고 보여 준다.
// 사람 그림은 칸 하나 너비에 칸 하나 반 높이(96 x 144px)이고, 발이 칸 아래쪽에 닿는다. 그림 파일은 그 두 배로 그린다.
//
// 게임은 챕터와 레벨로 나눈다(2026-10-29 사용자 결정). 챕터 하나가 빌런 한 명이고, 레벨마다 새 요소를 하나씩만 더한다.
// chapters의 villain은 빌런 그림 key 세 가지(평소, 반응, 반응 일러스트)와 그림 크기(heightTiles), 그림 아래쪽이 닿는 칸(anchorRow, 빌런 칸 기준)이다.
// name과 lines는 챕터를 시작할 때 뜨는 빌런 소개 글이다. lines의 첫 줄은 콘센트를 놓지 않는 이유, 둘째 줄은 약점이다(docs/concept.md의 빌런 후보 표).
// lines의 {중괄호} 안은 줄을 바꾸지 않는 묶음이다. 화면 폭에 따라 "화상 / 회의", "꽂혀 / 있다"처럼 구절 중간에서 꺾여서, 320px 폭에서도 한 줄에 드는 짧은 구절만 묶는다(2026-11-02).
// 콘센트는 판 밖 -1번 줄의 벽에 붙는다. 열은 빌런과 같고, villain.outletX가 있으면 그 열이다(2장은 판 안 충전 독 바로 위인 6열, 2026-11-01).
// 레벨의 bg는 배경 그림 이름(bg-이름)이다. 배경에는 테이블과 화분이 그려져 있으므로, 같은 배경을 쓰는 레벨은 T, L, V, * 자리가 같아야 한다(tools/verify.html이 확인한다).
// view가 있는 레벨은 카메라 화각 규칙을 쓴다(engine.js 머리말). F(촬영자)가 있는 레벨은 화각이 촬영자 뒤로 뻗고, 쓰레기통이 비치면 촬영자가 떠난다(셋째 챕터).
// 챕터의 filmer는 F에 그릴 촬영자 그림이다. maxWalk는 퍼즐 레벨의 걸을 수 있는 칸 상한(기본 35)을 넓은 레벨에서 바꾼다. chairNeeded가 true인 레벨은 의자를 밀지 않으면 풀리지 않아야 한다(검증한다).
// kind는 tutorial(새 요소를 안전하게 보여 줌, 망치는 첫 수가 없어야 함) 또는 puzzle(함정이 있어야 함, 걸을 수 있는 칸 35칸 이하)이다(docs/level-design.md).
// N은 앉아 있는 손님, o는 카페 테이블, q는 화분이나 짐 같은 소품이다. 모두 움직이지 않는 칸이고 판을 좁히며 카페가 붐비는 것을 보여 준다.
// 손님은 이웃한 테이블(o를 먼저, 없으면 T) 쪽을 본다. 손님은 함께 쓰는 테이블에 둘러앉히고, 한 칸짜리 테이블에 한 명씩 붙이지 않는다(2026-10-29 사용자 피드백).
// 플레이 영역 둘레만 막고 닿을 수 없는 나머지는 바닥으로 두며, 플레이 영역 안의 외딴 한 칸은 소품으로 막는다. 그림이 오기 전에는 상자로 보인다.
// demo는 그 레벨에서 처음 나오는 기믹을 반투명한 주인공이 한 번 시연할 자리다(kind: push는 물건 밀기, view는 화각에 들어갔다 되돌아오기,
// slide는 젖은 바닥에서 미끄러지기, serve는 음료 건네기).
// interior가 true인 레벨은 가구 없는 배경(bg-이름-empty) 위에 테이블, 화분, 손님을 모두 소품으로 얹는다(2026-10-31 시험, 지금은 13판 모두). 2장도 1장, 3장과 같은 카페의 빈 배경을 쓴다(2026-11-01 사용자 결정).
// interior 레벨에서는 위 규칙과 달리, 판에 필요 없는 칸(닿을 수 없는 바닥, 구석을 메우던 손님과 소품)을 벽(#)으로 채운다(2026-11-01 사용자 결정).
// 벽 높이와 자리는 회색 상자 목업으로 확인받은 뒤 지도에 넣는다(docs/concept.md "2026-11-01 결정"). 판 밖은 배경의 벽과 맞닿아 있어 벽으로 이어 본다.
// D는 로봇의 충전 독이다. 빌런 자리 옆 칸에 두고, 판을 깨기 전에는 화분처럼 막힌 칸이며, 빌런이 떠나면 로봇이 스스로 굴러가 올라앉는다(2026-10-31 사용자 결정).
// 독은 원래 막힌 칸(화분 L이나 소품 q)이던 자리에 놓아 판의 풀이가 바뀌지 않게 한다. D가 없는 판은 예전처럼 콘센트 옆 벽 아래에 독을 그린다.
// decor는 구석을 꾸미는 카페 가구다. 그 칸들은 지도에서 q로 막고, (x, y)부터 가로 w칸에 높이 h칸(칸 높이 배수)짜리 그림 하나를 놓는다.
// w는 젖은 바닥, 1 2 3은 음료, A B C는 그 음료를 기다리며 서 있는 손님이다(engine.js 머리말 9~12번 규칙). 1장 레벨 3~5는 젖은 바닥, 2장 레벨 4~5는 음료 배달을 쓴다(2026-10-31 사용자 결정).
//
// title은 메인 화면 배치다(2026-11-01 사용자 확정, docs/concept.md "목업 2차"). desk는 1920 x 1080 판, phone은 세로 화면용 375 x 812 판이고, 숫자는 그 판의 px다.
// bands의 wallBottom은 위 층(흐르는 카페 벽)이 끝나는 y, cupboardTop은 아래 층(흐르는 찬장)이 시작하는 y이고, 그 사이가 로봇이 딛는 바닥이다. 글자와 버튼은 바닥 층에만 둔다.
// floor는 바닥 무늬다(2026-11-01 사용자 결정, 목업 tools/mock-floor.html). 굽도리(baseboard) 아래로 첫 줄 높이 firstRow에서 줄마다 rowGrowth배로 커지는 가로줄과,
// 타일 폭 tileWidth마다 높이 1에 가로 slant만큼 눕힌 세로줄을 그린다. 바닥은 위 띠와 아래 띠 속도의 가운데로 흐른다(1920 판에서 초속 240px).
// 회색 면만 두고 멈춰 두자 로봇이 선 곳이 바닥으로 읽히지 않았다. shadow는 로봇 상자에 대한 그림자 타원의 자리와 크기 비율이다.
// counter는 아래 층 찬장의 윗면 두께(px)다. 찬장을 앞면만 그려 두께가 없자, 위에서 비스듬히 본 바닥과 어긋나 바닥 앞 끝이 읽히지 않았다(2026-11-01 사용자 지적).
// 윗면은 cupboardTop 위로 counter만큼 바닥을 덮는다. 로봇은 발이 바닥 앞 끝에 붙지 않게 올려(1920 판 발 y 830), 로봇 앞에도 바닥이 보이게 했다.
// 로고는 도감 줄을 뺀 뒤 버튼 묶음(y 420~800)과 가운데 높이(y 610)를 맞췄다. 세로 판은 도감이 빠져 아래 바닥이 110px 비어서,
// 로봇, 로고, 버튼을 28px 내려 무리의 가운데(y 397)가 바닥 가운데(y 421)보다 조금 위에 오게 했다(시각 중심은 기하 중심보다 조금 위다).
// 빌런 도감 줄은 뺐다(2026-11-01 사용자 결정). 만난 빌런은 위 띠의 이스터에그가 보여 준다.
// loopSeconds는 띠 한 장이 제 폭만큼 흐르는 시간이다. 처음에는 예전 카페 띠(초속 80px)의 0.5배와 1.5배(위 48초, 아래 16초)였고,
// 사용자가 훨씬 빠르게 해 달라고 해서 세 배로 올렸다(2026-11-01). 위 띠는 초속 120px(1920px에 16초), 아래 띠는 초속 360px(1920px에 5.33초)다.
// logo의 logoWidth는 받침 안 로고 폭이고, 받침 크기는 badge 비율로 정한다. bang은 로고 그림(1120 x 640) 속 느낌표 배터리의 빈칸이고, cycle초마다 빨강, 노랑, 초록으로 차오른다.
// egg는 위 띠(1920 x 380) 속 이스터에그 자리다. Codex가 비워 둔 빈 벽면(x 780~1140)의 가운데에 키 320px로 세운다.
window.VILLAIN_LAYOUT = {
  "art": { "width": 1920, "height": 1080, "tile": 96, "originX": 384, "originY": 240, "columns": 12, "rows": 7, "uiTop": 912, "viewBottom": 880 },
  "sprite": { "personWidthTiles": 1, "personHeightTiles": 1.5 },
  "title": {
    "desk": {
      "size": [1920, 1080],
      "bands": { "wallBottom": 380, "cupboardTop": 920 },
      "robot": { "x": 260, "y": 350, "w": 394, "h": 480 },
      "logo": { "x": 731, "y": 451, "logoWidth": 480 },
      "menu": { "x": 1340, "y": 420, "w": 340, "h": 80, "gap": 20, "font": 32 },
      "floor": { "tileWidth": 160, "firstRow": 34, "rowGrowth": 1.33, "slant": 0.35, "baseboard": 18 },
      "counter": 28
    },
    "phone": {
      "size": [375, 812],
      "bands": { "wallBottom": 96, "cupboardTop": 756 },
      "robot": { "x": 128, "y": 130, "w": 120, "h": 120 },
      "logo": { "x": 41, "y": 258, "logoWidth": 250 },
      "menu": { "x": 38, "y": 434, "w": 300, "h": 52, "gap": 8, "font": 20 },
      "floor": { "tileWidth": 64, "firstRow": 14, "rowGrowth": 1.33, "slant": 0.35, "baseboard": 8 },
      "counter": 10
    },
    "strips": { "wall": { "width": 1920, "height": 380, "loopSeconds": 16 }, "cupboard": { "width": 1920, "height": 160, "loopSeconds": 5.33 } },
    "egg": { "centerX": 960, "height": 320, "floorY": 488, "art": 512 },
    "shadow": { "left": -0.02, "width": 0.76, "bottom": -0.04, "height": 0.08 },
    "badge": { "padX": 0.06, "padY": 0.08, "border": 0.04, "radius": 0.12, "nubW": 0.05, "nubH": 0.4 },
    "bang": { "x": 987, "y": 366, "w": 50, "h": 122, "logoW": 1120, "logoH": 640, "cycle": 3 }
  },
  "chapters": [
    {
      "id": "sleeper",
      "name": "잠든 카공족",
      "lines": ["{멀티탭을 끌어안고} {엎드려 잠들었다.} {콘센트는} {저 멀티탭 차지다.}", "{주문한 음료 진동벨이} {귀 옆에서} {울리면 깰 텐데.}"],
      "villain": { "idle": "villain-sleep", "react": "villain-wake", "portrait": "villain-portrait", "heightTiles": 2.5, "anchorRow": 1 }
    },
    {
      "id": "streamer",
      "name": "화상 회의 손님",
      "lines": ["{노트북 카메라를 켜고} {몇 시간째} {화상 회의 중이다.} {노트북과} {폰 충전기가} {벽 콘센트에} {꽂혀 있다.}", "{카메라 뒤에} {지저분한 게} {비치면} {자리를 옮길 텐데.}"],
      "villain": { "idle": "streamer-idle", "react": "streamer-react", "portrait": "streamer-portrait", "heightTiles": 1.5, "anchorRow": 0, "outletX": 6 }
    },
    {
      "id": "together",
      "name": "합석",
      "lines": ["{잠든 카공족} {옆 테이블에} {화상 회의 손님이} {앉았다.} {회의 화면에} {잡히면 안 된다.}", "{화상 회의 손님을} {먼저 보내야} {진동벨을} {가져다줄 수 있을 텐데.}"],
      "villain": { "idle": "villain-sleep", "react": "villain-wake", "portrait": "villain-portrait", "heightTiles": 2.5, "anchorRow": 1 },
      "filmer": { "idle": "streamer-idle", "react": "streamer-react", "face": "streamer-face", "heightTiles": 1.5 }
    }
  ],
  "levels": [
    {
      "id": "sleeper-1",
      "chapter": "sleeper",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "tutorial",
      "optimal": 7,
      "pushes": 5,
      "demo": { "kind": "push", "from": { "x": 4, "y": 2 }, "dir": "right" },
      "map": [
        "#####NLq#DV#",
        "####NooNL*TN",
        "#NNqPb....No",
        "NTTNNNNN..No",
        "NTT#ooooNq#N",
        "#NN#NNNLL###",
        "qqq########q"
      ],
      "decor": [
        { "x": 7, "y": 0, "key": "decor-bookshelf", "w": 1, "h": 2 },
        { "x": 0, "y": 6, "key": "decor-selfbar", "w": 3, "h": 1.5 },
        { "x": 11, "y": 6, "key": "decor-return", "w": 1, "h": 1.5 }
      ]
    },
    {
      "id": "sleeper-2",
      "chapter": "sleeper",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "tutorial",
      "optimal": 7,
      "pushes": 6,
      "map": [
        "#####NLq#DV#",
        "####NooNL*TN",
        "#NNqPb....No",
        "NTTNNNNNc.No",
        "NTT#oooo.q#N",
        "#NN#NNNLL###",
        "qqq########q"
      ],
      "decor": [
        { "x": 7, "y": 0, "key": "decor-bookshelf", "w": 1, "h": 2 },
        { "x": 0, "y": 6, "key": "decor-selfbar", "w": 3, "h": 1.5 },
        { "x": 11, "y": 6, "key": "decor-return", "w": 1, "h": 1.5 }
      ]
    },
    {
      "id": "sleeper-3",
      "chapter": "sleeper",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "tutorial",
      "optimal": 8,
      "pushes": 1,
      "demo": { "kind": "slide", "from": { "x": 9, "y": 6 }, "dir": "up" },
      "map": [
        "#####NLq#DV#",
        "####NooNL*TN",
        "#NNqNooNqwNo",
        "NTTNNooNqwNo",
        "NTTqqooqqwNo",
        ".NNqqNNLLbqN",
        "..Pwww......"
      ],
      "decor": [
        { "x": 7, "y": 0, "key": "decor-bookshelf", "w": 1, "h": 2 }
      ]
    },
    {
      "id": "sleeper-4",
      "chapter": "sleeper",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "puzzle",
      "optimal": 24,
      "pushes": 6,
      "map": [
        "#####NLq#DV#",
        "####NooNL*TN",
        "#NNqNooNqwNo",
        "NTTPbwwwwwwN",
        "NTT.......No",
        "#NNqNNNLL.qN",
        "qqqNooooNqqq"
      ],
      "decor": [
        { "x": 7, "y": 0, "key": "decor-bookshelf", "w": 1, "h": 2 },
        { "x": 0, "y": 6, "key": "decor-selfbar", "w": 3, "h": 1.5 },
        { "x": 11, "y": 6, "key": "decor-return", "w": 1, "h": 1.5 }
      ]
    },
    {
      "id": "sleeper-5",
      "chapter": "sleeper",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "puzzle",
      "optimal": 18,
      "pushes": 5,
      "chairNeeded": true,
      "map": [
        "#####NLq#DV#",
        "####NooNL*TN",
        "#NNqNooNqwNo",
        "NTT.bwcwwwwN",
        "NTT...qq..No",
        "#NNP..NLLqqN",
        "qqqNooooNqqq"
      ],
      "decor": [
        { "x": 7, "y": 0, "key": "decor-bookshelf", "w": 1, "h": 2 },
        { "x": 0, "y": 6, "key": "decor-selfbar", "w": 3, "h": 1.5 },
        { "x": 11, "y": 6, "key": "decor-return", "w": 1, "h": 1.5 }
      ]
    },
    {
      "id": "streamer-1",
      "chapter": "streamer",
      "bg": "sleeper-empty", "interior": true,
      "kind": "tutorial",
      "optimal": 5,
      "pushes": 1,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "####LTL#####",
        "####qVD#####",
        "##oN...Nooo#",
        "##oN...qNNN#",
        "##oN...t...o",
        "####NNNNNq.N",
        "####oooooNPq"
      ]
    },
    {
      "id": "streamer-2",
      "chapter": "streamer",
      "bg": "sleeper-empty", "interior": true,
      "kind": "tutorial",
      "optimal": 13,
      "pushes": 4,
      "view": { "dir": "down", "width": 3 },
      "demo": { "kind": "view", "from": { "x": 3, "y": 2 }, "dir": "right" },
      "map": [
        "####LTLoo###",
        "###oNVDNN###",
        "##o......No#",
        "#qN.ccc..No#",
        "o.....t...No",
        "NP........No",
        "#NooNNooNq##"
      ]
    },
    {
      "id": "streamer-3",
      "chapter": "streamer",
      "bg": "sleeper-empty", "interior": true,
      "kind": "puzzle",
      "optimal": 22,
      "pushes": 7,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "####LTLooo##",
        "#oooNVDNNN##",
        "#NNNc..q..q#",
        "o....c..q..o",
        "N.toc......N",
        "qP.N...o...q",
        "#oNq...NoNq#"
      ]
    },
    {
      "id": "streamer-4",
      "chapter": "streamer",
      "bg": "sleeper-empty", "interior": true,
      "kind": "tutorial",
      "optimal": 7,
      "pushes": 1,
      "view": { "dir": "down", "width": 3 },
      "demo": { "kind": "serve", "from": { "x": 3, "y": 4 }, "dir": "right" },
      "map": [
        "....LTLooo##",
        "L..oNVDqNN##",
        "..oN...Nooo#",
        "..oNqAqqNN##",
        "q...1.qNooNo",
        "q.NoNtNNNqqN",
        "q..P.oooooNq"
      ]
    },
    {
      "id": "streamer-5",
      "chapter": "streamer",
      "bg": "sleeper-empty", "interior": true,
      "kind": "puzzle",
      "maxWalk": 40,
      "optimal": 30,
      "pushes": 9,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "####LTL#oo##",
        "####LVD#NN##",
        "##qL...L..q#",
        ".q..qB.q...o",
        "o..1..cA2..N",
        "N.qP.t.N.q.o",
        "q......o...N"
      ]
    },
    {
      "id": "together-1",
      "chapter": "together",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "puzzle",
      "maxWalk": 45,
      "optimal": 24,
      "pushes": 10,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "##ooooLL#DV#",
        "##NNNN.oL*T#",
        "#N....qF..N#",
        "#TT..t.....o",
        "#TT........N",
        "o...b..LL..o",
        "NP.........N"
      ]
    },
    {
      "id": "together-2",
      "chapter": "together",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "puzzle",
      "maxWalk": 45,
      "optimal": 34,
      "pushes": 13,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "##ooooLL#DV#",
        "##NNNN.oL*T#",
        "#N....qF..N#",
        "#TT......t.o",
        "#TT.b......N",
        "o......LL..o",
        "NP.........N"
      ]
    },
    {
      "id": "together-3",
      "chapter": "together",
      "bg": "sleeper-empty",
      "interior": true,
      "kind": "puzzle",
      "maxWalk": 45,
      "optimal": 48,
      "pushes": 25,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "##ooooLL#DV#",
        "##NNNN.oL*T#",
        "#N....qF..N#",
        "#TT.....q..o",
        "#TT.b.....cN",
        "o...q..LLt.o",
        "NP.........N"
      ]
    }
  ]
};
