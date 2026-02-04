# Linear MCP Plus - 개발 로그

AI 코딩 도구와 함께 진행한 개발 작업 기록입니다.

---

## 2026-02-03 (Day 0) — 문제 발견 & Fork 결정

### 0. Linear 이니셔티브 설계하다가 MCP 한계 발견

```
리니어 이니셔티브 조회해봐.
→ 비어있는게 맞아. 나랑 이제 리니어 이니셔티브랑 하위 프로젝트를 설계 같이해보자.
```

**OpenCode 작업 (prometheus, sisyphus):**
- 이니셔티브 3개 + 프로젝트 9개 대화형으로 설계
- Linear MCP로 이니셔티브/프로젝트 일괄 생성 성공
- **문제 발견**: 프로젝트 리드 설정하려는데 MCP에 해당 기능 없음!

---

### 1. 리드 업데이트 스크립트 직접 구현

```
각각 리드도 넣어줘야지. 그리고 각 세부 항목 아까 나랑 대화하면서 구체화한 내용들은 어딧니?
→ Linear MCP의 updateProject에서 리드(lead) 설정 기능이 없어요 😅
```

**OpenCode 작업:**
- Linear MCP에 `updateProject(leadId)` 파라미터 없음 확인
- `@linear/sdk`로 직접 스크립트 작성하여 9개 프로젝트 리드 일괄 설정
- `scripts/update-project-leads.ts` 생성

---

### 2. 기존 linear-toolkit 스크립트 분석

```
지금 리니어툴킷 이라는 플러그인 사용가능하지? 내가 만든건데 거기서 이미 스킬 만들 때도 
mcp로 없는 것들을 ts로 스크립트 만들었거든? 그 스크립트들 종류 좀 알려줄래?
```

**OpenCode 작업:**
- linear-toolkit 스킬 분석 (`/DEV/_skills/_deployed/linear-toolkit/`)
- MCP로 안 되는 기능들이 이미 스크립트로 구현되어 있었음:
  - `linear_api.py` → projectUpdateCreate, initiativeUpdateCreate
  - `create-doc.mjs` → documentCreate
- 언어가 py, mjs, ts 혼재되어 있는 문제 발견

---

### 3. state 버그 발견

```
응 근데 그 전에, 기존에 이 mcp에 버그가 있었던 거 같아. 
status 값을 {}로 반환한다고 햇어. 찾을 수 있니?
```

**OpenCode 작업:**
- linear-toolkit DEVLOG에서 버그 기록 발견
- `linear_getIssueById` 호출 시 `state: {}` 반환 확인
- 원인: `update-proj` 스킬에서 이슈 상태 확인이 안 되어 스크립트로 우회했던 것

---

### 4. Fork 결정 및 계획 수립

```
그러면 그것들을 기능으로 포함해서 mcp를 만들 수 있나? 현재 내가 쓰는 mcp가 오픈소스니?
→ @tacticlaunch/mcp-linear, MIT 라이선스, Fork 가능!
```

**OpenCode 작업 (prometheus):**
- Fork vs PR 논의 → **별도 패키지 배포**로 결정
- 패키지명: `@daht-mad/linear-mcp-plus`
- 배포: npm 공개 배포
- 테스트: 로컬 Linear 워크스페이스에서 직접 테스트
- 기존 스크립트: MCP 완성 후 판단

**추가할 기능 목록 확정:**
| 유형 | 항목 |
|------|------|
| 🐛 버그 | `state` 필드 `{}` 반환 |
| ✨ 기능 | `projectUpdateCreate` |
| ✨ 기능 | `initiativeUpdateCreate` |
| ✨ 기능 | `projectUpdate(leadId)` |
| ✨ 기능 | `documentCreate` |

---

### 5. 언어 통일 결정

```
근데 아까 어떤건 py, mjs, ts 등 스크립트가 제각각이었는데 어떤 걸로 통일해야할까?
https://github.com/anthropics/skills/tree/main/skills/mcp-builder 여기서 참고가 될까?
```

**OpenCode 작업:**
- Anthropic 공식 mcp-builder 스킬 문서 확인
- **권장 언어: TypeScript** (SDK 지원 좋음, AI 코드 생성에 유리)
- 기존 tacticlaunch/mcp-linear도 TypeScript → 그대로 유지 결정

---

## 2026-02-04 (Day 1)

### 1. 프로젝트 Fork 및 초기 설정

```
Linear MCP를 직접 쓰다보니 state 필드가 빈 객체로 반환되는 버그가 있어서,
tacticlaunch/mcp-linear를 fork해서 직접 고치기로 함
```

**Claude Code 작업:**
- `@tacticlaunch/mcp-linear` 레포지토리 fork
- 패키지명 변경: `@daht-mad/linear-mcp-plus`
- 506개 패키지 설치 및 빌드 확인
- `src/services/linear-service.ts` - Linear SDK 연동 분석

---

### 2. State 버그 수정 (핵심!)

```
issue.state가 {}로 반환되는 문제
- linear_getIssueById로 이슈 조회하면 state가 빈 객체로 나옴
- "In Progress"인지 "Done"인지 알 수가 없어서 프로젝트 관리가 안됨
```

**Claude Code 작업:**
- 버그 원인 분석: Linear SDK의 `issue.state`가 Promise 기반 관계형 필드
- 기존 코드는 Promise를 await 하지 않고 직접 반환해서 빈 객체가 됨
- `searchIssues()` 메서드에서 정상 동작하는 패턴 발견
- `getIssues()`와 `getIssueById()` 메서드에 동일 패턴 적용

```typescript
// Before (버그):
return { state: issue.state }  // → {}

// After (수정):
const stateData = issue.state ? await issue.state : null;
return { state: stateData ? { id, name, color, type } : null }  // → 정상 데이터
```

- `src/services/linear-service.ts` - getIssues(), getIssueById() 수정 (+22, -2 lines)

---

### 3. initiativeUpdateCreate 도구 추가

```
이니셔티브 업데이트 작성 기능이 필요
- 기존에 Python 스크립트로 만들어서 썼는데, MCP로 통합하고 싶음
- Linear SDK에 해당 메서드가 없어서 GraphQL 직접 사용 필요
```

**Claude Code 작업:**
- GraphQL mutation 직접 구현 (`client.client.rawRequest()`)
- Tool Definition, Type Guard, Handler, Service Method 4개 파일 작업
- health 파라미터 지원: onTrack, atRisk, offTrack, complete
- `src/tools/definitions/initiative-tools.ts` - 도구 정의 추가
- `src/tools/type-guards.ts` - 입력 검증 추가
- `src/tools/handlers/initiative-handlers.ts` - 핸들러 구현
- `src/services/linear-service.ts` - createInitiativeUpdate() 메서드 추가

---

### 4. updateProjectLead 도구 추가

```
프로젝트 리드 지정/해제 기능
- 여러 프로젝트의 리드를 한 번에 바꿔야 할 때가 있음
- AI한테 "이 프로젝트들 리드 Alice로 바꿔줘" 하면 편함
```

**Claude Code 작업:**
- nullable leadId 지원 (리드 제거 가능)
- JSON Schema에서 `type: ['string', 'null']` 사용
- 기존 `projectUpdate` mutation 활용
- `src/tools/definitions/project-tools.ts` - 도구 정의
- `src/tools/handlers/project-handlers.ts` - 핸들러 (+142 lines)

---

### 5. documentCreate 도구 추가

```
Linear 문서 생성 기능
- 프로젝트에 연결된 문서를 AI로 바로 만들고 싶음
- Linear SDK에 없어서 GraphQL 직접 사용
```

**Claude Code 작업:**
- GraphQL `documentCreate` mutation 구현
- 선택적으로 프로젝트에 연결 가능 (`projectId` optional)
- 새 파일 2개 생성:
  - `src/tools/definitions/document-tools.ts`
  - `src/tools/handlers/document-handlers.ts`

---

### 6. getProjectUpdates 도구 추가

```
프로젝트 업데이트 조회 기능
- 업데이트 작성은 되는데 기존 업데이트 조회가 안 됨
- 이전에 뭘 썼는지 확인하고 이어서 쓰고 싶음
```

**Claude Code 작업:**
- `linear_getProjectUpdates` 도구 구현
- 프로젝트 ID로 업데이트 목록 조회
- limit 파라미터로 개수 제한 가능

---

### 7. README 문서화

```
fork한 이유와 추가된 기능들 문서화
- "Why This Fork Exists" 섹션 추가
- 버그 원인과 해결책 기술
- 새 도구들 사용법 정리
```

**Claude Code 작업:**
- 문제 상황, 해결책, 코드 예시 포함한 상세 설명
- 4개 새 도구 테이블 추가
- 설치 가이드 업데이트 (claude mcp add 명령어)
- `README.md` - 전면 재작성

---

### 8. README 설치 가이드 개선

```
이거 리드미 좀 개선할래 리니어 api토큰을 저.zshrc에 하는 게 맞아?
리니어를 전역설치 하는 경우에 어디에 저장하는게 맞아?
```

**Claude Code 작업:**
- 토큰 저장 위치 분석: `.zshrc` vs `.mcp.json` 비교
- **결론**: `.mcp.json`의 `env` 섹션에 저장하는 것이 표준
  - 쉘 환경 오염 방지
  - MCP 서버별로 토큰 분리 가능 (회사 Linear vs 개인 Linear)
- Quick Start 섹션을 상단으로 이동
- `claude mcp add` 명령어 대신 직접 설정 파일 편집 권장으로 변경
- 토큰 저장 위치 안내 추가: "Always store your token in the `env` section of `.mcp.json`"

---

### 9. documentCreate 도구 실전 테스트

```
[넥스트증권 바이브코딩 스킬 워크숍] 여기에 curriculum.md 이 문서를 resource로 업로드 하고 싶어
```

**Claude Code 작업 (linear_documentCreate 도구 사용):**
- 새로 추가한 `linear_documentCreate` 도구 실전 테스트
- 워크샵 커리큘럼 마크다운을 Linear 문서로 생성
- 프로젝트 ID와 연결하여 리소스 탭에 표시
- 결과: 성공! 프로젝트에 문서가 정상적으로 연결됨

---

### 8. npm 배포 및 CI 설정

```
npm에 공개 패키지로 배포
- @daht-mad/linear-mcp-plus로 배포
- GitHub Actions로 자동 배포 파이프라인
```

**Claude Code 작업:**
- 버전 1.0.13 → 1.0.14 → 1.0.15 릴리즈
- GitHub Actions workflow 설정 (tag push → auto publish)
- `.github/workflows/publish.yml` 수정
- `package.json` - publishConfig access: public 설정

---

### 9. 로컬 테스팅 및 디버깅

```
빌드는 되는데 실제로 도구들이 작동하는지 확인 필요
- LSP 진단으로 누락된 서비스 메서드 발견
- 핸들러는 있는데 서비스 레이어 구현이 빠진 것들 있었음
```

**Claude Code 작업:**
- LSP diagnostics로 TypeScript 에러 발견
- 3개 서비스 메서드 누락 확인 → 구현 완료
- 빌드 + 런타임 테스트 통과 확인
- `.sisyphus/notepads/linear-mcp-plus/learnings.md` - 트러블슈팅 기록

---

## 커밋 히스토리

| 날짜 | 커밋 | 설명 |
|------|------|------|
| 02/04 | `ca2518c` | chore: fork from tacticlaunch/mcp-linear |
| 02/04 | `59e84d6` | fix: include state field in issue queries |
| 02/04 | `9748030` | feat: add initiativeUpdateCreate tool |
| 02/04 | `c140497` | feat: add updateProjectLead tool |
| 02/04 | `4d67fa9` | feat: add documentCreate tool |
| 02/04 | `24809f1` | feat: add linear_getProjectUpdates tool |
| 02/04 | `2d00e33` | docs: update README for fork with new features |
| 02/04 | `73841bb` | docs: add background story and technical details |
| 02/04 | `896ab3b` | 1.0.13 |
| 02/04 | `5d0abfe` | ci: auto-publish on tag push |
| 02/04 | `fda2ea9` | docs: improve installation guide |

---

## 기술 스택

- **Language**: TypeScript
- **Runtime**: Node.js >= 20.0.0
- **Protocol**: Model Context Protocol (MCP)
- **API**: Linear GraphQL API
- **SDK**: @linear/sdk v38.0.0, @modelcontextprotocol/sdk v1.6.0
- **Build**: tsc (TypeScript compiler)
- **CI/CD**: GitHub Actions

---

## 주요 기능

1. **State 버그 수정**
   - Linear SDK의 Promise 기반 관계형 필드 올바르게 처리
   - getIssues(), getIssueById()에서 state 정상 반환

2. **4개 신규 도구**
   - `linear_projectUpdateCreate` - 프로젝트 업데이트 작성 (health 상태 포함)
   - `linear_initiativeUpdateCreate` - 이니셔티브 업데이트 작성
   - `linear_documentCreate` - 문서 생성 (프로젝트 연결 선택)
   - `linear_updateProjectLead` - 프로젝트 리드 지정/해제

3. **npm 배포**
   - `@daht-mad/linear-mcp-plus`로 공개 배포
   - `npx -y @daht-mad/linear-mcp-plus`로 바로 사용 가능
