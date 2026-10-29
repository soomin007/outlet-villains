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
// 콘센트는 판 밖 -1번 줄의 벽에 붙는다. 열은 빌런과 같고, villain.outletX가 있으면 그 열이다(유튜버는 테이블 위 폰과 링 조명을 가리지 않게 옆으로 뺐다).
// 레벨의 bg는 배경 그림 이름(bg-이름)이다. 배경에는 테이블과 화분이 그려져 있으므로, 같은 배경을 쓰는 레벨은 T, L, V, * 자리가 같아야 한다(tools/verify.html이 확인한다).
// view가 있는 레벨은 카메라 화각 규칙을 쓴다(engine.js 머리말). chairNeeded가 true인 레벨은 의자를 밀지 않으면 풀리지 않아야 한다(검증한다).
// kind는 tutorial(새 요소를 안전하게 보여 줌, 망치는 첫 수가 없어야 함) 또는 puzzle(함정이 있어야 함, 걸을 수 있는 칸 35칸 이하)이다(docs/level-design.md).
// N은 앉아 있는 손님, o는 카페 테이블이다. 둘 다 움직이지 않는 칸이고 판을 좁히며 카페가 붐비는 것을 보여 준다. 손님은 이웃한 테이블(o, T) 쪽을 본다.
// 플레이 영역 둘레만 손님과 테이블로 막고, 닿을 수 없는 나머지는 바닥으로 둔다(2026-10-29 사용자 요청). 그림이 오기 전에는 상자로 보인다.
// demo는 그 레벨에서 처음 나오는 기믹을 반투명한 주인공이 한 번 시연할 자리다(kind: push는 물건 밀기, view는 화각에 들어갔다 되돌아오기).
window.VILLAIN_LAYOUT = {
  "art": { "width": 1920, "height": 1080, "tile": 96, "originX": 384, "originY": 240, "columns": 12, "rows": 7, "uiTop": 912, "viewBottom": 880 },
  "sprite": { "personWidthTiles": 1, "personHeightTiles": 1.5 },
  "chapters": [
    {
      "id": "sleeper",
      "name": "잠든 카공족",
      "lines": ["멀티탭을 끌어안고 엎드려 잠들었다. 콘센트는 저 멀티탭 차지다.", "주문한 음료 진동벨이 귀 옆에서 울리면 깰 텐데."],
      "villain": { "idle": "villain-sleep", "react": "villain-wake", "portrait": "villain-portrait", "heightTiles": 2.5, "anchorRow": 1 }
    },
    {
      "id": "streamer",
      "name": "공부 영상 촬영자",
      "lines": ["폰을 세워 두고 몇 시간째 스터디 윗 미 영상을 찍는 중이다. 폰과 조명은 벽 콘센트에 꽂혀 있다.", "화면에 지저분한 게 잡히면 촬영을 접을 텐데."],
      "villain": { "idle": "streamer-idle", "react": "streamer-react", "portrait": "streamer-portrait", "heightTiles": 1.5, "anchorRow": 0, "outletX": 7 }
    }
  ],
  "levels": [
    {
      "id": "sleeper-1",
      "chapter": "sleeper",
      "bg": "sleeper",
      "kind": "tutorial",
      "optimal": 7,
      "pushes": 5,
      "demo": { "kind": "push", "from": { "x": 4, "y": 2 }, "dir": "right" },
      "map": [
        ".....oLL.LV.",
        "...oNNNoL*T.",
        "...NPb....N.",
        ".TT.NNNN..N.",
        ".TT.ooooNNo.",
        ".......LL...",
        "............"
      ]
    },
    {
      "id": "sleeper-2",
      "chapter": "sleeper",
      "bg": "sleeper",
      "kind": "tutorial",
      "optimal": 7,
      "pushes": 6,
      "map": [
        ".....oLL.LV.",
        "...oNNNoL*T.",
        "...NPb....N.",
        ".TT.NNoNc.N.",
        ".TT.oooN.No.",
        ".......LL...",
        "............"
      ]
    },
    {
      "id": "sleeper-3",
      "chapter": "sleeper",
      "bg": "sleeper",
      "kind": "puzzle",
      "optimal": 19,
      "pushes": 6,
      "map": [
        ".....oLL.LV.",
        "...oNNNoL*T.",
        "...N......N.",
        ".TTN....bcNo",
        ".TTNP.....N.",
        "....NNNLLNo.",
        "....ooo....."
      ]
    },
    {
      "id": "sleeper-4",
      "chapter": "sleeper",
      "bg": "sleeper",
      "kind": "puzzle",
      "optimal": 28,
      "pushes": 11,
      "map": [
        "...oooLL.LV.",
        "...NNNNoL*T.",
        "..N..c.c..N.",
        ".TTN.b.o..No",
        ".TTN.P....N.",
        "..oN..NLLNo.",
        "..oN..o....."
      ]
    },
    {
      "id": "sleeper-5",
      "chapter": "sleeper",
      "bg": "sleeper",
      "kind": "puzzle",
      "optimal": 35,
      "pushes": 15,
      "map": [
        "..ooooLL.LV.",
        "..NNNNNoL*T.",
        ".N..c.P.....",
        ".TTN..o...N.",
        ".TTN..c.b.oN",
        "..oN..oLL.N.",
        "..oN....Noo."
      ]
    },
    {
      "id": "streamer-1",
      "chapter": "streamer",
      "bg": "streamer",
      "optimal": 6,
      "pushes": 2,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "....LTL.....",
        "L....V....L.",
        "............",
        "..t.........",
        "............",
        "............",
        "P..........."
      ]
    },
    {
      "id": "streamer-2",
      "chapter": "streamer",
      "bg": "streamer",
      "optimal": 17,
      "pushes": 6,
      "view": { "dir": "down", "width": 3 },
      "demo": { "kind": "view", "from": { "x": 3, "y": 2 }, "dir": "right" },
      "map": [
        "....LTL.....",
        "L....V....L.",
        "............",
        "....ccc.....",
        "............",
        ".........t..",
        "P..........."
      ]
    },
    {
      "id": "streamer-3",
      "chapter": "streamer",
      "bg": "encore",
      "optimal": 19,
      "pushes": 7,
      "chairNeeded": true,
      "view": { "dir": "down", "width": 3 },
      "map": [
        "....LTL.....",
        "....LVL.....",
        "...L...L....",
        "....c.c.....",
        ".....c......",
        ".....t......",
        "P..........."
      ]
    }
  ]
};
