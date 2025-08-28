import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SearchSpaceRequest, User } from "@/types/space";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 서버에서만 접근
});

export async function POST(req: NextRequest) {
  const { text, user }: { text: string; user?: User } = await req.json();

  try {
    const today = new Date().toISOString().slice(0, 10);
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
          오늘 날짜는 ${today}입니다.

사용자 입력을 예약 요청 JSON으로 변환하세요.
규칙:
1. 지역(regionId):
   - 서울: 1, 인천: 2, 대구: 3, 대전: 4
   - 언급 없으면: 로그인 상태면 user.location → regionId, 로그아웃이면 서울(1)
2. 카테고리(categoryId):
   - 미팅룸: 1, 행사장: 2
   - 언급 없으면 빈 값
3. 수용인원(people): 언급된 숫자, 없으면 빈 값
4. 편의시설(tagNames): /api/spaces/tags API 응답에 있는 tagName만 매칭, 없으면 빈 배열
5. 날짜/시간(startDate, endDate):
   - 항상 KST(한국 표준시) 기준 ISO 8601 포맷으로 반환
   - 입력에 날짜 언급이 없고 시간만 있는 경우, 날짜는 "1999-10-16"로, 시간은 입력한 시간 반영
   - 입력에 시간이 없고 날짜만 있는 경우 startDate = 00:00:00, endDate = 23:59:59로 하루 전체 설정
   - 입력에 날짜와 시간 모두 있으면 그대로 반영
`,
        },
        { role: "user", content: text },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reservation_request",
          schema: {
            type: "object",
            properties: {
              regionId: { type: ["number", "null"] },
              categoryId: { type: ["number", "null"] },
              people: { type: ["number", "null"] },
              tagNames: { type: "array", items: { type: "string" } },
              startDate: { type: ["string", "null"] },
              endDate: { type: ["string", "null"] },
            },
            required: [
              "regionId",
              "categoryId",
              "people",
              "tagNames",
              "startDate",
              "endDate",
            ],
          },
        },
      },
    });

    let parsed: SearchSpaceRequest;
    const message = response.choices[0].message as any;

    if (message.parsed) {
      parsed = message.parsed as SearchSpaceRequest;
    } else {
      // fallback: 혹시 parsed가 없을 때 content에서 파싱
      parsed = JSON.parse(message.content ?? "{}");
    }

    // regionId 기본값 처리
    if (!parsed.regionId) {
      parsed.regionId = user?.location ?? 1;
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Failed to parse reservation input:", err);

    if (err.status === 401) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to parse reservation input" },
      { status: 500 }
    );
  }
}
