const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const INITIALS = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

function isSyllable(code: number) {
  return code >= HANGUL_START && code <= HANGUL_END;
}

// 검색어 글자 하나가 이름 글자 하나에 맞는지 본다.
// - 초성(ㅎ)은 그 초성으로 시작하는 음절(홍)에 맞는다.
// - 받침 없는 음절(호)은 받침만 다른 음절(홍)에 맞는다. 입력 중인 마지막 글자가 "호"일 때도 "홍"이 보이게 하려는 것이다.
function matchesChar(nameChar: string, keywordChar: string) {
  if (nameChar === keywordChar) return true;
  const name = nameChar.charCodeAt(0);
  if (!isSyllable(name)) return false;

  const initialIndex = INITIALS.indexOf(keywordChar);
  if (initialIndex !== -1) return Math.floor((name - HANGUL_START) / 588) === initialIndex;

  const keyword = keywordChar.charCodeAt(0);
  if (!isSyllable(keyword) || (keyword - HANGUL_START) % 28 !== 0) return false;
  return Math.floor((name - HANGUL_START) / 28) === Math.floor((keyword - HANGUL_START) / 28);
}

// 이름 어디에든 검색어가 이어서 들어 있으면 맞는다. 예: "ㅎㄱ", "길동", "홍기"는 모두 "홍길동"에 맞는다.
export function matchName(name: string, keyword: string) {
  const query = keyword.replace(/\s/g, "");
  if (!query) return false;
  for (let start = 0; start + query.length <= name.length; start++) {
    if ([...query].every((char, i) => matchesChar(name[start + i], char))) return true;
  }
  return false;
}
