// 콘센트 빌런 도감의 규칙. 목표 문장은 CLAUDE.md "확정한 방향", 콘셉트는 docs/concept.md에 있다.
// 플레이어는 카페 바닥을 한 칸씩 자유롭게 걷고, 시행착오에는 벌칙이 없다(되돌리기와 처음부터는 언제든 공짜).
//
// 첫 판 "잠든 카공족"의 규칙(시제품에서 정한 것이라 바꿀 수 있다):
//   1. 상호작용할 수 있는 물건(진동벨, 의자)은 소코반처럼 한 칸씩 민다. 앞이 막히면 밀리지 않는다.
//   2. 화분과 테이블과 카운터는 배경이라 움직이지 않는다.
//   3. 진동벨을 잠든 빌런의 귀 옆 칸(*)에 밀어다 놓으면 진동벨이 울리고, 빌런이 깨어나 충전기를 챙겨 떠난다. 판을 깬다.
//
// 둘째 판 "라이브 방송 유튜버"의 규칙. 판 정의에 view가 있으면 이 규칙을 쓴다.
//   4. 유튜버는 테이블 위 폰 카메라를 보며 방송 중이라, 방송 화면에는 빌런 등 뒤의 카페가 비친다. 그 화각은 빌런 뒤로 뻗은 세 줄이다.
//      화각은 줄마다 처음 닿는 물건이나 사람에서 멈춘다. 그래서 의자 뒤는 화면에 비치지 않는 그늘이 된다.
//   5. 내가 화각에 들어가면 방송에 잡힐 뻔한 것이라, 벌칙 없이 그 걸음이 없던 일이 된다.
//      이유(2026-10-31 사용자 결정): 쓰레기통을 미는 로봇이 찍히면 촬영자는 로봇의 짓인 줄 알고 로봇만 쫓아내고 자리는 지킨다.
//      손님이 스스로 떠나게 하려면(목표 문장) 쓰레기통이 우연히 화면에 들어온 것처럼 보여야 한다.
//   6. 쓰레기통이 화각에 비치면 유튜버가 방송을 접고 충전기를 챙겨 자리를 옮긴다. 판을 깬다.
//
// 셋째 판 "합석"의 규칙(2026-10-30). 판에 F(촬영자)가 있으면 화각은 빌런이 아니라 촬영자 뒤로 뻗는다.
//   7. 목표는 1장처럼 진동벨을 잠든 빌런의 귀 옆 칸(*)에 놓는 것이다. 촬영자의 화각은 들어갈 수 없는 장애물이다.
//   8. 쓰레기통이 촬영자의 화각에 비치면 촬영자가 촬영을 접고 떠나서 화각이 사라진다(state.gone). 판은 끝나지 않는다.
//
// 물 쏟은 바닥의 규칙(2026-10-31 사용자 선택, 회색 상자 시험 중).
//   9. 젖은 칸(w)에 밀린 물건은 젖은 칸 위에 있는 동안 같은 방향으로 계속 미끄러진다. 마른 칸에 들어서거나 앞이 막히면 멈춘다.
//  10. 로봇이 젖은 칸을 밟으면 닦여서 마른 바닥이 된다(state.wet에서 빠진다). 로봇 자신은 미끄러지지 않는다.
//      그래서 젖은 줄은 물건을 멀리 보내는 길이 되고, 닦은 칸은 물건이 멈추는 자리가 된다.
//
// 음료 배달의 규칙(2026-10-31 사용자 선택, 회색 상자 시험 중).
//  11. 음료(1, 2, 3)는 의자처럼 민다. 픽업을 기다리며 서 있는 손님(A, B, C)은 길을 막는다. 숫자와 글자가 짝이다(1은 A의 음료).
//  12. 음료가 제 손님의 옆 칸(위아래 좌우)에 놓이면 손님이 음료를 받아 들고 자리로 돌아간다. 음료와 손님이 함께 사라져(gone) 그 칸이 열린다.
//
// 지도 글자: 배경(움직이지 않음)은 T 테이블, L 화분, # 그 밖의 벽. N 앉은 손님, o 카페 테이블, q 소품(모두 움직이지 않고, 배경이 아니라 따로 그린 그림을 게임이 얹는다).
// . 바닥, P 나, V 빌런, F 촬영자(셋째 판, 움직이지 않음), b 진동벨, c 의자, t 쓰레기통, * 진동벨을 놓을 칸,
// w 젖은 바닥, 1 2 3 음료, A B C 음료를 기다리는 손님
// 배경 글자를 나눠 둔 것은 배치 안내 그림(make-guide.py)이 그 칸에 무엇을 그릴지 알게 하려는 것이다. 규칙에서는 셋 다 벽이다.
(function (root) {
  'use strict';

  const DIRECTIONS = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
  };

  function parseLevel(definition) {
    const walls = new Set();
    let player = null;
    let villain = null;
    let goal = null;
    let filmer = null;
    const items = [];
    const wet = [];
    const waiters = [];
    definition.map.forEach((line, y) => {
      [...line].forEach((char, x) => {
        if (char === '#' || char === 'T' || char === 'L' || char === 'N' || char === 'o' || char === 'q') walls.add(`${x},${y}`);
        else if (char === 'P') player = { x, y };
        else if (char === 'V') villain = { x, y };
        else if (char === 'F') filmer = { x, y };
        else if (char === '*') goal = { x, y };
        else if (char === 'b') items.push({ kind: 'buzzer', x, y });
        else if (char === 'c') items.push({ kind: 'chair', x, y });
        else if (char === 't') items.push({ kind: 'trash', x, y });
        else if (char === 'w') wet.push(`${x},${y}`);
        else if ('123'.includes(char)) items.push({ kind: 'drink', order: 'ABC'['123'.indexOf(char)], x, y });
        else if ('ABC'.includes(char)) waiters.push({ order: char, x, y });
        else if (char !== '.') throw new Error(`${definition.id}: 모르는 지도 글자 '${char}'`);
      });
    });
    if (!player || !villain) throw new Error(`${definition.id}: P와 V가 하나씩 있어야 합니다`);
    if (!goal && !definition.view) throw new Error(`${definition.id}: 진동벨을 놓을 칸(*)이나 화각(view) 중 하나가 있어야 합니다`);
    items.filter((item) => item.kind === 'drink').forEach((drink) => {
      if (!waiters.some((waiter) => waiter.order === drink.order)) throw new Error(`${definition.id}: 음료 ${drink.order}를 받을 손님이 없습니다`);
    });
    const start = { player, items, facing: 'down' };
    if (filmer) start.gone = false;
    if (wet.length > 0) start.wet = wet.sort();
    return {
      ...definition,
      width: definition.map[0].length,
      height: definition.map.length,
      walls,
      villain,
      goal,
      filmer,
      waiters,
      start,
    };
  }

  function blocked(level, x, y) {
    return level.walls.has(`${x},${y}`) || x < 0 || y < 0 || x >= level.width || y >= level.height
      || (level.villain.x === x && level.villain.y === y);
  }

  // 사라진 물건(손님이 받아 간 음료)은 판에 없는 것으로 본다.
  function itemIndexAt(items, x, y) {
    return items.findIndex((item) => !item.gone && item.x === x && item.y === y);
  }

  // 아직 음료를 받지 못한 손님. 손님은 제 음료가 사라지면(gone) 함께 떠난다.
  function waiterAt(level, state, x, y) {
    return level.waiters.some((waiter) => waiter.x === x && waiter.y === y
      && !state.items.some((item) => item.kind === 'drink' && item.order === waiter.order && item.gone));
  }

  // 벽과 빌런에 더해, 지금 상태에서 길을 막는 손님과 아직 떠나지 않은 촬영자까지 본다.
  // 촬영자가 떠난 자리는 열린다. 예전에는 촬영자 그림만 사라지고 칸은 계속 막혀 보이지 않는 벽이 됐다(known-issues 22번).
  function blockedNow(level, state, x, y) {
    const filmerHere = level.filmer && !state.gone && level.filmer.x === x && level.filmer.y === y;
    return blocked(level, x, y) || waiterAt(level, state, x, y) || Boolean(filmerHere);
  }

  function isWet(state, x, y) {
    return state.wet !== undefined && state.wet.includes(`${x},${y}`);
  }

  // 카메라 화각. 빌런(촬영자가 있으면 촬영자) 뒤로 view.dir 방향을 따라 view.width 줄이 뻗고, 줄마다 처음 닿는 것에서 멈춘다.
  // cells는 화면에 비치는 칸들이고, hits는 줄마다 처음 닿은 것('player', 'trash', 'chair' 등)이다. 촬영자가 떠났으면 화각이 없다.
  function viewOf(level, state) {
    if (!level.view || state.gone) return { cells: [], hits: [] };
    const origin = level.filmer || level.villain;
    const d = DIRECTIONS[level.view.dir];
    const side = { dx: d.dy, dy: d.dx };
    const half = Math.floor(level.view.width / 2);
    const cells = [];
    const hits = [];
    for (let offset = -half; offset <= half; offset++) {
      let x = origin.x + d.dx + side.dx * offset;
      let y = origin.y + d.dy + side.dy * offset;
      let hit = null;
      while (!blockedNow(level, state, x, y)) {
        cells.push({ x, y });
        if (state.player.x === x && state.player.y === y) {
          hit = 'player';
          break;
        }
        const index = itemIndexAt(state.items, x, y);
        if (index >= 0) {
          hit = state.items[index].kind;
          break;
        }
        x += d.dx;
        y += d.dy;
      }
      hits.push(hit);
    }
    return { cells, hits };
  }

  // 한 걸음. 막혔으면 몸만 그쪽으로 돌린다(벌칙 없이 제자리). pushed는 민 물건의 번호다.
  // 화각에 들어가는 걸음이면 seen이 true이고, 상태는 바뀌지 않는다(attempted에 내디딘 모습이 있다).
  function step(level, state, direction) {
    const d = DIRECTIONS[direction];
    const tx = state.player.x + d.dx;
    const ty = state.player.y + d.dy;
    const turned = { ...state, facing: direction };
    if (blockedNow(level, state, tx, ty)) return { moved: false, state: turned, won: false };
    const index = itemIndexAt(state.items, tx, ty);
    let items = state.items;
    let slid = 0;
    if (index >= 0) {
      let px = tx + d.dx;
      let py = ty + d.dy;
      const free = (x, y) => !blockedNow(level, state, x, y) && itemIndexAt(state.items, x, y) < 0;
      if (!free(px, py)) return { moved: false, state: turned, won: false };
      // 젖은 칸 위에서는 마른 칸에 들어서거나 막힐 때까지 미끄러진다.
      while (isWet(state, px, py) && free(px + d.dx, py + d.dy)) {
        px += d.dx;
        py += d.dy;
        slid += 1;
      }
      items = state.items.map((item, i) => (i === index ? { ...item, x: px, y: py } : item));
    }
    // 음료가 제 손님 옆에 놓이면 손님이 받아 간다.
    let served = null;
    if (index >= 0 && items[index].kind === 'drink') {
      const drink = items[index];
      const waiter = level.waiters.find((candidate) => candidate.order === drink.order);
      if (Math.abs(waiter.x - drink.x) + Math.abs(waiter.y - drink.y) === 1) {
        items = items.map((item, i) => (i === index ? { ...item, gone: true } : item));
        served = drink.order;
      }
    }
    const next = { player: { x: tx, y: ty }, items, facing: direction };
    if (level.filmer) next.gone = state.gone;
    // 로봇이 밟은 젖은 칸은 닦인다.
    let mopped = false;
    if (state.wet !== undefined) {
      mopped = isWet(state, tx, ty);
      next.wet = mopped ? state.wet.filter((cell) => cell !== `${tx},${ty}`) : state.wet;
    }
    const view = viewOf(level, next);
    if (view.hits.includes('player')) return { moved: false, seen: true, state: turned, attempted: next, won: false };
    // 셋째 판: 쓰레기통이 촬영자의 화각에 비치면 촬영자가 떠난다. 판은 계속된다.
    let filmerLeft = false;
    if (level.filmer && !next.gone && view.hits.includes('trash')) {
      next.gone = true;
      filmerLeft = true;
    }
    return { moved: true, pushed: index >= 0 ? index : null, slid, served, mopped, state: next, won: won(level, next), filmerLeft };
  }

  // 진동벨 자리(*)가 있는 판은 진동벨을 그 자리에 놓으면 이긴다. 없으면(둘째 판) 쓰레기통이 화각에 비치면 이긴다.
  function won(level, state) {
    if (level.goal) return state.items.some((item) => item.kind === 'buzzer' && !item.gone && item.x === level.goal.x && item.y === level.goal.y);
    return viewOf(level, state).hits.includes('trash');
  }

  function stateKey(state) {
    const items = state.items.map((item) => (item.gone ? `${item.kind}${item.order}-` : `${item.kind}${item.order || ''}${item.x},${item.y}`)).sort().join(';');
    return `${state.player.x},${state.player.y}|${items}|${state.gone ? 1 : 0}|${state.wet ? state.wet.join(';') : ''}`;
  }

  // 너비 우선 탐색으로 최소 걸음 수를 찾는다. pushes는 그 해법에서 민 횟수다. 해법이 없으면 moves가 null이다.
  function solve(level, limit = 400000) {
    // 걸음 목록을 상태마다 복사하지 않고, 앞 상태 번호와 마지막 방향만 적어 두었다가 풀리면 거꾸로 따라가 해법을 만든다(긴 판의 메모리 절약).
    const states = [level.start];
    const parents = [-1];
    const directions = [null];
    const pushCounts = [0];
    const seen = new Set([stateKey(level.start)]);
    const pathTo = (index, last) => {
      const path = [last];
      for (let at = index; parents[at] !== -1; at = parents[at]) path.push(directions[at]);
      return path.reverse();
    };
    for (let head = 0; head < states.length && seen.size < limit; head++) {
      for (const direction of Object.keys(DIRECTIONS)) {
        const result = step(level, states[head], direction);
        if (!result.moved) continue;
        const pushes = pushCounts[head] + (result.pushed !== null ? 1 : 0);
        if (result.won) {
          const path = pathTo(head, direction);
          return { moves: path.length, pushes, path };
        }
        const key = stateKey(result.state);
        if (seen.has(key)) continue;
        seen.add(key);
        states.push(result.state);
        parents.push(head);
        directions.push(direction);
        pushCounts.push(pushes);
      }
    }
    return { moves: null, pushes: null, path: null };
  }

  const api = { DIRECTIONS, parseLevel, viewOf, step, won, solve, stateKey, isWet, waiterAt, blockedAt: blockedNow };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VillainEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
