/**
 * 포트폴리오 마이그레이션 스크립트
 * 기존 interohrigin.com/html/sub_2.jsp의 51개 포트폴리오를 Firestore에 시딩합니다.
 *
 * 사용법:
 *   node scripts/migrate-portfolio.cjs
 *
 * 사전 조건:
 *   - Firebase Admin 서비스 계정 키 파일 경로를 SERVICE_ACCOUNT_PATH에 설정
 */

const admin = require('firebase-admin');

// ⚠️ 실행 전 서비스 계정 키 경로를 변경하세요
const SERVICE_ACCOUNT_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/home/user/new_key.json';

try {
  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'interohrigin-ir-c398b',
  });
} catch {
  // 이미 초기화된 경우
  if (!admin.apps.length) {
    console.error('Firebase Admin 초기화 실패. SERVICE_ACCOUNT_PATH를 확인하세요:', SERVICE_ACCOUNT_PATH);
    process.exit(1);
  }
}

const db = admin.firestore();
const BASE = 'http://interohrigin.com';

/** 포트폴리오 데이터 — 기존 사이트에서 추출 */
const portfolioData = [
  {
    brandName: '컴포즈커피',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2025-09-09 11_32_341.jpg`,
    heroImage: `${BASE}/upload/2025-09-09 11_32_342.jpg`,
    description: '- 컴포즈커피 X 2024MAMA AWARDS 티켓 프로모션 진행',
    galleries: [{ label: 'Promotion', label_en: 'Promotion', images: [`${BASE}/upload/213.jpg`, `${BASE}/upload/314.jpg`, `${BASE}/upload/412.jpg`, `${BASE}/upload/58.jpg`] }],
  },
  {
    brandName: '정관장 아이패스',
    categories: ['PPL', 'Online'],
    thumbnail: `${BASE}/upload/2025-06-12 19_04_151.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '푸라닭 치킨',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-13 10_20_161.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '교촌치킨',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-12 18_25_441.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'Nespresso',
    categories: ['PPL', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2025-06-13 09_51_111.png`,
    heroImage: `${BASE}/upload/2025-08-20 09_09_132.JPG`,
    description: "- 유튜브 '셰프 안성재' 브랜디드 콘텐츠 제작\n- JTBC 드라마 '에스콰이어' 간접광고 진행\n- 2025 SUMMER CAMPAIGN SNS 마케팅 진행\n- 팝업스토어 '버츄오 하우스' SNS 마케팅 진행\n- JTBC 드라마 '굿보이' 간접광고 진행\n- JTBC 드라마 '협상의 기술' 간접광고 진행\n- tvN 드라마 '눈물의 여왕' 간접광고 진행\n- MBC '나혼자산다' 간접광고 진행\n- 유튜브 '요정재형' 브랜디드 콘텐츠 제작\n- SBS 예능 '미운우리새끼' 간접광고 진행\n- SBS 드라마 '7인의 탈출' 간접광고 진행\n- 유튜브 '살롱드립2' 브랜디드 콘텐츠 제작\n- 유튜브 '어메이징 엄정화TV' 브랜디드 콘텐츠 제작\n- TVING 예능 '브로마블' 간접광고 진행\n- JTBC 드라마 '킹더랜드' 간접광고 진행\n- 유튜브 '꽉잡아윤기' 브랜디드 콘텐츠 제작\n- JTBC 예능 '최강야구' 간접광고 진행\n- SBS 예능 '수학없는 수학여행' 간접광고 진행\n- JTBC 드라마 '대행사' 간접광고 진행\n- 유튜브 '14F - 돈슐랭' 브랜디드 콘텐츠 제작\n- 유튜브 '기우쌤' 브랜디드 콘텐츠 제작\n- JTBC 드라마 '디엠파이어 법의 제국' 간접광고 진행\n- tvN 드라마 '아다마스' 간접광고 진행\n- 유튜브 '14F - 원두쓰리' 브랜디드 콘텐츠 제작\n- JTBC 드라마 '그린마더스클럽' 간접광고 진행",
    galleries: [
      { label: 'PPL', label_en: 'PPL', images: [`${BASE}/upload/05.jpg`, `${BASE}/upload/32.png`, `${BASE}/upload/13.png`] },
      { label: 'SNS Marketing', label_en: 'SNS Marketing', images: [`${BASE}/upload/114.png`, `${BASE}/upload/16.png`] },
    ],
  },
  {
    brandName: 'LEXUS',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-13 10_50_301.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '정관장 홍이장군',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 09_10_581.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '정관장 천녹',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 09_26_151.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '정관장 에브리타임',
    categories: ['SNS Marketing'],
    thumbnail: `${BASE}/upload/2020-08-24 11_32_491.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '정관장 화애락 이너제틱',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2025-06-18 09_36_011.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'MASERATI',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-13 10_56_331.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'MINI',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-13 10_39_131.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'BREITLING',
    categories: ['PPL', 'Star Marketing', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2019-10-25 22_54_081.gif`,
    heroImage: `${BASE}/upload/2019-10-25 22_54_082.png`,
    description: "- tvN 토일드라마 '알함브라궁전의 추억' 간접광고 및 배우 현빈 독점 스타마케팅 진행\n- tvN 수목드라마 '진심이 닿다' 간접광고 및 배우 이동욱 독점 스타마케팅 진행",
    galleries: [
      { label: 'Star Marketing', label_en: 'Star Marketing', images: [`${BASE}/upload/breitlinghyunbin 1.png`, `${BASE}/upload/breitlinghyunbin 2.png`, `${BASE}/upload/breitlinglee dong wook1.png`, `${BASE}/upload/breitlinglee dong wook2.png`] },
    ],
  },
  {
    brandName: 'BMW',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-13 10_44_311.jpg`,
    heroImage: `${BASE}/upload/2019-10-02 14_00_272.jpg`,
    description: "- JTBC 드라마 '맨투맨' 간접광고 진행\n- SBS 드라마 '사랑의 온도' 간접광고 진행\n- SBS 드라마 '결혼계약' 간접광고 진행\n- SBS 드라마 '다섯손가락' 간접광고 진행\n- i8 로드스터 온라인 마케팅 진행\n- MBC 드라마 '맨도롱 또똣' 간접광고 진행\n- BMW 라이프스타일 온라인 바이럴 진행",
    galleries: [
      { label: 'PPL', label_en: 'PPL', images: [`${BASE}/upload/bmwlove1.jpg`, `${BASE}/upload/bmwlove2.jpg`] },
    ],
  },
  {
    brandName: 'DFESTA BGC',
    categories: ['Promotion', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2025-09-09 16_52_331.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '라컬렉타',
    categories: ['PPL', 'Star Marketing', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2025-08-25 17_26_071.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '필립섬유',
    categories: ['PPL', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2025-07-03 11_31_571.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '일동제약 퍼스트랩',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 17_16_271.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '일동제약 비오비타',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 17_06_121.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '한독 레디큐',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 16_51_291.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'HAND AND MALT',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2021-12-09 18_01_491.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'Genie Music',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-13 11_01_221.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'Play Station 5',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2021-04-22 14_13_191.png`,
    heroImage: `${BASE}/upload/2021-04-22 14_13_192.png`,
    description: "- JTBC '선배, 그 립스틱 바르지 마요' 제작지원 및 간접 광고 진행\n- MBC '전지적 참견 시점' 간접 광고 진행\n- 유튜브 '앙고', '한스', '오피니언'PPL 콘텐츠 제작\n- 간접 광고 콘텐츠를 활용한 SNS 마케팅 진행",
    galleries: [
      { label: 'PPL', label_en: 'PPL', images: [`${BASE}/upload/ClipboardImage_2021-04-14_101558.png`, `${BASE}/upload/2.png`, `${BASE}/upload/22.JPG`] },
      { label: 'Online', label_en: 'Online', images: [`${BASE}/upload/blog9.jpg`, `${BASE}/upload/blog14.jpg`, `${BASE}/upload/insta8.jpg`, `${BASE}/upload/insta16.jpg`] },
    ],
  },
  {
    brandName: '라온피플',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-20 11_16_221.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'JTBC 월화 드라마 선배, 그 립스틱 바르지 마요',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 09_46_011.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '정관장 굿베이스 홍삼담은 석류스틱',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2021-03-23 12_13_011.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'SWISSMISS',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2021-03-05 16_51_161.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'Bassetts',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2021-02-26 17_59_591.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'OCN 토일 드라마 경이로운 소문',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2025-06-18 09_48_501.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'PATAGONIA BOHEMIAN PILSENER',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2021-01-26 12_24_291.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: "영화 '인플루언서'",
    categories: ['Promotion'],
    thumbnail: `${BASE}/upload/2021-01-27 16_21_131.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'Shemonbred',
    categories: ['PPL', 'Online'],
    thumbnail: `${BASE}/upload/2020-10-28 18_09_591.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'OCN 토일드라마 미씽 : 그들이 있었다',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2021-03-30 15_22_351.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '리을',
    categories: ['Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2020-09-24 17_07_441.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'OCN 토일드라마 트레인',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2020-09-15 12_20_561.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'GOOSE ISLAND',
    categories: ['PPL', 'Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2021-12-30 18_58_501.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'KBS2 월화드라마 그놈이 그놈이다',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2020-09-03 16_57_371.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'OCN 토일드라마 루갈',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2020-08-28 17_44_561.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'IMUZ',
    categories: ['Online', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2020-09-03 15_39_081.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '정관장 홍삼톤골드',
    categories: ['PPL', 'Online'],
    thumbnail: `${BASE}/upload/2020-01-29 11_22_561.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'AZH',
    categories: ['PPL', 'Online'],
    thumbnail: `${BASE}/upload/2025-06-18 09_37_141.JPG`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'Instantpot',
    categories: ['PPL', 'Online'],
    thumbnail: `${BASE}/upload/2019-11-13 13_55_191.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: '퇴근후&',
    categories: ['Promotion', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2019-11-12 13_28_201.gif`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'FRESHEASY',
    categories: ['Star Marketing', 'PPL', 'SNS Marketing', 'Online', 'AD'],
    thumbnail: `${BASE}/upload/2019-11-08 20_06_511.gif`,
    heroImage: `${BASE}/upload/2019-11-07 18_03_222.png`,
    description: "- 프레시지 광고모델 배우 '염정아' 선정\n- tvN 예능 '삼시세끼 산촌편' 제작지원 및 간접광고 진행\n- 프로그램 라이선스를 활용한 제품 기획 및 오픈마켓 커머스 진행\n- '삼시세끼' 풋티지 광고 제작, 영상 및 지면 광고 진행\n- 간접광고 콘텐츠를 활용한 SNS 마케팅 진행\n- CJ ENM 푸트유튜버 및 TVING SMR 광고 진행",
    galleries: [
      { label: 'PPL', label_en: 'PPL', images: [`${BASE}/upload/a31.png`, `${BASE}/upload/a21.png`, `${BASE}/upload/a11.png`] },
      { label: 'Online', label_en: 'Online', images: [`${BASE}/upload/onlineinsta.png`, `${BASE}/upload/onlineblog.png`] },
    ],
  },
  {
    brandName: 'FARMACY',
    categories: ['PPL', 'SNS Marketing'],
    thumbnail: `${BASE}/upload/2019-11-07 17_49_061.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'FORTNITE',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2019-10-25 23_11_081.gif`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'GALAXY WATCH3',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2019-10-25 22_37_461.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'LOVCAT',
    categories: ['PPL'],
    thumbnail: `${BASE}/upload/2019-10-06 16_58_141.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'NAVER CLOVA',
    categories: ['PPL', 'Online'],
    thumbnail: `${BASE}/upload/2019-10-06 16_35_121.jpg`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'BANOBAGI',
    categories: ['Online'],
    thumbnail: `${BASE}/upload/2019-10-02 19_59_251.png`,
    heroImage: '',
    description: '',
    galleries: [],
  },
  {
    brandName: 'TIROL CHOCO',
    categories: ['Online', 'Star Marketing', 'AD'],
    thumbnail: `${BASE}/upload/2019-10-02 19_56_561.png`,
    heroImage: `${BASE}/upload/2019-10-02 19_56_562.png`,
    description: "- 일본의 장수 브랜드인 티롤초코의 전속모델 공승연을 선정\n- '모찌 초콜릿' 이라는 제품 특성을 강조한 온라인 바이럴 영상 제작\n- 온/오프라인 광고 집행\n- 티롤초코 SNS 인플루언서 마케팅 진행",
    galleries: [
      { label: 'Online', label_en: 'Online', images: [`${BASE}/upload/tirol.png`, `${BASE}/upload/tirolchocoonline2.png`, `${BASE}/upload/tirolchocoonline.png`] },
    ],
  },
];

async function migrate() {
  const collRef = db.collection('portfolio_items');

  // 기존 데이터 확인
  const existing = await collRef.get();
  if (existing.size > 0) {
    console.log(`⚠️  이미 ${existing.size}개의 포트폴리오가 존재합니다.`);
    console.log('   기존 데이터를 유지하고 추가합니다. 중복 방지를 위해 먼저 삭제하려면 --clean 옵션을 사용하세요.');

    if (process.argv.includes('--clean')) {
      console.log('🗑️  기존 데이터 삭제 중...');
      const batch = db.batch();
      existing.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      console.log('   삭제 완료.');
    } else {
      console.log('   스킵합니다. --clean 옵션으로 재실행하세요.');
      process.exit(0);
    }
  }

  console.log(`📦 ${portfolioData.length}개 포트폴리오 시딩 시작...`);

  const now = new Date().toISOString();

  for (let i = 0; i < portfolioData.length; i++) {
    const item = portfolioData[i];
    await collRef.add({
      brandName: item.brandName,
      thumbnail: item.thumbnail,
      heroImage: item.heroImage,
      categories: item.categories,
      description: item.description,
      description_en: '',
      galleries: item.galleries,
      order: i + 1,
      visible: true,
      createdAt: now,
      updatedAt: now,
    });
    process.stdout.write(`  [${i + 1}/${portfolioData.length}] ${item.brandName}\n`);
  }

  console.log(`\n✅ ${portfolioData.length}개 포트폴리오 시딩 완료!`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ 마이그레이션 실패:', err);
  process.exit(1);
});
